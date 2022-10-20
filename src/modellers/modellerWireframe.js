import {Modeller} from "./modeller.js";

export class ModellerWireframe extends Modeller {
    #attributes;
    #indices;

    /**
     * Construct a wireframe modeller
     * @param {AttributesWireframe} attributes The attributes to write to
     * @param {AttributesIndices} indices The indices to write to
     * @param {Node} root The root node
     */
    constructor(attributes, indices, root) {
        super(root);

        this.#attributes = attributes;
        this.#indices = indices;
    }

    /**
     * Model a node and its children
     * @param {Node} node The node to model
     * @param [first] True if this is the first node
     */
    #modelNode(node, first = false) {
        const index = this.#attributes.attributeCount;

        this.#attributes.push(node.position, node.distance);

        if (!first)
            this.#indices.push(index);

        for (let child = 0, childCount = node.children.length; child < childCount; ++child) {
            this.#indices.push(index);

            this.#modelNode(node.children[child]);
        }
    }

    /**
     * Make the model
     */
    model() {
        this.#modelNode(this.root, true);
    }
}