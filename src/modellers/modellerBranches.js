import {Modeller} from "./modeller.js";
import {Vector3} from "../math/vector3.js";
import {Matrix3} from "../math/matrix3.js";
import {BezierCubic} from "../math/bezierCubic.js";

export class ModellerBranches extends Modeller {
    static #RING_PRECISION = 7;
    static #RADIUS_THRESHOLD = .001;
    static #RADIUS = .0015;
    static #BEZIER_RADIUS = .4;
    static #PRECISION = .04;

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
     * Make the spline emerging from a node
     * @param {Node} start The start node
     * @param {Node} end The end node
     * @returns {Spline} A spline connecting both nodes
     */
    #makeSpline(start, end) {
        const anchorRadius = ModellerBranches.#BEZIER_RADIUS * start.position.distanceTo(end.position);

        return new BezierCubic(
            start.position,
            start.direction.multiply(anchorRadius).add(start.position),
            end.direction.multiply(-anchorRadius).add(end.position),
            end.position);
    }

    /**
     * Get the branch radius at a node
     * @param {Node} node The node
     * @returns {number} The radius
     */
    #getRadius(node) {
        return Math.sqrt(node.weight) * ModellerBranches.#RADIUS + ModellerBranches.#RADIUS_THRESHOLD;
    }

    /**
     * Model a node and its children
     * @param {Node} node The node to model
     * @param {Vector3[]} ring The ring
     * @param {Matrix3} matrix The rotation matrix of the previous node
     * @param {number} indexConnect The base index of the ring to connect to
     * @param [first] True if this is the first node
     */
    #modelNode(node, ring, matrix, indexConnect, first = false) {
        const direction = node.direction;

        for (const child of node.children)
            direction.add(child.direction);

        direction.divide(node.children.length + 1);

        matrix.direction = direction;

        const radius = this.#getRadius(node);
        const indexBase = this.#attributes.attributeCount;

        if (!node.children.length) {
            this.#attributes.push(node.position, new Vector3(), node.distance);

            if (!first) for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i) {
                const iNext = i === ModellerBranches.#RING_PRECISION - 1 ? 0 : i + 1;

                this.#indices.push(indexConnect + iNext);
                this.#indices.push(indexConnect + i);
                this.#indices.push(indexBase);
            }
        }
        else {
            const rotatedRing = this.#rotateRing(ring, matrix);

            for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i)
                this.#attributes.push(
                    rotatedRing[i].copy().multiply(radius).add(node.position),
                    rotatedRing[i],
                    node.distance);

            if (!first) for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i) {
                const iNext = i === ModellerBranches.#RING_PRECISION - 1 ? 0 : i + 1;

                this.#indices.push(indexBase + i);
                this.#indices.push(indexBase + iNext);
                this.#indices.push(indexConnect + iNext);
                this.#indices.push(indexConnect + iNext);
                this.#indices.push(indexConnect + i);
                this.#indices.push(indexBase + i);
            }
        }

        for (let child = 0, childCount = node.children.length; child < childCount; ++child) {
            const distanceToChild = node.children[child].distance - node.distance;
            const matrixChild = matrix.copy();
            const steps = Math.ceil(distanceToChild / ModellerBranches.#PRECISION);

            let indexConnectChild = indexBase;
            let indexBaseChild = this.#attributes.attributeCount;

            if (steps) {
                const childRadius = this.#getRadius(node.children[child]);
                const center = new Vector3();
                const direction = new Vector3();
                const spline = this.#makeSpline(node, node.children[child]);

                for (let step = 0; step < steps - 1; ++step) {
                    const position = (step + 1) / steps;

                    spline.sample(center, position);
                    matrixChild.direction = spline.derivative(direction, position);

                    const rotatedRing = this.#rotateRing(ring, matrixChild);
                    const interpolatedRadius = radius + position * (childRadius - radius);
                    const interpolatedDistance = node.distance + position * distanceToChild;

                    for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i)
                        this.#attributes.push(
                            rotatedRing[i].copy().multiply(interpolatedRadius).add(center),
                            rotatedRing[i],
                            interpolatedDistance);

                    for (let i = 0; i < ModellerBranches.#RING_PRECISION; ++i) {
                        const iNext = i === ModellerBranches.#RING_PRECISION - 1 ? 0 : i + 1;

                        this.#indices.push(indexBaseChild + i);
                        this.#indices.push(indexBaseChild + iNext);
                        this.#indices.push(indexConnectChild + iNext);
                        this.#indices.push(indexConnectChild + iNext);
                        this.#indices.push(indexConnectChild + i);
                        this.#indices.push(indexBaseChild + i);
                    }

                    indexConnectChild = indexBaseChild;
                    indexBaseChild += ModellerBranches.#RING_PRECISION;
                }
            }

            this.#modelNode(node.children[child], ring, matrixChild, indexConnectChild);
        }
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