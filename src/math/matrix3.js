import {Vector3} from "./vector3.js";

export class Matrix3 {
    buffer = new Float32Array(9);

    /**
     * Construct a 3x3 matrix
     * @param {Vector3 | Matrix3} [source] Optionally, the source to construct this matrix from
     */
    constructor(source = null) {
        if (source instanceof Vector3) {
            const tangent = source.tangent();
            const bitangent = new Vector3().cross(tangent, source);

            this.buffer[0] = source.x;
            this.buffer[1] = source.y;
            this.buffer[2] = source.z;

            this.buffer[3] = tangent.x;
            this.buffer[4] = tangent.y;
            this.buffer[5] = tangent.z;

            this.buffer[6] = bitangent.x;
            this.buffer[7] = bitangent.y;
            this.buffer[8] = bitangent.z;
        }
        else if (source instanceof Matrix3)
            this.buffer.set(source.buffer);
        else
            this.identity();
    }

    /**
     * Copy this matrix
     * @returns {Matrix3} The new matrix
     */
    copy() {
        return new Matrix3(this);
    }

    /**
     * Set the rotation this matrix is pointing towards
     * @param {Vector3} direction The new normalized direction
     */
    set direction(direction) {
        this.buffer[0] = direction.x;
        this.buffer[1] = direction.y;
        this.buffer[2] = direction.z;

        this.buffer[3] = this.buffer[7] * this.buffer[2] - this.buffer[1] * this.buffer[8];
        this.buffer[4] = this.buffer[8] * this.buffer[0] - this.buffer[2] * this.buffer[6];
        this.buffer[5] = this.buffer[6] * this.buffer[1] - this.buffer[0] * this.buffer[7];

        const il = 1 / Math.sqrt(
            this.buffer[3] * this.buffer[3] +
            this.buffer[4] * this.buffer[4] +
            this.buffer[5] * this.buffer[5]);

        this.buffer[3] *= il;
        this.buffer[4] *= il;
        this.buffer[5] *= il;

        this.buffer[6] = this.buffer[1] * this.buffer[5] - this.buffer[4] * this.buffer[2];
        this.buffer[7] = this.buffer[2] * this.buffer[3] - this.buffer[5] * this.buffer[0];
        this.buffer[8] = this.buffer[0] * this.buffer[4] - this.buffer[3] * this.buffer[1];
    }

    /**
     * Set this matrix to the identity matrix
     * @returns {Matrix3} The modified matrix
     */
    identity() {
        this.buffer[0] = this.buffer[4] = this.buffer[8] = 1;
        this.buffer[1] = this.buffer[2] =
            this.buffer[3] = this.buffer[5] =
                this.buffer[6] = this.buffer[7] = 0;

        return this;
    }

    /**
     * Multiply this matrix by another matrix
     * @param {Matrix3} other The other matrix
     * @returns {Matrix3} The matrix after multiplication
     */
    multiply(other) {
        const _00 = this.buffer[0];
        const _01 = this.buffer[1];
        const _02 = this.buffer[2];
        const _10 = this.buffer[3];
        const _11 = this.buffer[4];
        const _12 = this.buffer[5];
        const _20 = this.buffer[6];
        const _21 = this.buffer[7];
        const _22 = this.buffer[8];

        this.buffer[0] = _00 * other.buffer[0] + _10 * other.buffer[1] + _20 * other.buffer[2];
        this.buffer[1] = _01 * other.buffer[0] + _11 * other.buffer[1] + _21 * other.buffer[2];
        this.buffer[2] = _02 * other.buffer[0] + _12 * other.buffer[1] + _22 * other.buffer[2];

        this.buffer[3] = _00 * other.buffer[3] + _10 * other.buffer[4] + _20 * other.buffer[5];
        this.buffer[4] = _01 * other.buffer[3] + _11 * other.buffer[4] + _21 * other.buffer[5];
        this.buffer[5] = _02 * other.buffer[3] + _12 * other.buffer[4] + _22 * other.buffer[5];

        this.buffer[6] = _00 * other.buffer[6] + _10 * other.buffer[7] + _20 * other.buffer[8];
        this.buffer[7] = _01 * other.buffer[6] + _11 * other.buffer[7] + _21 * other.buffer[8];
        this.buffer[8] = _02 * other.buffer[6] + _12 * other.buffer[7] + _22 * other.buffer[8];

        return this;
    }

    /**
     * Multiply a vector by this matrix
     * @param {Vector3} vector A vector to multiply
     * @returns {Vector3} The modified vector
     */
    apply(vector) {
        const _x = vector.x;
        const _y = vector.y;
        const _z = vector.z;

        vector.x = this.buffer[0] * _x + this.buffer[3] * _y + this.buffer[6] * _z;
        vector.y = this.buffer[1] * _x + this.buffer[4] * _y + this.buffer[7] * _z;
        vector.z = this.buffer[2] * _x + this.buffer[5] * _y + this.buffer[8] * _z;

        return vector;
    }
}