import {gl} from "./gl/gl.js";
import {Color} from "./color.js";
import {Shaders} from "./gl/shaders/shaders.js";
import {Renderables} from "./gl/renderable/renderables.js";
import {Uniforms} from "./gl/uniforms/uniforms.js";
import {Camera} from "./camera/camera.js";
import {CameraControllerOrbit} from "./camera/cameraControllerOrbit.js";
import {Network} from "./network/network.js";
import {Configuration} from "./network/configuration.js";
import {AttributesWireframe} from "./gl/attributes/attributesWireframe.js";
import {AttributesIndices} from "./gl/attributes/attributesIndices.js";
import {ModellerWireframe} from "./modellers/modellerWireframe.js";
import {Interface} from "./interface.js";
import {AttributesSpheres} from "./gl/attributes/attributesSpheres.js";
import {ModellerSpheres} from "./modellers/modellerSpheres.js";
import {Vector3} from "./math/vector3.js";
import {RenderLayer} from "./renderLayer.js";
import {Report} from "./report.js";
import {AttributesBranches} from "./gl/attributes/attributesBranches.js";
import {ModellerBranches} from "./modellers/modellerBranches.js";
import {Shadow} from "./gl/shadow.js";
import {AttributesFloor} from "./gl/attributes/attributesFloor.js";
import {Collision} from "./network/collision/collision.js";

export class Tree {
    static #CANVAS = document.getElementById("renderer");
    static #COLOR_BACKGROUND = new Color("#6790d2");
    static #SUN = new Vector3(-1, -2, 0).normalize();

    #width;
    #height;
    #camera = new Camera();
    #cameraController = new CameraControllerOrbit(this.#camera);
    #shadow = new Shadow(Tree.#SUN, new Vector3(Collision.SIZE * .5, 0, Collision.SIZE * .5));
    #network = null;
    #modifiedUniforms = true;
    #modifiedNetwork = true;
    #layers = 0;
    #modelled = 0;
    #configuration = new Configuration();

