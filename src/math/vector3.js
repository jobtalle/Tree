export class Vector3 {
    static UP = Object.freeze(new Vector3(0, 1, 0));
    static UP_ALT = Object.freeze(new Vector3(.1, 1, 0).normalize());

    x;
    y;
    z;

    /**
     * Construct a 3D vector
     * @param {number} [x] The X value
     * @param {number} [y] The Y value
     * @param {number} [z] The Z value
     */
    constructor(x = 0, y = x, z = y) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Copy this vector
     * @returns {Vector3} A copy of this vector
     */
    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Make a vector that is a tangent of this vector
     * @returns {Vector3} A new vector that is a tangent of this vector
     */
    tangent() {
        if (this.equals(Vector3.UP))
            return new Vector3().cross(this, Vector3.UP_ALT).normalize();

        return new Vector3().crossUp(this).normalize();
    }

    /**
     * Calculate the cross product a vector and the up vector
     * @param {Vector3} vector A vector
     * @returns {Vector3} The modified vector containing the cross product
     */
    crossUp(vector) {
        this.x = -vector.y;
        this.y = vector.x;
        this.z = 0;

        return this;
    }

    /**
     * Set this vector to another vector
     * @param {Vector3} other The other vector
     * @returns {Vector3} The modified vector
     */
    set(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;

        return this;
    }

    /**
     * Set the coordinates of this vector
     * @param {number} x The X coordinate
     * @param {number} y The Y coordinate
     * @param {number} z The Z coordinate
     * @returns {Vector3} The modified vector
     */
    setCoordinates(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * Check if this vector equals another vector
     * @param {Vector3} other The other vector to compare to
     * @returns {boolean} True if this vector is equal to the given vector
     */
    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    /**
     * Add a vector to this vector
     * @param {Vector3} vector The vector to add to this vector
     * @returns {Vector3} The modified vector
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;

        return this;
    }

    /**
     * Add a vector to this vector multiplied by a scalar
     * @param {Vector3} vector The vector to add to this vector
     * @param {number} scalar The number to multiply the vector by
     * @returns {Vector3} The modified vector
     */
    addMultiplied(vector, scalar) {
        this.x += vector.x * scalar;
        this.y += vector.y * scalar;
        this.z += vector.z * scalar;

        return this;
    }

    /**
     * Subtract a vector from this vector
     * @param {Vector3} vector The vector to subtract from this vector
     * @returns {Vector3} The modified vector
     */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;

        return this;
    }

    /**
     * Subtract a vector from this vector multiplied by a scalar
     * @param {Vector3} vector The vector to subtract from this vector
     * @param {number} scalar The number to multiply the vector by
     * @returns {Vector3} The modified vector
     */
    subtractMultiplied(vector, scalar) {
        this.x -= vector.x * scalar;
        this.y -= vector.y * scalar;
        this.z -= vector.z * scalar;

        return this;
    }

    /**
     * Negate this vector
     * @returns {Vector3} The negated vector
     */
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    }

    /**
     * Multiply this vector by a scalar
     * @param {number} scalar The scalar
     * @returns {Vector3} The multiplied vector
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    }

    /**
     * Multiply this vector by a vector
     * @param {Vector3} other The vector
     * @returns {Vector3} The multiplied vector
     */
    multiplyVector(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;

        return this;
    }

    /**
     * Divide this vector by a scalar
     * @param {number} scalar The scalar to divide by
     * @returns {Vector3} The divided vector
     */
    divide(scalar) {
        return this.multiply(1 / scalar);
    }

    /**
     * Calculate the cross product of two vectors
     * @param {Vector3} a A vector
     * @param {Vector3} b A vector
     * @returns {Vector3} The modified vector containing the cross product
     */
    cross(a, b) {
        this.x = a.y * b.z - b.y * a.z;
        this.y = a.z * b.x - b.z * a.x;
        this.z = a.x * b.y - b.x * a.y;

        return this;
    }

    /**
     * Get the dot product of this vector and another vector
     * @param {Vector3} vector The other vector
     * @returns {number} The length of this vector
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    /**
     * Normalize this vector
     * @returns {Vector3} The normalized vector
     */
    normalize() {
        return this.divide(this.length);
    }

    /**
     * Calculate the distance from this vector to another distance
     * @param {Vector3} other The other vector
     * @returns {number} The distance
     */
    distanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dz = other.z - this.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Get the length of this vector
     * @returns {number} The length of this vector
     */
    get length() {
        return Math.sqrt(this.dot(this));
    }
}