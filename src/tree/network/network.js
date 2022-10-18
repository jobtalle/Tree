import {Node} from "./node.js";
import {Collision} from "../collision.js";
import {Vector3} from "../../math/vector3.js";
import {Random} from "../../math/random.js";

export class Network {
    static #MAX_NODES = 64000;

    #collision = new Collision();
    #random;
    #configuration;
    #roots = [];
    #valid = false;

    /**
     * Construct a tree network
     * @param {Configuration} configuration The configuration
     */
    constructor(configuration) {
        this.#random = new Random(configuration.seed);
        this.#configuration = configuration;

        this.#valid = this.#grow(new Vector3(Collision.SIZE * .5, 0, Collision.SIZE * .5));
    }

    /**
     * Check whether the network was grown successfully
     * @returns {boolean} True if the network is valid
     */
    get valid() {
        return this.#valid;
    }

    /**
     * Get the tree roots
     * @returns {Node[]} All tree roots
     */
    get roots() {
        return this.#roots;
    }

    /**
     * Get the maximum depth of all structures in this network
     * @returns {number} The depth
     */
    get depth() {
        let depth = 0;

        for (const root of this.#roots) if (root.depth > depth)
            depth = root.depth;

        return depth;
    }

    /**
     * Grow a network
     * @param {Vector3} start The network origin
     * @returns {boolean} True if the network was valid
     */
    #grow(start) {
        if (this.#collision.fits(start, this.#configuration.radiusInitial)) {
            const root = new Node(start, this.#configuration.radiusInitial);

            this.#collision.add(start, this.#configuration.radiusInitial);

            let tips = root.grow(this.#configuration, this.#collision, this.#random);
            let nodeCount = tips.length + 1;

            while (tips.length !== 0) {
                const newTips = [];
                // TODO: Shuffle tips?

                for (const tip of tips) {
                    const grown = tip.grow(this.#configuration, this.#collision, this.#random);

                    if ((nodeCount += grown.length) > Network.#MAX_NODES) {
                        console.warn("Too many nodes!");

                        return false;
                    }

                    newTips.push(...grown);
                }

                tips = newTips;
            }

            this.#roots.push(root);
        }

        return true;
    }
}