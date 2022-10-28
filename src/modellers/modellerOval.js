import {Modeller} from "./modeller.js";
import {Vector3} from "../math/vector3.js";

export class ModellerOval extends Modeller {
    static #PRECISION = .1;

    #attributes;
    #indices;
    #center;
    #radiusHorizontal;
    #radiusVertical;

    /**
     * Construct the ovals modeller
     * @param {AttributesVolumes} attributes The attributes to write to
     * @param {AttributesIndices} indices The indices to write to
     * @param {Vector3} center The oval center
     * @param {number} radiusHorizontal The radius on the XZ plane
     * @param {number} radiusVertical The radius on the Y plane
     */
    constructor(attributes, indices, center, radiusHorizontal, radiusVertical) {
        super(null);

        this.#attributes = attributes;
        this.#indices = indices;
        this.#center = center;
        this.#radiusHorizontal = radiusHorizontal;
        this.#radiusVertical = radiusVertical;
    }

    /**
     * Make the model
     */
    model() {
        const normal = new Vector3();
        const divisionsY = Math.ceil(Math.max(3, Math.PI * this.#radiusHorizontal / ModellerOval.#PRECISION));
        const divisionsRadial = Math.ceil(Math.max(4, Math.PI * 2 * this.#radiusHorizontal / ModellerOval.#PRECISION));
        const ring = [];
        let indexBase = this.#attributes.attributeCount;

        this.#attributes.push(new Vector3(this.#center.x, this.#center.y + this.#radiusVertical, this.#center.z), Vector3.UP);

        for (let r = 0; r < divisionsRadial; ++r) {
            const rNext = r === divisionsRadial - 1 ? 0 : r + 1;

            this.#indices.push(indexBase);
            this.#indices.push(indexBase + 1 + r);
            this.#indices.push(indexBase + 1 + rNext);
        }

        ++indexBase;

        for (let i = 0; i < divisionsRadial; ++i)
            ring.push(new Vector3());

        for (let y = 1; y < divisionsY - 1; ++y) {
            const height = y / (divisionsY - 1);
            const angleY = height * Math.PI;

            for (let r = 0; r < divisionsRadial; ++r) {
                const angleRadial = Math.PI * 2 * r / divisionsRadial;

                ring[r].x = Math.cos(angleRadial) * Math.sin(angleY) * this.#radiusHorizontal;
                ring[r].y = Math.cos(angleY) * this.#radiusVertical;
                ring[r].z = Math.sin(angleRadial) * Math.sin(angleY) * this.#radiusHorizontal;

                normal.x = 2 * ring[r].x / (this.#radiusHorizontal * this.#radiusHorizontal);
                normal.y = 2 * ring[r].y / (this.#radiusHorizontal * this.#radiusVertical);
                normal.z = 2 * ring[r].z / (this.#radiusHorizontal * this.#radiusHorizontal);

                ring[r].add(this.#center);

                this.#attributes.push(ring[r], normal);

                const rNext = r === divisionsRadial - 1 ? 0 : r + 1;

                if (y !== divisionsY - 2) {
                    this.#indices.push(indexBase + r + divisionsRadial);
                    this.#indices.push(indexBase + rNext + divisionsRadial);
                    this.#indices.push(indexBase + rNext);
                    this.#indices.push(indexBase + rNext);
                    this.#indices.push(indexBase + r);
                    this.#indices.push(indexBase + r + divisionsRadial);
                }
            }

            indexBase += divisionsRadial;
        }

        for (let r = 0; r < divisionsRadial; ++r) {
            const rNext = r === divisionsRadial - 1 ? 0 : r + 1;

            this.#indices.push(indexBase - divisionsRadial + rNext);
            this.#indices.push(indexBase - divisionsRadial + r);
            this.#indices.push(indexBase);
        }

        this.#attributes.push(new Vector3(this.#center.x, this.#center.y - this.#radiusVertical, this.#center.z), Vector3.UP.copy().negate());
    }
}