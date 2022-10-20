import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesSphere extends Attributes {
    /**
     * Colored geometry attributes
     */
    constructor() {
        super([
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT
        ]);
    }

    /**
     * Push a vertex
     * @param {Vector3} vertex The vertex
     */
    push(vertex) {
        this.array.push(vertex.x, vertex.y, vertex.z);
    }
}