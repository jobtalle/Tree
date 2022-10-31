import {UniformBlock} from "./uniformBlock.js";

export class UniformBlockGlobals extends UniformBlock {
    static BINDING = 0;
    static NAME = "Globals";

    #floats;

    /**
     * Construct the global variables
     */
    constructor() {
        super(256, UniformBlockGlobals.BINDING);

        this.#floats = new Float32Array(this.bytes);
    }

    /**
     * Set the sun direction
     * @param {Vector3} sun The normalized sun direction
     */
    setSun(sun) {
        this.#floats[32] = sun.x;
        this.#floats[33] = sun.y;
        this.#floats[34] = sun.z;
    }

    /**
     * Set the eye
     * @param {Vector3} eye The eye vector
     */
    setEye(eye) {
        this.#floats[36] = eye.x;
        this.#floats[37] = eye.y;
        this.#floats[38] = eye.z;
    }

    /**
     * Set the camera direction
     * @param {Vector3} direction The camera direction
     */
    setDirection(direction) {
        this.#floats[40] = direction.x;
        this.#floats[41] = direction.y;
        this.#floats[42] = direction.z;
    }

    /**
     * Set the growth threshold to cap the structure at
     * @param {number} growth The growth threshold
     */
    setGrowth(growth) {
        this.#floats[35] = growth;
    }

    /**
     * Set the shadow matrix
     * @param {Matrix4} shadowMatrix The shadow matrix
     */
    setShadowMatrix(shadowMatrix) {
        this.#floats.set(shadowMatrix.buffer, 16);
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
    layout(std140) uniform ` + UniformBlockGlobals.NAME + ` {
        mat4 vp;
        mat4 shadowMatrix;
        vec3 sun;
        float growth;
        vec3 eye;
        vec3 direction;
    };`;