export class CameraController {
    camera;

    /**
     * Construct a camera controller
     * @param {Camera} camera The camera to control
     */
    constructor(camera) {
        this.camera = camera;
    }

    /**
     * Update
     */
    update() {

    }

    /**
     * Update before rendering
     * @returns {boolean} True if the camera updated
     */
    render() {
        return false;
    }

    /**
     * Press the mouse
     * @param {number} x The X coordinate in the range [0, 1]
     * @param {number} y The Y coordinate in the range [0, 1]
     */
    mouseDown(x, y) {

    }

    /**
     * Move the mouse
     * @param {number} x The X coordinate in the range [0, 1]
     * @param {number} y The Y coordinate in the range [0, 1]
     */
    mouseMove(x, y) {

    }

    /**
     * Release the mouse
     */
    mouseUp() {

    }

    /**
     * Scroll up
     */
    scrollUp() {

    }

    /**
     * Scroll down
     */
    scrollDown() {

    }
}