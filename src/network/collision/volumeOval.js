import {Volume} from "./volume.js";

export class VolumeOval extends Volume {
    #base;
    #height;
    #radius;

    /**
     * Construct a vertically aligned oval constraint
     * @param {Vector3} base The base of the oval
     * @param {number} height The oval height
     * @param {number} radius The oval radius
     */
    constructor(base, height, radius) {
        super();

        this.#base = base;
        this.#height = height;
        this.#radius = radius;
    }

    /**
     * Check whether this volume contains a given point
     * @param {Vector3} point The point to check
     * @returns {boolean} True if the given point is inside the volume
     */
    contains(point) {
        const y = point.y - this.#base.y;

        if (y < 0 || y > this.#height)
            return false;

        const radius = this.#radius * Math.sin(y * Math.PI / this.#height);
        const dx = point.x - this.#base.x;
        const dz = point.z - this.#base.z;

        return dx * dx + dz * dz < radius * radius;
    }
}