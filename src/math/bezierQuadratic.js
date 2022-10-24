import {Spline} from "./spline.js";

export class BezierQuadratic extends Spline {
    #a;
    #b;
    #c;

    /**
     * Construct a quadratic bezier
     * @param {Vector3} a The first point
     * @param {Vector3} b The second point
     * @param {Vector3} c The third point
     */
    constructor(a, b, c) {
        super();

        this.#a = a;
        this.#b = b;
        this.#c = c;
    }

    /**
     * Sample the curve
     * @param {Vector3} vector The vector to store the sample in
     * @param {number} t The sample position in the range [0, 1]
     * @returns {Vector3} The modified vector
     */
    sample(vector, t) {
        const i = 1 - t;
        const a = i * i;
        const b = (t + t) * i;
        const c = t * t;

        vector.x = a * this.#a.x + b * this.#b.x + c * this.#c.x;
        vector.y = a * this.#a.y + b * this.#b.y + c * this.#c.y;
        vector.z = a * this.#a.z + b * this.#b.z + c * this.#c.z;

        return vector;
    }
}