import {Vector3} from "./vector3.js";

export class Matrix4 {
    buffer = new Float32Array(16);

    /**
     * Construct a 4x4 matrix
     */
    constructor() {
        this.identity();
    }

    /**
     * Set the values in this matrix to the values of another matrix
     * @param {Matrix4} other Another matrix
     * @returns {Matrix4} The modified matrix
     */
    set(other) {
        for (let i = 0; i < 16; ++i)
            this.buffer[i] = other.buffer[i];

        return this;
    }

    /**
     * Set this matrix to the identity matrix
     * @returns {Matrix4} The modified matrix
     */
    identity() {
        this.buffer[0] = this.buffer[5] = this.buffer[10] = this.buffer[15] = 1;
        this.buffer[4] = this.buffer[8] = this.buffer[12] =
            this.buffer[1] = this.buffer[9] = this.buffer[13] =
                this.buffer[2] = this.buffer[6] = this.buffer[14] =
                    this.buffer[3] = this.buffer[7] = this.buffer[11] = 0;

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

        vector.x = this.buffer[0] * _x + this.buffer[4] * _y + this.buffer[8] * _z + this.buffer[12];
        vector.y = this.buffer[1] * _x + this.buffer[5] * _y + this.buffer[9] * _z + this.buffer[13];
        vector.z = this.buffer[2] * _x + this.buffer[6] * _y + this.buffer[10] * _z + this.buffer[14];
        vector.divide(this.buffer[3] * _x + this.buffer[7] * _y + this.buffer[11] * _z + this.buffer[15]);

        return vector;
    }

    /**
     * Multiply this matrix by another matrix
     * @param {Matrix4} other The other matrix
     * @returns {Matrix4} The matrix after multiplication
     */
    multiply(other) {
        const _00 = this.buffer[0];
        const _01 = this.buffer[1];
        const _02 = this.buffer[2];
        const _03 = this.buffer[3];
        const _10 = this.buffer[4];
        const _11 = this.buffer[5];
        const _12 = this.buffer[6];
        const _13 = this.buffer[7];
        const _20 = this.buffer[8];
        const _21 = this.buffer[9];
        const _22 = this.buffer[10];
        const _23 = this.buffer[11];
        const _30 = this.buffer[12];
        const _31 = this.buffer[13];
        const _32 = this.buffer[14];
        const _33 = this.buffer[15];

        this.buffer[0] = _00 * other.buffer[0] + _10 * other.buffer[1] + _20 * other.buffer[2] + _30 * other.buffer[3];
        this.buffer[1] = _01 * other.buffer[0] + _11 * other.buffer[1] + _21 * other.buffer[2] + _31 * other.buffer[3];
        this.buffer[2] = _02 * other.buffer[0] + _12 * other.buffer[1] + _22 * other.buffer[2] + _32 * other.buffer[3];
        this.buffer[3] = _03 * other.buffer[0] + _13 * other.buffer[1] + _23 * other.buffer[2] + _33 * other.buffer[3];

        this.buffer[4] = _00 * other.buffer[4] + _10 * other.buffer[5] + _20 * other.buffer[6] + _30 * other.buffer[7];
        this.buffer[5] = _01 * other.buffer[4] + _11 * other.buffer[5] + _21 * other.buffer[6] + _31 * other.buffer[7];
        this.buffer[6] = _02 * other.buffer[4] + _12 * other.buffer[5] + _22 * other.buffer[6] + _32 * other.buffer[7];
        this.buffer[7] = _03 * other.buffer[4] + _13 * other.buffer[5] + _23 * other.buffer[6] + _33 * other.buffer[7];

        this.buffer[8] = _00 * other.buffer[8] + _10 * other.buffer[9] + _20 * other.buffer[10] + _30 * other.buffer[11];
        this.buffer[9] = _01 * other.buffer[8] + _11 * other.buffer[9] + _21 * other.buffer[10] + _31 * other.buffer[11];
        this.buffer[10] = _02 * other.buffer[8] + _12 * other.buffer[9] + _22 * other.buffer[10] + _32 * other.buffer[11];
        this.buffer[11] = _03 * other.buffer[8] + _13 * other.buffer[9] + _23 * other.buffer[10] + _33 * other.buffer[11];

        this.buffer[12] = _00 * other.buffer[12] + _10 * other.buffer[13] + _20 * other.buffer[14] + _30 * other.buffer[15];
        this.buffer[13] = _01 * other.buffer[12] + _11 * other.buffer[13] + _21 * other.buffer[14] + _31 * other.buffer[15];
        this.buffer[14] = _02 * other.buffer[12] + _12 * other.buffer[13] + _22 * other.buffer[14] + _32 * other.buffer[15];
        this.buffer[15] = _03 * other.buffer[12] + _13 * other.buffer[13] + _23 * other.buffer[14] + _33 * other.buffer[15];

        return this;
    }

