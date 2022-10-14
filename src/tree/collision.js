export class Collision {
    static EPSILON = .001;

    #spheres = [];
    #radii = [];

    /**
     * Check if a sphere fits in the collision field
     * @param {Vector3} center The sphere center
     * @param {number} radius The sphere radius
     * @returns {boolean} True if the sphere would fit in the collision field
     */
    fits(center, radius) {
        for (let sphere = 0, sphereCount = this.#spheres.length; sphere < sphereCount; ++sphere)
            if (center.squaredDistanceTo(this.#spheres[sphere]) <
                (radius + this.#radii[sphere]) * (radius + this.#radii[sphere]) - Collision.EPSILON)
                return false;

        return true;
    }

    /**
     * Add a sphere to the collision field
     * @param {Vector3} center The sphere center
     * @param {number} radius The sphere radius
     */
    add(center, radius) {
        this.#spheres.push(center);
        this.#radii.push(radius);
    }
}