    /**
     * Construct the tree grower
     */
    constructor() {
        new Interface(
            this.#configuration,
            () => this.#modifiedUniforms = true,
            () => this.#modifiedNetwork = true)

        this.#width = Tree.#CANVAS.width;
        this.#height = Tree.#CANVAS.height;
        this.#camera.updateProjection(this.#width / this.#height);

        gl.clearColor(Tree.#COLOR_BACKGROUND.r, Tree.#COLOR_BACKGROUND.g, Tree.#COLOR_BACKGROUND.b, 1);

        Tree.#CANVAS.addEventListener("mousedown", event => {
            this.#cameraController.mouseDown(
                event.clientX / Tree.#CANVAS.clientHeight,
                event.clientY / Tree.#CANVAS.clientHeight);
        });

        Tree.#CANVAS.addEventListener("mousemove", event => {
            this.#cameraController.mouseMove(
                event.clientX / Tree.#CANVAS.clientHeight,
                event.clientY / Tree.#CANVAS.clientHeight);
        });

        Tree.#CANVAS.addEventListener("mouseup", () => {
            this.#cameraController.mouseUp();
        });

        Tree.#CANVAS.addEventListener("wheel", event => {
            if (event.deltaY > 0)
                this.#cameraController.scrollDown();
            else if (event.deltaY < 0)
                this.#cameraController.scrollUp();
        }, {
            passive: true
        });

        Uniforms.GLOBALS.setSun(Tree.#SUN);

        gl.enable(gl.DEPTH_TEST);

        this.#initializeFloor();
    }

    /**
     * Initialize the floor
     */
    #initializeFloor() {
        const attributes = new AttributesFloor();
        const indices = new AttributesIndices();

        attributes.push(new Vector3(0, 0, 0));
        attributes.push(new Vector3(Collision.SIZE, 0, 0));
        attributes.push(new Vector3(Collision.SIZE, 0, Collision.SIZE));
        attributes.push(new Vector3(0, 0, Collision.SIZE));

        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(2);
        indices.push(3);
        indices.push(0);

        Renderables.FLOOR.upload(attributes, indices);
    }

    /**
     * Update uniforms read from configuration
     */
    #updateUniforms() {
        Uniforms.GLOBALS.setGrowth(this.#configuration.growth * this.#network.depth);
        Uniforms.GLOBALS.upload();

        this.#layers =
            (this.#configuration.layerBranches ? RenderLayer.BRANCHES : 0) |
            (this.#configuration.layerWireframe ? RenderLayer.WIREFRAME : 0) |
            (this.#configuration.layerSpheres ? RenderLayer.SPHERES : 0);

        this.#model();
        this.#updateShadows();
    }

    /**
     * Execute the algorithm with current parameters
     */
    #updateNetwork() {
        const newNetwork = new Network(this.#configuration);

        if (newNetwork.valid) {
            this.#network = newNetwork;
            this.#cameraController.setPivot(this.#network.center);
            this.#modelled = 0;

            Report.report(this.#network);
        }
    }

    /**
     * Model any non modelled layers
     */
    #model() {
        for (let layer = 1; layer < RenderLayer.LAST; layer <<= 1) {
            if (!(layer & this.#modelled) && layer & this.#layers) {
                switch (layer) {
                    case RenderLayer.WIREFRAME: {
                        const attributes = new AttributesWireframe();
                        const indices = new AttributesIndices();

                        for (const root of this.#network.roots)
                            new ModellerWireframe(attributes, indices, root).model();

                        Renderables.WIREFRAME.upload(attributes, indices);
                    }
                        break;
                    case RenderLayer.SPHERES: {
                        const attributes = new AttributesSpheres();

                        for (const root of this.#network.roots)
                            new ModellerSpheres(attributes, root).model();

                        Renderables.SPHERES.uploadInstances(attributes);
                    }
                        break;
                    case RenderLayer.BRANCHES: {
                        const attributes = new AttributesBranches();
                        const indices = new AttributesIndices();

                        for (const root of this.#network.roots)
                            new ModellerBranches(attributes, indices, root).model();

                        Renderables.BRANCHES.upload(attributes, indices);
                    }
                        break;
                }
            }
        }

        this.#modelled |= this.#layers;
    }

    /**
     * Update the shadow map
     */
    #updateShadows() {
        this.#shadow.target();

        gl.clear(gl.DEPTH_BUFFER_BIT);

        if (this.#layers & RenderLayer.BRANCHES) {
            gl.enable(gl.CULL_FACE);

            Shaders.BRANCHES_DEPTH.use();
            Renderables.BRANCHES.draw();

            gl.disable(gl.CULL_FACE);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * Update before rendering
     */
    render() {
        let update = this.#cameraController.render();

        if (this.#modifiedNetwork) {
            this.#modifiedNetwork = this.#modifiedUniforms = false;

            this.#updateNetwork();
            this.#updateUniforms();

            update = true;
        } else if (this.#modifiedUniforms) {
            this.#modifiedUniforms = false;

            this.#updateUniforms();

            update = true;
        }

        if (!update)
            return;

        this.#camera.updateVP();

        Uniforms.GLOBALS.setVP(this.#camera.vp);
        Uniforms.GLOBALS.setEye(this.#cameraController.eye);
        Uniforms.GLOBALS.setDirection(this.#cameraController.direction);
        Uniforms.GLOBALS.upload();

        gl.viewport(0, 0, this.#width, this.#height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.CULL_FACE);

        Shaders.FLOOR.use();
        Renderables.FLOOR.draw();

        gl.disable(gl.CULL_FACE);

        if (this.#layers & RenderLayer.BRANCHES) {
            gl.enable(gl.CULL_FACE);

            Shaders.BRANCHES.use();
            Renderables.BRANCHES.draw();

            gl.disable(gl.CULL_FACE);
        }

        if (this.#layers & RenderLayer.SPHERES) {
            gl.enable(gl.CULL_FACE);

            if (this.#layers & RenderLayer.BRANCHES)
                gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);

            Shaders.SPHERES.use();
            Renderables.SPHERES.draw();

            gl.disable(gl.CULL_FACE);
            gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
        }

        if (this.#layers & RenderLayer.WIREFRAME) {
            gl.disable(gl.DEPTH_TEST);

            Shaders.WIREFRAME.use();
            Renderables.WIREFRAME.draw();

            gl.enable(gl.DEPTH_TEST);
        }
    }
}