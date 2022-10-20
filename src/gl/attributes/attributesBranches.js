import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesBranches extends Attributes {
    /**
     * Colored geometry attributes
     */
    constructor() {
        super([
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT
        ]);
    }

    /**
     * Push a vertex
     * @param {Vector3} vertex The vertex
     * @param {Vector3} normal The normal
     * @param {number} depth The depth
     */
    push(vertex, normal, depth) {
        this.array.push(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z, depth);
    }
}