import {UniformBlock} from "./uniformBlock.js";

export class UniformBlockGlobals extends UniformBlock {
    static BINDING = 0;
    static NAME = "Globals";

    #floats;

    /**
     * Construct the global variables
     */
    constructor() {
        super(108, UniformBlockGlobals.BINDING);

        this.#floats = new Float32Array(this.bytes);
    }

    /**
     * Set the sun direction
     * @param {Vector3} sun The normalized sun direction
     */
    setSun(sun) {
        this.#floats[16] = sun.x;
        this.#floats[17] = sun.y;
        this.#floats[18] = sun.z;
    }

    /**
     * Set the eye
     * @param {Vector3} eye The eye vector
     */
    setEye(eye) {
        this.#floats[20] = eye.x;
        this.#floats[21] = eye.y;
        this.#floats[22] = eye.z;
    }

    /**
     * Set the camera direction
     * @param {Vector3} direction The camera direction
     */
    setDirection(direction) {
        this.#floats[24] = direction.x;
        this.#floats[25] = direction.y;
        this.#floats[26] = direction.z;
    }

    /**
     * Set the growth threshold to cap the structure at
     * @param {number} growth The growth threshold
     */
    setGrowth(growth) {
        this.#floats[19] = growth;
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
        vec3 sun;
        float growth;
        vec3 eye;
        vec3 direction;
    };`;