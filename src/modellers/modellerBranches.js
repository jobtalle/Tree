import {Modeller} from "./modeller.js";
import {Vector3} from "../math/vector3.js";
import {Matrix3} from "../math/matrix3.js";
import {BezierCubic} from "../math/bezierCubic.js";

export class ModellerBranches extends Modeller {
    static #RADIUS_THRESHOLD = .001;
    static #RADIUS = .0015;
    static #SUBDIVISION_STEPS = .002;
    static #SUBDIVISION_STEPS_MIN = 4 ;
    static #SUBDIVISION_JUMP_MAX = 2;
    static #SUBDIVISION_STEPS_POWER = .47;
    static #SUBDIVISION_LENGTH = .04;
    static #SUBDIVISION_ANGLE = .2;
    static #RADIUS_POWER = .44;
    static #SPLIT_THRESHOLD = .5;

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
     * Rotate a ring of vectors
     * @param {number} steps The number of ring steps
     * @param {Matrix3} matrix The rotation matrix
     * @returns {Vector3[]} The rotated vectors
     */
    #rotateRing(steps, matrix) {
        const rotated = [];

        for (let i = 0; i < steps; ++i)
            rotated.push(matrix.apply(new Vector3(
                0,
                Math.cos(Math.PI * 2 * i / steps),
                Math.sin(Math.PI * 2 * i / steps))));

