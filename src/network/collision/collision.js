export class Collision {
    static SIZE = 3;
    static SUBDIVISION = 24;
    static INVERSE_CELL_SIZE = Collision.SUBDIVISION / Collision.SIZE;
    static RADIUS_MAX = .12;
    static #EPSILON = .001;

    #spheres = [];
    #radii = [];
    #volumes = [];

    /**
     * Construct a collision grid
     */
    constructor() {
        for (let cell = 0, cellCount = Collision.SUBDIVISION ** 3; cell < cellCount; ++cell) {
            this.#spheres.push([]);
            this.#radii.push([]);
        }
    }

    /**
     * Add a collision volume
     * @param {Volume} volume The volume to add
     */
    addVolume(volume) {
        this.#volumes.push(volume);
    }

    /**
     * Check whether a vector is within the collision bounds
     * @param {Vector3} vector The vector
     * @returns {boolean} True if the vector is within bounds
     */
    #inBounds(vector) {
        return !(vector.x < 0 || vector.y < 0 || vector.z < 0 ||
            vector.x > Collision.SIZE ||
            vector.y > Collision.SIZE ||
            vector.z > Collision.SIZE);
    }

    /**
     * Convert a coordinate to a grid index
     * @param {number} x The X coordinate
     * @param {number} y The Y coordinate
     * @param {number} z The Z coordinate
     * @returns {number} The grid cell index
     */
    #coordinateToIndex(x, y, z) {
        return x + (y + z * Collision.SUBDIVISION) * Collision.SUBDIVISION;
    }

    /**
     * Get the cell index for a given position
     * @param {Vector3} center The position
     * @returns {number} The cell index for this position
     */
    #cellIndex(center) {
        return this.#coordinateToIndex(
            Math.floor(center.x * Collision.INVERSE_CELL_SIZE),
            Math.floor(center.y * Collision.INVERSE_CELL_SIZE),
            Math.floor(center.z * Collision.INVERSE_CELL_SIZE));
    }

    /**
     * Check if a sphere fits in the collision field
     * @param {Vector3} center The sphere center
     * @param {number} radius The sphere radius
     * @param {Vector3} [exclude] An optional sphere center to exclude from this check
     * @returns {boolean} True if the sphere would fit in the collision field
     */
    fits(center, radius, exclude = null) {
        if (!this.#inBounds(center))
            return false;

        const volumeCount = this.#volumes.length;

        if (volumeCount) {
            let contained = false;

            for (let volume = 0; volume < volumeCount; ++volume) if (this.#volumes[volume].contains(center)) {
                contained = true;

                break;
            }

            if (!contained)
                return false;
        }

        const xStart = Math.max(0,
            Math.floor((center.x - Collision.RADIUS_MAX - radius) * Collision.INVERSE_CELL_SIZE));
        const yStart = Math.max(0,
            Math.floor((center.y - Collision.RADIUS_MAX - radius) * Collision.INVERSE_CELL_SIZE));
        const zStart = Math.max(0,
            Math.floor((center.z - Collision.RADIUS_MAX - radius) * Collision.INVERSE_CELL_SIZE));
        const xEnd = Math.min(Collision.SUBDIVISION - 1,
            Math.floor((center.x + Collision.RADIUS_MAX + radius) * Collision.INVERSE_CELL_SIZE));
        const yEnd = Math.min(Collision.SUBDIVISION - 1,
            Math.floor((center.y + Collision.RADIUS_MAX + radius) * Collision.INVERSE_CELL_SIZE));
        const zEnd = Math.min(Collision.SUBDIVISION - 1,
            Math.floor((center.z + Collision.RADIUS_MAX + radius) * Collision.INVERSE_CELL_SIZE));

        for (let z = zStart; z <= zEnd; ++z) for (let y = yStart; y <= yEnd; ++y) for (let x = xStart; x <= xEnd; ++x) {
            const cell = this.#coordinateToIndex(x, y, z);

            for (let sphere = 0, sphereCount = this.#spheres[cell].length; sphere < sphereCount; ++sphere)
                if (center.distanceTo(this.#spheres[cell][sphere]) <
                    radius + this.#radii[cell][sphere] - Collision.#EPSILON &&
                    (!exclude || !this.#spheres[cell][sphere].equals(exclude)))
                    return false;
        }

        return true;
    }

    /**
     * Add a sphere to the collision field
     * @param {Vector3} center The sphere center
     * @param {number} radius The sphere radius
     */
    add(center, radius) {
        const index = this.#cellIndex(center);

        this.#spheres[index].push(center);
        this.#radii[index].push(radius);
    }

    /**
     * Get all collision volumes
     * @returns {Volume[]} The collision volumes
     */
    get volumes() {
        return this.#volumes;
    }
}