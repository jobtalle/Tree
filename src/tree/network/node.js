import {Matrix3} from "../../math/matrix3.js";
import {Vector3} from "../../math/vector3.js";

export class Node {
    #position;
    #radius;
    #parent;
    #children = [];
    #distance;
    #depth = 0;

    /**
     * Construct a new node
     * @param {Vector3} position The node position
     * @param {number} radius The node radius
     * @param {Node} [parent] The node parent, if any
     * @param {number} [distance] The node distance from the root, zero by default
     */
    constructor(position, radius, parent = null, distance = 0) {
        this.#position = Object.freeze(position);
        this.#radius = radius;
        this.#parent = parent;
        this.#distance = distance;
    }

    /**
     * Add depth to this node
     * @param {number} depth The amount of depth to add
     */
    setDepth(depth) {
        this.#parent?.setDepth(depth);
        this.#depth = Math.max(this.#depth, depth);
    }

    /**
     * Grow this node
     * @param {Configuration} configuration The configuration
     * @param {Collision} collision The collision grid
     * @param {Random} random The randomizer
     * @returns {Node[]} The generated child nodes
     */
    grow(configuration, collision, random) {
        const radius = this.#radius * configuration.radiusDecay;

        if (radius < configuration.radiusThreshold)
            return this.#children;

        const matrix = new Matrix3(this.direction);
        const stride = this.#radius + radius;

        for (let i = 0; i < configuration.extendTries; ++i) {
            const extendPitch = Math.sqrt(random.float) * configuration.extendAngle;
            const extendRadial = random.float * Math.PI * 2;
            const position = matrix.apply(new Vector3(
                Math.cos(extendPitch),
                Math.sin(extendRadial) * Math.sin(extendPitch),
                Math.cos(extendRadial) * Math.sin(extendPitch))).multiply(stride).add(this.#position);

            if (collision.fits(position, radius)) {
                collision.add(position, radius);

                this.#children.push(new Node(position, radius, this, this.#distance + stride));

                this.setDepth(this.#distance + stride);
            }
        }

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
     * Get the node distance from the root
     * @returns {number} The node distance from the root
     */
    get distance() {
        return this.#distance;
    }

    /**
     * Get the node distance from the root of this nodes parent
     * @returns {number} The node distance from the root
     */
    get parentDistance() {
        if (this.#parent)
            return this.#parent.distance;

        return 0;
    }

    /**
     * Get the depth to the furthest tip
     * @returns {number} The depth
     */
    get depth() {
        return this.#depth;
    }

    /**
     * Get the node direction
     * @returns {Vector3} The direction this node points towards
     */
    get direction() {
        if (this.#parent)
            return this.#position.copy().subtract(this.#parent.position).normalize();

        return Vector3.UP.copy();
    }

    /**
     * Get the child nodes
     * @returns {Node[]} The child nodes
     */
    get children() {
        return this.#children;
    }
}