    /**
     * Invert the matrix, assuming it is invertible
     * @returns {Matrix4} The modified matrix
     */
    invert() {
        const _00 = this.buffer[0];
        const _01 = this.buffer[1];
        const _02 = this.buffer[2];
        const _03 = this.buffer[3];
        const _10 = this.buffer[4];
        const _11 = this.buffer[5];
        const _12 = this.buffer[6];
        const _13 = this.buffer[7];
        const _20 = this.buffer[8];
        const _21 = this.buffer[9];
        const _22 = this.buffer[10];
        const _23 = this.buffer[11];
        const _30 = this.buffer[12];
        const _31 = this.buffer[13];
        const _32 = this.buffer[14];
        const _33 = this.buffer[15];

        const s0 = _00 * _11 - _01 * _10;
        const s1 = _00 * _21 - _01 * _20;
        const s2 = _00 * _31 - _01 * _30;
        const s3 = _10 * _21 - _11 * _20;
        const s4 = _10 * _31 - _11 * _30;
        const s5 = _20 * _31 - _21 * _30;

        const c0 = _02 * _13 - _03 * _12;
        const c1 = _02 * _23 - _03 * _22;
        const c2 = _02 * _33 - _03 * _32;
        const c3 = _12 * _23 - _13 * _22;
        const c4 = _12 * _33 - _13 * _32;
        const c5 = _22 * _33 - _23 * _32;

        const iDet = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);

        this.buffer[0] = (_11 * c5 - _21 * c4 + _31 * c3) * iDet;
        this.buffer[1] = (_21 * c2 - _31 * c1 - _01 * c5) * iDet;
        this.buffer[2] = (_01 * c4 - _11 * c2 + _31 * c0) * iDet;
        this.buffer[3] = (_11 * c1 - _21 * c0 - _01 * c3) * iDet;

        this.buffer[4] = (_20 * c4 - _30 * c3 - _10 * c5) * iDet;
        this.buffer[5] = (_00 * c5 - _20 * c2 + _30 * c1) * iDet;
        this.buffer[6] = (_10 * c2 - _30 * c0 - _00 * c4) * iDet;
        this.buffer[7] = (_00 * c3 - _10 * c1 + _20 * c0) * iDet;

        this.buffer[8] = (_13 * s5 - _23 * s4 + _33 * s3) * iDet;
        this.buffer[9] = (_23 * s2 - _33 * s1 - _03 * s5) * iDet;
        this.buffer[10] = (_03 * s4 - _13 * s2 + _33 * s0) * iDet;
        this.buffer[11] = (_13 * s1 - _23 * s0 - _03 * s3) * iDet;

        this.buffer[12] = (_22 * s4 - _32 * s3 - _12 * s5) * iDet;
        this.buffer[13] = (_02 * s5 - _22 * s2 + _32 * s1) * iDet;
        this.buffer[14] = (_12 * s2 - _32 * s0 - _02 * s4) * iDet;
        this.buffer[15] = (_02 * s3 - _12 * s1 + _22 * s0) * iDet;

