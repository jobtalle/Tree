export class Color {
    constructor(hex) {
        this.integer = parseInt(hex.substring(1), 16);
    }

    get r() {
        return (this.integer >> 16) / 0xFF;
    }

    get g() {
        return ((this.integer >> 8) & 0xFF) / 0xFF;
    }

    get b() {
        return (this.integer & 0xFF) / 0xFF;
    }
}