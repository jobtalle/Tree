import {gl} from "./gl/gl.js";
import {Color} from "./color.js";

export class Tree {
    static #COLOR_BACKGROUND = new Color("#0000FF");

    #width;
    #height;

    constructor(width, height, canvas) {
        this.#width = width;
        this.#height = height;
    }

    update() {

    }

    render(time) {
        gl.viewport(0, 0, this.#width, this.#height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}