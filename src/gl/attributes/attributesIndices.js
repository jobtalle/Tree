import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesIndices extends Attributes {
    constructor() {
        super(
            [
                gl.UNSIGNED_INT
            ]);
    }

    push(index) {
        this.array.push(index);
    }
}