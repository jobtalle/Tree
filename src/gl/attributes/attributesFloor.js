import {gl} from "../gl.js";
import {Attributes} from "./attributes.js";

export class AttributesFloor extends Attributes {
    /**
     * Floor attributes
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