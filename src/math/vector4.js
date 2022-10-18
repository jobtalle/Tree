export class Vector4 {
    /**
     * Construct a 4D vector
     * @param {number} x The X coordinate
     * @param {number} y The Y coordinate
     * @param {number} z The Z coordinate
     * @param {number} w The W coordinate
     */
    constructor(x = 0, y = x, z = y, w = z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}