import {Vector3} from "./vector3.js";

export class Matrix3 {
    buffer = new Float32Array(9);

    /**
     * Construct a 3x3 matrix
     * @param {Vector3} [direction] Optionally, the initial direction to rotate towards
     */
    constructor(direction = null) {
        if (direction) {
            const tangent = direction.tangent();
            const bitangent = new Vector3().cross(tangent, direction);

            this.buffer[0] = direction.x;
            this.buffer[1] = direction.y;
            this.buffer[2] = direction.z;

            this.buffer[3] = tangent.x;
            this.buffer[4] = tangent.y;
            this.buffer[5] = tangent.z;

            this.buffer[6] = bitangent.x;
            this.buffer[7] = bitangent.y;
            this.buffer[8] = bitangent.z;
        }
        else
            this.identity();
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