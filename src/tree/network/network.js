import {Node} from "./node.js";
import {Collision} from "../collision.js";
import {Vector3} from "../../math/vector3.js";

export class Network {
    #collision = new Collision();
    #random;
    #configuration;
    #roots = [];

    /**
     * Construct a tree network
     * @param {Random} random The randomizer
     * @param {Configuration} configuration The configuration
     */
    constructor(random, configuration) {
        this.#random = random;
        this.#configuration = configuration;

        this.grow(new Vector3());
    }

    /**
     * Get the tree roots
     * @returns {Node[]} All tree roots
     */
    get roots() {
        return this.#roots;
    }

    /**
     * Grow a network
     * @param {Vector3} start The network origin
     */
    grow(start) {
        if (this.#collision.fits(start, this.#configuration.radiusInitial)) {
            const root = new Node(start, this.#configuration.radiusInitial);
            let tips = root.grow(this.#configuration, this.#collision, this.#random);

            while (tips.length !== 0) {
                const newTips = [];
                // TODO: Shuffle tips?

                for (const tip of tips)
                    newTips.push(...tip.grow(this.#configuration, this.#collision, this.#random));

                tips = newTips;
            }

            this.#roots = [root];
        }
    }
}