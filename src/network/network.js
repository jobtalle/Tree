import {Node} from "./node.js";
import {Collision} from "./collision/collision.js";
import {Vector3} from "../math/vector3.js";
import {Random} from "../math/random.js";
import {BoundsType} from "../boundsType.js";
import {VolumeOval} from "./collision/volumeOval.js";
import {VolumeBox} from "./collision/volumeBox.js";
import {ObstacleType} from "../obstacleType.js";

export class Network {
    static #MAX_NODES = 64000;

    #collision;
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
        this.#collision = new Collision();
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

        for (const start of starts) switch (configuration.boundsType) {
            case BoundsType.ELLIPSOID:
                this.#collision.addVolume(new VolumeOval(
                    start.copy().add(new Vector3(0, configuration.boundsEllipsoidBase, 0)),
                    configuration.boundsEllipsoidHeight,
                    configuration.boundsEllipsoidRadius));

                break;
            case BoundsType.BOX:
                this.#collision.addVolume(new VolumeBox(
                    start,
                    configuration.boundsBoxHeight,
                    configuration.boundsBoxRadius));

                break;
        }

        for (const start of starts) switch (configuration.obstacleType) {
            case ObstacleType.ELLIPSOID:
                this.#collision.subtractVolume(new VolumeOval(
                    start.copy().add(new Vector3(0, configuration.obstacleEllipsoidBase, 0)),
                    configuration.obstacleEllipsoidHeight,
                    configuration.obstacleEllipsoidRadius));

                break;
            case ObstacleType.BOX:
                this.#collision.subtractVolume(new VolumeBox(
                    start.copy().add(new Vector3(0, configuration.obstacleBoxBase, 0)),
                    configuration.obstacleBoxHeight,
                    configuration.obstacleBoxRadius));

                break;
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
     * Get the collision volume
     * @returns {Collision} The collision volume
     */
    get collision() {
        return this.#collision;
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
     * Add a point to the min & max bounds
     * @param {Vector3} point The point to add
     */
    #addToBounds(point) {
        this.#min.x = Math.min(this.#min.x, point.x);
        this.#min.y = Math.min(this.#min.y, point.y);
        this.#min.z = Math.min(this.#min.z, point.z);
        this.#max.x = Math.max(this.#max.x, point.x);
        this.#max.y = Math.max(this.#max.y, point.y);
        this.#max.z = Math.max(this.#max.z, point.z);
    }

    /**
     * Shuffle an array
     * @param {Array} array The array to shuffle
     * @param {Random} random A randomizer
     * @returns {Array} The shuffled array
     */
    #shuffle(array, random) {
        let currentIndex = array.length,  randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(random.float * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
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
            const node = new Node(
                start,
                this.#configuration.radiusInitial,
                start.copy(),
                Vector3.UP.copy().multiply(this.#configuration.stabilityInitial));

            this.#roots.push(node);
            this.#addToBounds(start);

            this.#collision.add(start, this.#configuration.radiusInitial);

            tips.push(...node.grow(this.#configuration, this.#collision, this.#random, this.#configuration.extendThreshold));
        }

        this.#nodeCount += tips.length + 1;

        while (tips.length !== 0) {
            const newTips = [];

            if (this.#configuration.shuffleTips)
                this.#shuffle(tips, this.#random);

            for (const tip of tips) {
                const grown = tip.grow(
                    this.#configuration,
                    this.#collision,
                    this.#random,
                    index <= this.#configuration.extendThreshold);

                this.#addToBounds(tip.position);

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