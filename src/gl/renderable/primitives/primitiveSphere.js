import {Primitive} from "./primitive.js";
import {Vector3} from "../../../math/vector3.js";

export class PrimitiveSphere extends Primitive {
    #points = [];
    #indices = [];

    /**
     * Construct a sphere primitive
     * @param {number} [subdivisions] The number of subdivisions
     */
    constructor(subdivisions = 2) {
        super();

        let w = (1 + Math.sqrt(5)) * 0.5;
        const h = 1.0 / Math.sqrt(1 + w * w);

        w *= h;

        this.#points.push(new Vector3(-h, w, 0));
        this.#points.push(new Vector3(h, w, 0));
        this.#points.push(new Vector3(-h, -w, 0));
        this.#points.push(new Vector3(h, -w, 0));
        this.#points.push(new Vector3(0, -h, w));
        this.#points.push(new Vector3(0, h, w));
        this.#points.push(new Vector3(0, -h, -w));
        this.#points.push(new Vector3(0, h, -w));
        this.#points.push(new Vector3(w, 0, -h));
        this.#points.push(new Vector3(w, 0, h));
        this.#points.push(new Vector3(-w, 0, -h));
        this.#points.push(new Vector3(-w, 0, h));

        this.#indices.push(0, 5, 11);
        this.#indices.push(0, 1, 5);
        this.#indices.push(0, 7, 1);
        this.#indices.push(0, 10, 7);
        this.#indices.push(0, 11, 10);
        this.#indices.push(1, 9, 5);
        this.#indices.push(5, 4, 11);
        this.#indices.push(11, 2, 10);
        this.#indices.push(10, 6, 7);
        this.#indices.push(7, 8, 1);
        this.#indices.push(3, 4, 9);
        this.#indices.push(3, 2, 4);
        this.#indices.push(3, 6, 2);
        this.#indices.push(3, 8, 6);
        this.#indices.push(3, 9, 8);
        this.#indices.push(4, 5, 9);
        this.#indices.push(2, 11, 4);
        this.#indices.push(6, 10, 2);
        this.#indices.push(8, 7, 6);
        this.#indices.push(9, 1, 8);

        for (let subdivision = 0; subdivision < subdivisions; ++subdivision)
            this.#subdivide();
    }

    /**
     * Subdivide sphere mesh
     */
    #subdivide() {
        const indexCount = this.#indices.length / 3;
        const sourceIndices = this.#indices.slice();

        this.#indices.length = 0;

        for (let index = 0; index < indexCount; index++) {
            const offset = index * 3;

            const ia = sourceIndices[offset];
            const ib = sourceIndices[offset + 1];
            const ic = sourceIndices[offset + 2];
            const iab = this.#points.length;
            const ibc = this.#points.length + 1;
            const ica = this.#points.length + 2;

            this.#points.push(this.#points[ia].copy().add(this.#points[ib].copy()).normalize());
            this.#points.push(this.#points[ib].copy().add(this.#points[ic].copy()).normalize());
            this.#points.push(this.#points[ic].copy().add(this.#points[ia].copy()).normalize());

            this.#indices.push(ia, iab, ica);
            this.#indices.push(ib, ibc, iab);
            this.#indices.push(ic, ica, ibc);
            this.#indices.push(iab, ibc, ica);
        }
    }

    /**
     * Model this primitive
     * @param {AttributesShape} attributes The attributes to write to
     * @param {AttributesIndices} indices The indices to write to
     */
    model(attributes, indices) {
        for (let point = 0, pointCount = this.#points.length; point < pointCount; ++point)
            attributes.push(this.#points[point]);

        for (let index = 0, indexCount = this.#indices.length; index < indexCount; ++index)
            indices.push(this.#indices[index]);
    }
}