import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesWireframe extends Attributes {
    /**
     * Wireframe attributes
     */
    constructor() {
        super([
                gl.FLOAT,
                gl.FLOAT,
                gl.FLOAT,
                gl.FLOAT
            ]);
    }

    /**
     * Push a vector to the wireframe
     * @param {Vector3} vector The vector
     * @param {number} distance The distance from the root
     */
    push(vector, distance) {
        this.array.push(vector.x, vector.y, vector.z, distance);
    }
}