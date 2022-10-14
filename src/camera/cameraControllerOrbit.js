import {CameraController} from "./cameraController.js";
import {Vector2} from "../math/vector2.js";
import {Vector3} from "../math/vector3.js";
import {Camera} from "./camera.js";

export class CameraControllerOrbit extends CameraController {
    #sensitivity;
    #down = false;
    #anchor = new Vector2();
    #from = new Vector3();
    #pivot = new Vector3();
    #angle = 0;
    #pitch = .6;
    #zoom;

    /**
     * Construct a camera controller
     * @param {Camera} camera The camera to control
     * @param {number} [zoom] The initial zoom level
     * @param {number} [sensitivity] The mouse sensitivity
     */
    constructor(camera, zoom = 2.2, sensitivity = 4) {
        super(camera);

        this.#sensitivity = sensitivity;
        this.#zoom = zoom;

        this.moved();
    }

    /**
     * Set the pivot
     * @param {number} x The X coordinate
     * @param {number} y The Y coordinate
     * @param {number} z The Z coordinate
     */
    setPivot(x, y, z) {
        this.#pivot.setCoordinates(x, y, z);

        this.moved();
    }

    /**
     * Get a vector pointing towards the side
     * @param {Vector3} vector The vector to store the side vector in
     * @returns {Vector3} The modified vector
     */
    side(vector) {
        vector.setCoordinates(-Math.sin(this.#angle), 0, Math.cos(this.#angle));

        return vector;
    }

    /**
     * Press the mouse
     * @param {number} x The X coordinate in the range [0, 1]
     * @param {number} y The Y coordinate in the range [0, 1]
     */
    mouseDown(x, y) {
        this.#down = true;
        this.#anchor.x = x;
        this.#anchor.y = y;
    }

    /**
     * Move the mouse
     * @param {number} x The X coordinate in the range [0, 1]
     * @param {number} y The Y coordinate in the range [0, 1]
     */
    mouseMove(x, y) {
        if (!this.#down)
            return;

        const dx = x - this.#anchor.x;
        const dy = y - this.#anchor.y;

        this.#angle -= dx * this.#sensitivity;
        this.#pitch += dy * this.#sensitivity;

        this.#anchor.x = x;
        this.#anchor.y = y;

        this.moved();
    }

    /**
     * Release the mouse
     */
    mouseUp() {
        this.#down = false;
    }

    /**
     * Scroll up
     */
    scrollUp() {
        this.#zoom *= .9;

        this.moved();
    }

    /**
     * Scroll down
     */
    scrollDown() {
        this.#zoom *= 1.1;

        this.moved();
    }

    /**
     * The perspective has moved
     */
    moved() {
        this.#from.x = this.#pivot.x + Math.cos(this.#angle) * Math.cos(this.#pitch) * this.#zoom;
        this.#from.y = this.#pivot.y + Math.sin(this.#pitch) * this.#zoom;
        this.#from.z = this.#pivot.z + Math.sin(this.#angle) * Math.cos(this.#pitch) * this.#zoom;

        this.camera.view.lookAt(this.#from, this.#pivot, Camera.UP);
    }
}