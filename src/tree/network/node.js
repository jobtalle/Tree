import {Camera} from "../../camera/camera.js";

export class Node {
    #position;
    #radius;
    #parent;
    #children = [];

    /**
     * Construct a new node
     * @param {Vector3} position The node position
     * @param {number} radius The node radius
     * @param {Node} [parent] The node parent, if any
     */
    constructor(position, radius, parent = null) {
        this.#position = Object.freeze(position);
        this.#radius = radius;
        this.#parent = parent;
    }

    /**
     * Grow this node
     * @param {Parameters} parameters The parameters
     * @param {Collision} collision The collision grid
     * @param {Random} random The randomizer
     * @returns {Node[]} The generated child nodes
     */
    grow(parameters, collision, random) {
        const radius = this.#radius * parameters.radiusDecay;

        if (radius < parameters.radiusThreshold)
            return this.#children;


        // Spawn children

        return this.#children;
    }

    /**
     * Get the node position
     * @returns {Vector3} The node position
     */
    get position() {
        return this.#position;
    }

    /**
     * Get the node radius
     * @returns {number} The node radius
     */
    get radius() {
        return this.#radius;
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