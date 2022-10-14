export class Vector2 {
    x;
    y;

    /**
     * Construct the vector
     * @param {number} [x] The X value
     * @param {number} [y] The Y value
     */
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    /**
     * Multiply this vector by a scalar
     * @param {number} scalar The scalar
     * @returns {Vector2} The multiplied vector
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    /**
     * Map a factor onto the range of this vector
     * @param {number} factor The factor in the range [0, 1]
     * @returns {number} The mapped factor
     */
    map(factor) {
        return this.x + (this.y - this.x) * factor;
    }
}