        return this;
    }

    /**
     * Set this matrix to be a "look at" matrix for camera positioning
     * @param {Vector3} from The camera position
     * @param {Vector3} to The target position
     * @param {Vector3} up A normalized vector defining the up direction for the camera
     * @returns {Matrix4} The matrix after the operation
     */
    lookAt(from, to, up) {
        this.buffer[2] = from.x - to.x;
        this.buffer[6] = from.y - to.y;
        this.buffer[10] = from.z - to.z;

        const zli = 1 / Math.sqrt(this.buffer[2] * this.buffer[2] + this.buffer[6] * this.buffer[6] + this.buffer[10] * this.buffer[10]);

        this.buffer[2] *= zli;
        this.buffer[6] *= zli;
        this.buffer[10] *= zli;
        this.buffer[14] = -this.buffer[2] * from.x - this.buffer[6] * from.y - this.buffer[10] * from.z;

        this.buffer[0] = this.buffer[6] * up.z - up.y * this.buffer[10];
        this.buffer[4] = this.buffer[10] * up.x - up.z * this.buffer[2];
        this.buffer[8] = this.buffer[2] * up.y - up.x * this.buffer[6];

        const xli = 1 / Math.sqrt(this.buffer[0] * this.buffer[0] + this.buffer[4] * this.buffer[4] + this.buffer[8] * this.buffer[8]);

        this.buffer[0] *= xli;
        this.buffer[4] *= xli;
        this.buffer[8] *= xli;
        this.buffer[12] = -this.buffer[0] * from.x - this.buffer[4] * from.y - this.buffer[8] * from.z;

        this.buffer[1] = this.buffer[4] * this.buffer[10] - this.buffer[6] * this.buffer[8];
        this.buffer[5] = this.buffer[8] * this.buffer[2] - this.buffer[10] * this.buffer[0];
        this.buffer[9] = this.buffer[0] * this.buffer[6] - this.buffer[2] * this.buffer[4];
        this.buffer[13] = -this.buffer[1] * from.x - this.buffer[5] * from.y - this.buffer[9] * from.z;

        this.buffer[3] = 0;
        this.buffer[7] = 0;
        this.buffer[11] = 0;
        this.buffer[15] = 1;

        return this;
    }

    /**
     * Set this matrix to a perspective projection
     * @param {number} angle The vertical camera angle in radians
     * @param {number} aspect The aspect ratio of the viewport
     * @param {number} zNear The near clipping plane
     * @param {number} zFar The far clipping plane
     * @returns {Matrix4} The matrix after the operation
     */
    perspective(angle, aspect, zNear, zFar) {
        const a = 1 / Math.tan(angle * 0.5);
        const r = 1 / (zNear - zFar);

        this.buffer[0] = a / aspect;
        this.buffer[1] = 0;
        this.buffer[2] = 0;
        this.buffer[3] = 0;

        this.buffer[4] = 0;
        this.buffer[5] = a;
        this.buffer[6] = 0;
        this.buffer[7] = 0;

        this.buffer[8] = 0;
        this.buffer[9] = 0;
        this.buffer[10] = (zNear + zFar) * r;
        this.buffer[11] = -1;

        this.buffer[12] = 0;
        this.buffer[13] = 0;
        this.buffer[14] = zNear * zFar * (r + r);
        this.buffer[15] = 0;

        return this;
    }

    /**
     * Shift the focus of this matrix
     * @param {number} sx The X shift
     * @param {number} sy The Y shift
     */
    shift(sx, sy) {
        this.buffer[8] += sx;
        this.buffer[9] += sy;
    }

    /**
     * Extract the view frustum planes from this vector, if this matrix is the MVP matrix
     * @param {Vector3} left The left plane
     * @param {Vector3} right The right plane
     * @param {Vector3} bottom The bottom plane
     * @param {Vector3} top The top plane
     */
    frustum(left, right, bottom, top) {
        left.x = this.buffer[3] + this.buffer[0];
        left.y = this.buffer[7] + this.buffer[4];
        left.z = this.buffer[11] + this.buffer[8];
        left.normalize();

        right.x = this.buffer[3] - this.buffer[0];
        right.y = this.buffer[7] - this.buffer[4];
        right.z = this.buffer[11] - this.buffer[8];
        right.normalize();

        bottom.x = this.buffer[3] + this.buffer[1];
        bottom.y = this.buffer[7] + this.buffer[5];
        bottom.z = this.buffer[11] + this.buffer[9];
        bottom.normalize();

        top.x = this.buffer[3] - this.buffer[1];
        top.y = this.buffer[7] - this.buffer[5];
        top.z = this.buffer[11] - this.buffer[9];
        top.normalize();
    }

    /**
     * Set this matrix to an orthographic projection
     * @param {number} left The leftmost position
     * @param {number} top The top of the projection
     * @param {number} right The rightmost position
     * @param {number} bottom The bottom of the projection
     * @param {number} zNear The near clipping plane
     * @param {number} zFar The far clipping plane
     * @returns {Matrix4} The matrix after the operation
     */
    orthographic(left, top, right, bottom, zNear, zFar) {
        this.buffer[0] = 2 / (right - left);
        this.buffer[1] = this.buffer[2] = this.buffer[3] = this.buffer[4] = 0;
        this.buffer[5] = 2 / (bottom - top);
        this.buffer[6] = this.buffer[7] = this.buffer[8] = this.buffer[9] = 0;
        this.buffer[10] = 2 / (zNear - zFar);
        this.buffer[11] = 0;
        this.buffer[12] = -(right + left) / (right - left);
        this.buffer[13] = -(top + bottom) / (bottom - top);
        this.buffer[14] = -(zFar + zNear) / (zFar - zNear);
        this.buffer[15] = 1;

        return this;
    }
}