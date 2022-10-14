import {gl} from "./gl/gl.js";
import {Color} from "./color.js";
import {Shaders} from "./gl/shaders/shaders.js";
import {Renderables} from "./gl/renderable/renderables.js";
import {AttributesWireframe} from "./gl/attributes/attributesWireframe.js";
import {AttributesIndices} from "./gl/attributes/attributesIndices.js";
import {Vector3} from "./math/vector3.js";
import {Uniforms} from "./gl/uniforms/uniforms.js";
import {Camera} from "./camera/camera.js";
import {CameraControllerOrbit} from "./camera/cameraControllerOrbit.js";
import {Vector2} from "./math/vector2.js";
import {Network} from "./tree/network/network.js";
import {Parameters} from "./tree/parameters.js";
import {Random} from "./math/random.js";

export class Tree {
    static #COLOR_BACKGROUND = new Color("#336997");

    #width;
    #height;
    #camera = new Camera(new Vector2(0, .25));
    #cameraController = new CameraControllerOrbit(this.#camera);
    #random = new Random();
    #parameters = new Parameters();
    #network = new Network(this.#random.fork(), this.#parameters);

    /**
     * Construct the tree grower
     * @param {number} width The viewport width
     * @param {number} height The viewport height
     * @param {HTMLCanvasElement} canvas The canvas that is being rendered to
     */
    constructor(width, height, canvas) {
        this.#width = width;
        this.#height = height;
        this.#camera.updateProjection(width / height);

        gl.clearColor(Tree.#COLOR_BACKGROUND.r, Tree.#COLOR_BACKGROUND.g, Tree.#COLOR_BACKGROUND.b, 1);

        const wireframeAttributes = new AttributesWireframe();
        const wireframeIndices = new AttributesIndices();

        wireframeAttributes.push(new Vector3(-1, 0, 0));
        wireframeAttributes.push(new Vector3(1, 0, 0));

        wireframeAttributes.push(new Vector3(0, 0, -1));
        wireframeAttributes.push(new Vector3(0, 0, 1));

        wireframeIndices.push(0);
        wireframeIndices.push(1);
        wireframeIndices.push(2);
        wireframeIndices.push(3);

        Renderables.WIREFRAME.upload(wireframeAttributes, wireframeIndices);

        canvas.addEventListener("mousedown", event => {
            this.#cameraController.mouseDown(
                event.clientX / canvas.clientHeight,
                event.clientY / canvas.clientHeight);
        });

        canvas.addEventListener("mousemove", event => {
            this.#cameraController.mouseMove(
                event.clientX / canvas.clientHeight,
                event.clientY / canvas.clientHeight);
        });

        canvas.addEventListener("mouseup", () => {
            this.#cameraController.mouseUp();
        });

        canvas.addEventListener("wheel", event => {
            if (event.deltaY > 0)
                this.#cameraController.scrollDown();
            else if (event.deltaY < 0)
                this.#cameraController.scrollUp();
        }, {
            passive: true
        });
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
        this.#cameraController.render(time);
        this.#camera.updateVP();

        Uniforms.GLOBALS.setVP(this.#camera.vp);
        Uniforms.GLOBALS.upload();

        gl.viewport(0, 0, this.#width, this.#height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        Shaders.WIREFRAME.use();
        Renderables.WIREFRAME.draw();
    }
}