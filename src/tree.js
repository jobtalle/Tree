import {gl} from "./gl/gl.js";
import {Color} from "./color.js";
import {UniformBlockGlobals} from "./gl/uniforms/uniformBlockGlobals.js";
import {Shaders} from "./gl/shaders/shaders.js";

export class Tree {
    static #COLOR_BACKGROUND = new Color("#336997");

    #width;
    #height;
    #uniformBlockGlobals;

    constructor(width, height, canvas) {
        this.#width = width;
        this.#height = height;
        this.#uniformBlockGlobals = new UniformBlockGlobals();

        gl.clearColor(Tree.#COLOR_BACKGROUND.r, Tree.#COLOR_BACKGROUND.g, Tree.#COLOR_BACKGROUND.b, 1);
    }

    update() {

    }

    render(time) {
        gl.viewport(0, 0, this.#width, this.#height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        Shaders.WIREFRAME.use();
    }
}