import {gl} from "./gl.js";

export class Depth {
    static #SIZE = 2048;

    #texture = gl.createTexture();
    #fbo = gl.createFramebuffer();

    /**
     * Construct a depth buffer
     */
    constructor() {
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F, Depth.#SIZE, Depth.#SIZE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.#fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.#texture, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * Target this buffer
     */
    target() {
        gl.viewport(0, 0, Depth.#SIZE, Depth.#SIZE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.#fbo);
    }
}