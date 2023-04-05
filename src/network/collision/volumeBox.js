import {Volume} from "./volume.js";

export class VolumeBox extends Volume {
    base;
    height;
    radius;

    /**
     * Construct a box constraint
     * @param {Vector3} base The base of the box
     * @param {number} height The box height
     * @param {number} radius The box radius
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
        return point.y > 0 &&
            point.y < this.height &&
            point.x > this.base.x - this.radius &&
            point.x < this.base.x + this.radius &&
            point.z > this.base.z - this.radius &&
            point.z < this.base.z + this.radius;
    }
}