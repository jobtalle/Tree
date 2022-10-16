import {gl} from "./gl/gl.js";
import {Color} from "./color.js";
import {Shaders} from "./gl/shaders/shaders.js";
import {Renderables} from "./gl/renderable/renderables.js";
import {Uniforms} from "./gl/uniforms/uniforms.js";
import {Camera} from "./camera/camera.js";
import {CameraControllerOrbit} from "./camera/cameraControllerOrbit.js";
import {Network} from "./tree/network/network.js";
import {Configuration} from "./tree/configuration.js";
import {Random} from "./math/random.js";
import {AttributesWireframe} from "./gl/attributes/attributesWireframe.js";
import {AttributesIndices} from "./gl/attributes/attributesIndices.js";
import {ModellerWireframe} from "./modellers/modellerWireframe.js";
import {Interface} from "./interface/interface.js";

export class Tree {
    static #CANVAS = document.getElementById("renderer");
    static #COLOR_BACKGROUND = new Color("#336997");

    #width;
    #height;
    #camera = new Camera();
    #cameraController = new CameraControllerOrbit(this.#camera);
    #random = new Random();
    #configuration = new Configuration();
    #interface = new Interface(this.#configuration, this.execute.bind(this));
    #network = null;
    #updated = true;

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

        window.addEventListener("keydown", event => {
            switch (event.key) {
                case " ":
                    this.execute();

                    break;
            }
        })

        this.execute();
    }

    /**
     * Execute the algorithm with current parameters
     */
    execute() {
        this.#random.float;

        this.#network = new Network(this.#random.fork(), this.#configuration);

        const attributes = new AttributesWireframe();
        const indices = new AttributesIndices();

        for (const root of this.#network.roots)
            new ModellerWireframe(attributes, indices, root).model();

        Renderables.WIREFRAME.upload(attributes, indices);

        this.#updated = true;
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
        if (this.#updated || this.#cameraController.render(time))
            this.#updated = false;
        else
            return;

        this.#camera.updateVP();

        Uniforms.GLOBALS.setVP(this.#camera.vp);
        Uniforms.GLOBALS.upload();

        gl.viewport(0, 0, this.#width, this.#height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        Shaders.WIREFRAME.use();
        Renderables.WIREFRAME.draw();
    }
}