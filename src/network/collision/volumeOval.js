import {Volume} from "./volume.js";

export class VolumeOval extends Volume {
    base;
    height;
    radius;

    /**
     * Construct a vertically aligned oval constraint
     * @param {Vector3} base The base of the oval
     * @param {number} height The oval height
     * @param {number} radius The oval radius
     */
    constructor(base, height, radius) {
        super();

        this.base = base;
        this.height = height;
        this.radius = radius;
    }

    /**
     * Check whether this volume contains a given point
     * @param {Vector3} point The point to check
     * @returns {boolean} True if the given point is inside the volume
     */
    contains(point) {
        const y = point.y - this.base.y;

        if (y < 0 || y > this.height)
            return false;

        const dx = (point.x - this.base.x) / this.radius;
        const dy = (point.y - (this.base.y + this.height * .5)) / (this.height * .5);
        const dz = (point.z - this.base.z) / this.radius;

        return dx * dx + dy * dy + dz * dz < 1;
    }
}