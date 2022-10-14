import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesIndices extends Attributes {
    /**
     * Construct index attributes
     */
    constructor() {
        super(
            [
                gl.UNSIGNED_INT
            ]);
    }

    /**
     * Push a 32-bit index
     * @param {number} index The index
     */
    push(index) {
        this.array.push(index);
    }
}