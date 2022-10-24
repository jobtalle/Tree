import {Vector3} from "./vector3.js";

export class Spline {
    static #DERIVATIVE_EPSILON = .005;
    static #TEMPORARY_VECTOR = new Vector3();

    /**
     * Sample the spline
     * @param {Vector3} vector The vector to store the sample in
     * @param {number} t The sample position in the range [0, 1]
     * @returns {Vector3} The modified vector
     */
    sample(vector, t) {
        return vector;
    }

    /**
     * Sample the derivative of the curve
     * @param {Vector3} vector The vector to store the derivative in
     * @param {number} t The sample position in the range [0, 1]
     * @returns {Vector3} The modified vector
     */
    derivative(vector, t) {
        this.sample(vector, Math.min(1, t + Spline.#DERIVATIVE_EPSILON));
        this.sample(Spline.#TEMPORARY_VECTOR, Math.max(0, t - Spline.#DERIVATIVE_EPSILON));

        return vector.subtract(Spline.#TEMPORARY_VECTOR).normalize();
    }
}