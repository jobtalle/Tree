import {gl} from "../gl.js";

export class Shader {
    #program;

    /**
     * Construct a shader
     * @param {String} vertex The vertex shader
     * @param {String} fragment The fragment shader
     */
    constructor(vertex, fragment) {
        const shaderVertex = gl.createShader(gl.VERTEX_SHADER);
        const shaderFragment = gl.createShader(gl.FRAGMENT_SHADER);
        let prefix = "#version 300 es\nprecision highp float;";

        this.#program = gl.createProgram();

        gl.shaderSource(shaderVertex, prefix + vertex);
        gl.compileShader(shaderVertex);

        if (!gl.getShaderParameter(shaderVertex, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(shaderVertex));

        gl.shaderSource(shaderFragment, prefix + fragment);
        gl.compileShader(shaderFragment);

        if (!gl.getShaderParameter(shaderFragment, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(shaderFragment));

        gl.attachShader(this.#program, shaderVertex);
        gl.attachShader(this.#program, shaderFragment);
        gl.linkProgram(this.#program);
        gl.detachShader(this.#program, shaderVertex);
        gl.detachShader(this.#program, shaderFragment);
        gl.deleteShader(shaderVertex);
        gl.deleteShader(shaderFragment);

        if (!gl.getProgramParameter(this.#program, gl.LINK_STATUS))
            console.error(gl.getProgramInfoLog(this.#program));
    }

    /**
     * Get a uniform location
     * @param {string} name The name of the uniform
     * @returns {WebGLUniformLocation} The uniform location
     */
    uniformLocation(name) {
        return gl.getUniformLocation(this.#program, name);
    }

    /**
     * Bind a uniform block
     * @param {string} name The uniform block name
     * @param {number} binding The binding index
     */
    bindUniformBlock(name, binding) {
        gl.uniformBlockBinding(this.#program, gl.getUniformBlockIndex(this.#program, name), binding);
    }

    /**
     * Use this shader
     */
    use() {
        gl.useProgram(this.#program);
    }

    /**
     * Free allocated resources
     */
    free() {
        gl.deleteProgram(this.#program);
    }
}