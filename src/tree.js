import {gl} from "./gl/gl.js";
import {Color} from "./color.js";
import {Shaders} from "./gl/shaders/shaders.js";
import {Renderables} from "./gl/renderable/renderables.js";
import {Uniforms} from "./gl/uniforms/uniforms.js";
import {Camera} from "./camera/camera.js";
import {CameraControllerOrbit} from "./camera/cameraControllerOrbit.js";
import {Network} from "./tree/network/network.js";
import {Configuration} from "./tree/configuration.js";
import {AttributesWireframe} from "./gl/attributes/attributesWireframe.js";
import {AttributesIndices} from "./gl/attributes/attributesIndices.js";
import {ModellerWireframe} from "./modellers/modellerWireframe.js";
import {Interface} from "./interface/interface.js";
import {AttributesSpheres} from "./gl/attributes/attributesSpheres.js";
import {ModellerSpheres} from "./modellers/modellerSpheres.js";
import {Vector3} from "./math/vector3.js";
import {RenderLayer} from "./renderLayer.js";

export class Tree {
    static #CANVAS = document.getElementById("renderer");
    static #COLOR_BACKGROUND = new Color("#6790d2");
    static #SUN = new Vector3(-1, -1, 0).normalize();

    #width;
    #height;
    #camera = new Camera();
    #cameraController = new CameraControllerOrbit(this.#camera);
    #network = null;
    #modifiedUniforms = true;
    #modifiedNetwork = true;
    #layers = RenderLayer.WIREFRAME | RenderLayer.SPHERES;
    #modelled = 0;
    #configuration = new Configuration();
    #interface = new Interface(
        this.#configuration,
        () => this.#modifiedUniforms = true,
        () => this.#modifiedNetwork = true);

    /**
     * Construct the tree grower
     */
    constructor() {
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
    }

    /**
     * Update uniforms read from configuration
     */
    #updateUniforms() {
        Uniforms.GLOBALS.setGrowth(this.#configuration.growth * this.#network.depth);

        this.#layers =
            (this.#configuration.layerGeometry ? RenderLayer.SPHERES : 0) |
            (this.#configuration.layerWireframe ? RenderLayer.WIREFRAME : 0);

        this.#model();
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
        }
    }

    /**
     * Model any non modelled layers
     */
    #model() {
        for (let layer = 1; layer & this.#layers; layer <<= 1) if (!(layer & this.#modelled)) switch (layer) {
            case RenderLayer.WIREFRAME: {
                const attributes = new AttributesWireframe();
                const indices = new AttributesIndices();

                for (const root of this.#network.roots)
                    new ModellerWireframe(attributes, indices, root).model();

                Renderables.WIREFRAME.upload(attributes, indices);
            } break;
            case RenderLayer.SPHERES: {
                const attributes = new AttributesSpheres();

                for (const root of this.#network.roots)
                    new ModellerSpheres(attributes, root).model();

                Renderables.SPHERES.uploadInstances(attributes);
            } break;
        }

        this.#modelled |= this.#layers;
    }

    /**
     * Update the state
     */
    update() {
        this.#cameraController.update();
    }

    /**
     * Update before rendering
     * @param {number} time The time interpolation in the range [0, 1]
     */
    render(time) {
        let update = this.#cameraController.render(time);

        if (this.#modifiedNetwork) {
            this.#modifiedNetwork = false;

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
        Uniforms.GLOBALS.setSun(this.#cameraController.direction);
        Uniforms.GLOBALS.upload();

        gl.viewport(0, 0, this.#width, this.#height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (this.#layers & RenderLayer.SPHERES) {
            gl.enable(gl.CULL_FACE);

            Shaders.SPHERES.use();
            Renderables.SPHERES.draw();

            gl.disable(gl.CULL_FACE);
        }

        if (this.#layers & RenderLayer.WIREFRAME) {
            gl.disable(gl.DEPTH_TEST);

            Shaders.WIREFRAME.use();
            Renderables.WIREFRAME.draw();

            gl.enable(gl.DEPTH_TEST);
        }
    }
}