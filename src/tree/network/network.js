import {Node} from "./node.js";
import {Collision} from "../collision.js";
import {Vector3} from "../../math/vector3.js";
import {ModellerWireframe} from "../../modellers/modellerWireframe.js";
import {AttributesWireframe} from "../../gl/attributes/attributesWireframe.js";
import {AttributesIndices} from "../../gl/attributes/attributesIndices.js";
import {Renderables} from "../../gl/renderable/renderables.js";

export class Network {
    #collision = new Collision();
    #random;
    #parameters;

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

            const attributes = new AttributesWireframe();
            const indices = new AttributesIndices();

            new ModellerWireframe(attributes, indices, root).model();

            Renderables.WIREFRAME.upload(attributes, indices);
        }
    }
}