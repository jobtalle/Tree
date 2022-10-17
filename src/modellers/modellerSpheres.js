import {Modeller} from "./modeller.js";

export class ModellerSpheres extends Modeller {
    attributes;

    /**
     * Construct a spheres modeller
     * @param {AttributesSpheres} attributes The attributes to write to
     * @param {Node} root The root node
     */
    constructor(attributes, root) {
        super(root);

        this.attributes = attributes;
    }

    /**
     * Model a node and its children
     * @param {Node} node The node to model
     */
    modelNode(node) {
        this.attributes.push(node.position, node.radius);

        for (let child = 0, childCount = node.children.length; child < childCount; ++child)
            this.modelNode(node.children[child]);
    }

    /**
     * Make the model
     */
    model() {
        this.modelNode(this.root);
    }
}