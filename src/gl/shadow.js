import {gl} from "./gl.js";
import {Matrix4} from "../math/matrix4.js";
import {Vector3} from "../math/vector3.js";
import {Uniforms} from "./uniforms/uniforms.js";

export class Shadow {
    static #SIZE = 4096;

    #texture = gl.createTexture();
    #fbo = gl.createFramebuffer();

    /**
     * Construct a depth buffer
     * @param {Vector3} sun The sun location
     * @param {Vector3} focus The focus
     */
    constructor(sun, focus) {
        focus.multiply(-1);
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F, Shadow.#SIZE, Shadow.#SIZE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.#fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.#texture, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        const radius = 1.5;
        const view = new Matrix4().lookAt(sun.copy().multiply(-radius).subtract(focus), focus.negate(), Vector3.UP);
        const projection = new Matrix4().orthographic(
            -radius,
            -radius,
            radius,
            radius,
            radius * -2,
            radius * 2);

        Uniforms.GLOBALS.setShadowMatrix(projection.multiply(view));
    }

    /**
     * Target this buffer
     */
    target() {
        gl.viewport(0, 0, Shadow.#SIZE, Shadow.#SIZE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.#fbo);
    }
}