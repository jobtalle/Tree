import {Node} from "./node.js";
import {Collision} from "./collision.js";
import {Vector3} from "../math/vector3.js";
import {Random} from "../math/random.js";

export class Network {
    static #MAX_NODES = 64000;

    #collision = new Collision();
    #random;
    #configuration;
    #roots = [];
    #valid = false;
    #min = new Vector3(Collision.SIZE * .5, 0, Collision.SIZE * .5);
    #max = this.#min.copy();
    #nodeCount = 0;

    /**
     * Construct a tree network
     * @param {Configuration} configuration The configuration
     */
    constructor(configuration) {
        this.#random = new Random(configuration.seed);
        this.#configuration = configuration;

        const starts = [];

        if (configuration.roots === 1)
            starts.push(new Vector3(Collision.SIZE * .5, 0, Collision.SIZE * .5));
        else {
            const radius = Collision.SIZE * .25;

            for (let i = 0; i < configuration.roots; ++i) {
                const angle = Math.PI * 2 * i / configuration.roots;

                starts.push(new Vector3(
                    Collision.SIZE * .5 + Math.cos(angle) * radius,
                    0,
                    Collision.SIZE * .5 + Math.sin(angle) * radius));
            }
        }

        this.#valid = this.#grow(starts);
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
     * Get the center of the network
     * @returns {Vector3} The center of the network
     */
    get center() {
        return this.#min.copy().add(this.#max).multiply(.5);
    }

    /**
     * Get the number of nodes in the network
     * @returns {number} The number of nodes
     */
    get nodeCount() {
        return this.#nodeCount;
    }

    /**
     * Grow a network
     * @param {Vector3[]} starts The network origins
     * @returns {boolean} True if the network was valid
     */
    #grow(starts) {
        let tips = [];
        let index = 0;

        for (const start of starts) {
            const node = new Node(start, this.#configuration.radiusInitial);

            this.#roots.push(node);

            // TODO: Create function for this
            this.#min.x = Math.min(this.#min.x, start.x);
            this.#min.y = Math.min(this.#min.y, start.y);
            this.#min.z = Math.min(this.#min.z, start.z);
            this.#max.x = Math.max(this.#max.x, start.x);
            this.#max.y = Math.max(this.#max.y, start.y);
            this.#max.z = Math.max(this.#max.z, start.z);

            this.#collision.add(start, this.#configuration.radiusInitial);

            tips.push(...node.grow(this.#configuration, this.#collision, this.#random, this.#configuration.extendThreshold));
        }

        this.#nodeCount += tips.length + 1;

        while (tips.length !== 0) {
            const newTips = [];
            // TODO: Shuffle tips?

            for (const tip of tips) {
                const grown = tip.grow(
                    this.#configuration,
                    this.#collision,
                    this.#random,
                    index <= this.#configuration.extendThreshold);

                this.#min.x = Math.min(this.#min.x, tip.position.x);
                this.#min.y = Math.min(this.#min.y, tip.position.y);
                this.#min.z = Math.min(this.#min.z, tip.position.z);
                this.#max.x = Math.max(this.#max.x, tip.position.x);
                this.#max.y = Math.max(this.#max.y, tip.position.y);
                this.#max.z = Math.max(this.#max.z, tip.position.z);

                if ((this.#nodeCount += grown.length) > Network.#MAX_NODES) {
                    console.warn("Too many nodes!");

                    return false;
                }

                newTips.push(...grown);
            }

            tips = newTips;
            ++index;
        }

        return true;
    }
}