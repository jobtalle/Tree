import {Spline} from "./spline.js";

export class Line extends Spline {
    #a;
    #b;

    /**
     * Construct a line segment
     * @param {Vector3} a The start
     * @param {Vector3} b The end
     */
    constructor(a, b) {
        super();

        this.#a = a;
        this.#b = b;
    }

    /**
     * Sample the spline
     * @param {Vector3} vector The vector to store the sample in
     * @param {number} t The sample position in the range [0, 1]
     * @returns {Vector3} The modified vector
     */
    sample(vector, t) {
        return vector.set(this.#b).subtract(this.#a).multiply(t).add(this.#a);
    }

    /**
     * Sample the derivative of the curve
     * @param {Vector3} vector The vector to store the derivative in
     * @param {number} t The sample position in the range [0, 1]
     * @returns {Vector3} The modified vector
     */
    derivative(vector, t) {
        return vector.set(this.#b).subtract(this.#a).normalize();
    }
}