export class Volume {
    negative = false;

    /**
     * Negate the volume
     * @returns {Volume} The negated volume
     */
    negate() {
        this.negative = !this.negative;

        return this;
    }

    /**
     * Check whether this volume contains a given point
     * @param {Vector3} point The point to check
     * @returns {boolean} True if the given point is inside the volume
     */
    contains(point) {
        return false;
    }
}