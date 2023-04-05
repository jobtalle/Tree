import {Modeller} from "./modeller.js";
import {Vector3} from "../math/vector3.js";

export class ModellerBox extends Modeller {
    #attributes;
    #indices;
    #base;
    #height;
    #radius;

    /**
     * Construct the box modeller
     * @param {AttributesVolumes} attributes The attributes to write to
     * @param {AttributesIndices} indices The indices to write to
     * @param {Vector3} base The box base
     * @param {number} height The box height
     * @param {number} radius The box radius
     */
    constructor(attributes, indices, base, height, radius) {
        super(null);

        this.#attributes = attributes;
        this.#indices = indices;
        this.#base = base;
        this.#height = height;
        this.#radius = radius;
    }

    /**
     * Model a quad
     * @param {Vector3} a The first corner
     * @param {Vector3} b The second corner
     * @param {Vector3} c The third corner
     * @param {Vector3} d The fourth corner
     */
    #modelQuad(a, b, c, d) {
        const t1 = b.copy().subtract(a);
        const t2 = d.copy().subtract(a);
        const normal = new Vector3().cross(t1, t2);
        const indexBase = this.#attributes.attributeCount;

        this.#indices.push(indexBase);
        this.#indices.push(indexBase + 1);
        this.#indices.push(indexBase + 2);
        this.#indices.push(indexBase + 2);
        this.#indices.push(indexBase + 3);
        this.#indices.push(indexBase);

        this.#attributes.push(a, normal);
        this.#attributes.push(b, normal);
        this.#attributes.push(c, normal);
        this.#attributes.push(d, normal);
    }

    /**
     * Make the model
     */
    model() {
        const points = [
            this.#base.copy().add(new Vector3(-this.#radius, 0, -this.#radius)),
            this.#base.copy().add(new Vector3(this.#radius, 0, -this.#radius)),
            this.#base.copy().add(new Vector3(this.#radius, 0, this.#radius)),
            this.#base.copy().add(new Vector3(-this.#radius, 0, this.#radius)),
            this.#base.copy().add(new Vector3(-this.#radius, this.#height, -this.#radius)),
            this.#base.copy().add(new Vector3(this.#radius, this.#height, -this.#radius)),
            this.#base.copy().add(new Vector3(this.#radius, this.#height, this.#radius)),
            this.#base.copy().add(new Vector3(-this.#radius, this.#height, this.#radius))
        ];

        this.#modelQuad(points[3], points[2], points[1], points[0]);

        this.#modelQuad(points[0], points[1], points[5], points[4]);
        this.#modelQuad(points[1], points[2], points[6], points[5]);
        this.#modelQuad(points[2], points[3], points[7], points[6]);
        this.#modelQuad(points[3], points[0], points[4], points[7]);

        this.#modelQuad(points[4], points[5], points[6], points[7]);
    }
}