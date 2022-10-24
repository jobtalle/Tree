import {Spline} from "./spline.js";

export class BezierCubic extends Spline {
    #a;
    #b;
    #c;
    #d;

    /**
     * Construct a cubic bezier
     * @param {Vector3} a The first point
     * @param {Vector3} b The second point
     * @param {Vector3} c The third point
     * @param {Vector3} d The fourth point
     */
    constructor(a, b, c, d) {
        super();

        this.#a = a;
        this.#b = b;
        this.#c = c;
        this.#d = d;
    }

    /**
     * Sample the curve
     * @param {Vector3} vector The vector to store the sample in
     * @param {number} t The sample position in the range [0, 1]
     * @returns {Vector3} The modified vector
     */
    sample(vector, t) {
        const a = (1 - t) * (1 - t) * (1 - t);
        const b = 3 * t * (1 - t) * (1 - t);
        const c = 3 * t * t * (1 - t);
        const d = t * t * t;

        vector.x = a * this.#a.x + b * this.#b.x + c * this.#c.x + d * this.#d.x;
        vector.y = a * this.#a.y + b * this.#b.y + c * this.#c.y + d * this.#d.y;
        vector.z = a * this.#a.z + b * this.#b.z + c * this.#c.z + d * this.#d.z;

        return vector;
    }
}