import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesWireframe extends Attributes {
    constructor() {
        super(
            [
                gl.FLOAT,
                gl.FLOAT,
                gl.FLOAT
            ]);
    }

    push(vector) {
        this.array.push(vector.x, vector.y, vector.z);
    }
}