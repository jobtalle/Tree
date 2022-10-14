import {Camera} from "../../camera/camera.js";

export class Node {
    #position;
    #parent;
    #children = [];

    /**
     * Construct a new node
     * @param {Vector3} position The node position
     * @param {Node} [parent] The node parent, if any
     */
    constructor(position, parent = null) {
        this.#position = Object.freeze(position);
        this.#parent = parent;
    }

    /**
     * Grow this node
     * @param {Parameters} parameters The parameters
     * @param {Collision} collision The collision grid
     * @param {Random} random The randomizer
     */
    grow(parameters, collision, random) {
        // Add children
    }

    /**
     * Get the node position
     * @returns {Vector3} The node position
     */
    get position() {
        return this.#position;
    }

    /**
     * Get the node direction
     * @returns {Vector3} The direction this node points towards
     */
    get direction() {
        if (this.#parent)
            return this.#position.copy().subtract(this.#parent.position).normalize();

        return Camera.UP;
    }
}