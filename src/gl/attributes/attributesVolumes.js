import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesVolumes extends Attributes {
    /**
     * Oval instance attributes
     */
    constructor() {
        super([
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT,
            gl.FLOAT]);
    }

    /**
     * Push an oval
     * @param {Vector3} vertex The vertex
     * @param {Vector3} normal The normal
     */
    push(vertex, normal) {
        this.array.push(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z);
    }
}