        return rotated;
    }

    /**
     * Make the spline emerging from a node
     * @param {Node} start The start node
     * @param {Node} end The end node
     * @returns {Spline} A spline connecting both nodes
     */
    #makeSpline(start, end) {
        return new BezierCubic(
            start.position,
            start.direction.multiply(start.radius).add(start.position),
            end.direction.multiply(-end.radius).add(end.position),
            end.position);
    }

    /**
     * Get the branch radius at a node
     * @param {Node} node The node
     * @returns {number} The radius
     */
    #getRadius(node) {
        return Math.pow(
            node.weight,
            ModellerBranches.#RADIUS_POWER) * ModellerBranches.#RADIUS + ModellerBranches.#RADIUS_THRESHOLD;
    }

    /**
     * Get the ring precision for a node
     * @param {Node} node The node
     * @returns {number} The number of ring steps
     */
    #getRingSteps(node) {
        return Math.max(ModellerBranches.#SUBDIVISION_STEPS_MIN, Math.ceil(Math.pow(
            Math.PI * 2 * this.#getRadius(node) / ModellerBranches.#SUBDIVISION_STEPS,
            ModellerBranches.#SUBDIVISION_STEPS_POWER)));
    }

    /**
     * Model a node and its children
     * @param {Node} node The node to model
     * @param {Matrix3} matrix The rotation matrix of the previous node
     * @param {number} indexConnect The base index of the ring to connect to
     * @param {number} ringSteps The number of ring steps
     * @param {number} connectSteps The number of ring steps of the parent node
     * @param [first] True if this is the first node
     */
    #modelNode(
        node,
        matrix,
        indexConnect,
        ringSteps,
        connectSteps,
        first = false) {
        const direction = matrix.direction = node.direction;
        const radius = this.#getRadius(node);
        const indexBase = this.#attributes.attributeCount;

        if (node.isLast) {
            this.#attributes.push(node.position, new Vector3(), node.distance);

            if (!first) for (let i = 0; i < connectSteps; ++i) {
                const iNext = i === connectSteps - 1 ? 0 : i + 1;

                this.#indices.push(indexConnect + iNext);
                this.#indices.push(indexConnect + i);
                this.#indices.push(indexBase);
            }
        }
        else {
            const rotatedRing = this.#rotateRing(ringSteps, matrix);

            for (let i = 0; i < ringSteps; ++i)
                this.#attributes.push(
                    rotatedRing[i].copy().multiply(radius).add(node.position),
                    rotatedRing[i],
                    node.distance);

            if (!first) {
                for (let i = 0; i < connectSteps; ++i) {
                    const iNext = i === ringSteps - 1 ? 0 : i + 1;
                    const iNextConnect = i === connectSteps - 1 ? 0 : i + 1;

                    if (i >= ringSteps) {
                        this.#indices.push(indexBase);
                        this.#indices.push(indexConnect + iNextConnect);
                        this.#indices.push(indexConnect + i);
                    }
                    else {
                        this.#indices.push(indexBase + i);
                        this.#indices.push(indexBase + iNext );
                        this.#indices.push(indexConnect + iNextConnect);
                        this.#indices.push(indexConnect + iNextConnect);
                        this.#indices.push(indexConnect + i);
                        this.#indices.push(indexBase + i);
                    }
                }
            }
        }

        for (let child = 0, childCount = node.children.length; child < childCount; ++child) {
            const matrixChild = matrix.copy();
            const distanceToChild = node.children[child].distance - node.distance;
            const angleToChild = Math.acos(node.children[child].position.copy().subtract(node.position).normalize().dot(direction));
            const steps = Math.max(
                Math.ceil(distanceToChild / ModellerBranches.#SUBDIVISION_LENGTH),
                Math.ceil(angleToChild / ModellerBranches.#SUBDIVISION_ANGLE));

            let indexBaseChild = this.#attributes.attributeCount;
            let indexConnectChild = indexBase;

            if (steps) {
                const childRadius = this.#getRadius(node.children[child]);
                const center = new Vector3();
                const direction = new Vector3();
                const spline = this.#makeSpline(node, node.children[child]);
                const split = childRadius / radius < ModellerBranches.#SPLIT_THRESHOLD;
                const startRadius = split ? childRadius : radius;

                if (split) {
                    const rotatedRing = this.#rotateRing(ringSteps, matrixChild);

                    for (let i = 0; i < ringSteps; ++i)
                        this.#attributes.push(
                            rotatedRing[i].copy().multiply(startRadius).add(node.position),
                            rotatedRing[i],
                            node.distance);

                    indexConnectChild = indexBaseChild;
                    indexBaseChild += ringSteps;
                }

                for (let step = 0; step < steps - 1; ++step) {
                    const position = (step + 1) / steps;

                    spline.sample(center, position);
                    matrixChild.direction = spline.derivative(direction, position);

                    const rotatedRing = this.#rotateRing(ringSteps, matrixChild);
                    const interpolatedRadius = startRadius + position * (childRadius - startRadius);
                    const interpolatedDistance = node.distance + position * distanceToChild;

                    for (let i = 0; i < ringSteps; ++i)
                        this.#attributes.push(
                            rotatedRing[i].copy().multiply(interpolatedRadius).add(center),
                            rotatedRing[i],
                            interpolatedDistance);

                    for (let i = 0; i < ringSteps; ++i) {
                        const iNext = i === ringSteps - 1 ? 0 : i + 1;

                        this.#indices.push(indexBaseChild + i);
                        this.#indices.push(indexBaseChild + iNext);
                        this.#indices.push(indexConnectChild + iNext);
                        this.#indices.push(indexConnectChild + iNext);
                        this.#indices.push(indexConnectChild + i);
                        this.#indices.push(indexBaseChild + i);
                    }

                    indexConnectChild = indexBaseChild;
                    indexBaseChild += ringSteps;
                }
            }

            this.#modelNode(
                node.children[child],
                matrixChild,
                indexConnectChild,
                Math.max(
                    ringSteps - ModellerBranches.#SUBDIVISION_JUMP_MAX,
                    this.#getRingSteps(node.children[child])),
                ringSteps);
        }
    }

    /**
     * Make the model
     */
    model() {
        this.#modelNode(
            this.root,
            new Matrix3(Vector3.UP),
            0,
            this.#getRingSteps(this.root),
            this.#getRingSteps(this.root),
            true);
    }
}