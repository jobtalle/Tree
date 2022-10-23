import {Modeller} from "./modeller.js";
import {Vector3} from "../math/vector3.js";
import {Matrix3} from "../math/matrix3.js";

export class ModellerBranches extends Modeller {
    static #RING_PRECISION = 7;

    #attributes;
    #indices;

    /**
     * Construct a branches modeller
     * @param {AttributesBranches} attributes The attributes to write to
     * @param {AttributesIndices} indices The indices to write to
     * @param {Node} root The root node
     */
    constructor(attributes, indices, root) {
        super(root);

        this.#attributes = attributes;
        this.#indices = indices;
    }

    /**
     * Model a cross-section ring
     * @returns {Vector3[]} The vectors on the ring
     */
    #modelRing() {
        const ring = [];

        for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i)
            ring.push(new Vector3(
                0,
                Math.cos(Math.PI * 2 * i / ModellerBranches.#RING_PRECISION),
                Math.sin(Math.PI * 2 * i / ModellerBranches.#RING_PRECISION)));

        return ring;
    }

    /**
     * Rotate a ring of vectors
     * @param {Vector3[]} ring A ring of vectors
     * @param {Matrix3} matrix The rotation matrix
     * @returns {Vector3[]} The rotated vectors
     */
    #rotateRing(ring, matrix) {
        const rotated = [];

        for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i)
            rotated.push(matrix.apply(ring[i].copy()));

        return rotated;
    }

    /**
     * Model a node and its children
     * @param {Node} node The node to model
     * @param {Vector3[]} ring The ring
     * @param {Matrix3} matrix The rotation matrix of the previous node
     * @param {number} baseIndex The base index of the ring to connect to
     * @param [first] True if this is the first node
     */
    #modelNode(node, ring, matrix, baseIndex, first = false) {
        const direction = node.direction;

        for (const child of node.children)
            direction.add(child.direction);

        direction.divide(node.children.length + 1);

        matrix.direction = direction;

        const rotatedRing = this.#rotateRing(ring, matrix);
        const base = this.#attributes.attributeCount;
        const radius = node.depth * .05;

        if (!node.children.length) {
            this.#attributes.push(node.position, new Vector3(), node.distance);

            if (!first) for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i) {
                const iNext = i === ModellerBranches.#RING_PRECISION - 1 ? 0 : i + 1;

                this.#indices.push(baseIndex + iNext);
                this.#indices.push(baseIndex + i);
                this.#indices.push(base);
            }
        }
        else {
            for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i)
                this.#attributes.push(
                    rotatedRing[i].copy().multiply(radius).add(node.position),
                    rotatedRing[i],
                    node.distance);

            if (!first) for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i) {
                const iNext = i === ModellerBranches.#RING_PRECISION - 1 ? 0 : i + 1;

                this.#indices.push(base + i);
                this.#indices.push(base + iNext);
                this.#indices.push(baseIndex + iNext);
                this.#indices.push(baseIndex + iNext);
                this.#indices.push(baseIndex + i);
                this.#indices.push(base + i);
            }
        }

        for (let child = 0, childCount = node.children.length; child < childCount; ++child)
            this.#modelNode(node.children[child], ring, matrix.copy(), base);
    }

    /**
     * Make the model
     */
    model() {
        const ring = this.#modelRing();
        const matrix = new Matrix3(Vector3.UP);

        this.#modelNode(this.root, ring, matrix, 0, true);
    }
}