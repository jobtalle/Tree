import {Volume} from "./volume.js";

export class VolumeCylinder extends Volume {
    #center;
    #radiusSquared;

    /**
     * Construct a vertical cylinder
     * @param {Vector3} center The cylinder center
     * @param {number} radius The cylinder radius
     */
    constructor(center, radius) {
        super();

        this.#center = center;
        this.#radiusSquared = radius * radius;
    }

    /**
     * Check whether this volume contains a given point
     * @param {Vector3} point The point to check
     * @returns {boolean} True if the given point is inside the volume
     */
    contains(point) {
        const dx = point.x - this.#center.x;
        const dz = point.z - this.#center.z;

        return dx * dx + dz * dz < this.#radiusSquared;
    }
}