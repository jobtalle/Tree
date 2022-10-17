import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesShape extends Attributes {
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
            gl.FLOAT
        ]);
    }

    /**
     * Push a vertex
     * @param {Vector3} vertex The vertex
     * @param {Vector3} normal The normal
     */
    push(vertex, normal) {
        this.array.push(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z);
    }
}