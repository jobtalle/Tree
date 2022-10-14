import {Matrix4} from "../math/matrix4.js";
import {Vector2} from "../math/vector2.js";

export class Camera {
    static #Z_NEAR = .001;
    static #Z_FAR = 10;

    #projection = new Matrix4();
    #shift;
    view = new Matrix4();
    vp = new Matrix4();

    /**
     * Construct a camera
     * @param {Vector2} [shift] The projection focus shift
     */
    constructor(shift = new Vector2()) {
        this.#shift = shift;
    }

    /**
     * Get the shift
     * @returns {Vector2} The camera shift
     */
    get shift() {
        return this.#shift;
    }

    /**
     * Update the projection matrix
     * @param {number} aspect The aspect ratio
     */
    updateProjection(aspect) {
        this.#projection.perspective(
            Math.PI * .3,
            aspect,
            Camera.#Z_NEAR,
            Camera.#Z_FAR);
    }

    /**
     * Update the MVP matrix
     */
    updateVP() {
        this.vp.set(this.#projection);
        this.vp.shift(this.#shift.x, this.#shift.y);
        this.vp.multiply(this.view);
    }
}