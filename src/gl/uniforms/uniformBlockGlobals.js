import {UniformBlock} from "./uniformBlock.js";

export class UniformBlockGlobals extends UniformBlock {
    static BINDING = 0;
    static NAME = "Globals";

    #floats;

    /**
     * Construct the global variables
     */
    constructor() {
        super(88, UniformBlockGlobals.BINDING);

        this.#floats = new Float32Array(this.bytes);
    }

    /**
     * Set the VP matrix
     * @param {Matrix4} vp The VP matrix
     */
    setVP(vp) {
        this.#floats.set(vp.buffer);
    }
}

export const glslGlobals = `
    uniform ` + UniformBlockGlobals.NAME + ` {
        mat4 vp;
    };`;