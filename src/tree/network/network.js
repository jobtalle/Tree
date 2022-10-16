import {Node} from "./node.js";
import {Collision} from "../collision.js";
import {Vector3} from "../../math/vector3.js";

export class Network {
    #collision = new Collision();
    #random;
    #parameters;
    #roots = [];

    /**
     * Construct a tree network
     * @param {Random} random The randomizer
     * @param {Parameters} parameters The parameters
     */
    constructor(random, parameters) {
        this.#random = random;
        this.#parameters = parameters;

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
        if (this.#collision.fits(start, this.#parameters.radiusInitial)) {
            const root = new Node(start, this.#parameters.radiusInitial);
            let tips = root.grow(this.#parameters, this.#collision, this.#random);

            while (tips.length !== 0) {
                const newTips = [];
                // TODO: Shuffle tips?

                for (const tip of tips)
                    newTips.push(...tip.grow(this.#parameters, this.#collision, this.#random));

                tips = newTips;
            }

            this.#roots = [root];
        }
    }
}