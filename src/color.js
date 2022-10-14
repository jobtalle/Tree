export class Color {
    /**
     * Construct a color
     * @param {string} hex A hexadecimal color string starting with #
     */
    constructor(hex) {
        this.integer = parseInt(hex.substring(1), 16);
    }

    /**
     * Get the red value in the range [0, 1]
     * @returns {number} The red value
     */
    get r() {
        return (this.integer >> 16) / 0xFF;
    }

    /**
     * Get the green value in the range [0, 1]
     * @returns {number} The red value
     */
    get g() {
        return ((this.integer >> 8) & 0xFF) / 0xFF;
    }

    /**
     * Get the green value in the range [0, 1]
     * @returns {number} The red value
     */
    get b() {
        return (this.integer & 0xFF) / 0xFF;
    }
}