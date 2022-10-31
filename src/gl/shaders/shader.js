import {gl} from "../gl.js";
import {Vector3} from "../../math/vector3.js";

export class Shader {
    #program;

    /**
     * Make the GLSL code for preprocessor defines
     * @param {String[][]} [defines] An optional array of preprocessor defines
     * @returns {String} Preprocessor defines
     */
    static makeDefines(defines) {
        let glsl = "";

        for (const define of defines)
            glsl += "#define " + define[0] + " " + (define[1] || "") + "\n";

        return glsl;
    }

    /**
     * Make a vec3
     * @param {Vector3 | Color} vector A value to convert to a vec3
     * @returns {string} The vec3
     */
    static makeVec3(vector) {
        if (vector instanceof Vector3)
            return "vec3(" + vector.x + "," + vector.y + "," + vector.z + ")";
        else
            return "vec3(" + vector.r + "," + vector.g + "," + vector.b + ")";
    }

    /**
     * Make a vec4
     * @param {Vector4} vector A value to convert to a vec4
     * @returns {string} The vec4
     */
    static makeVec4(vector) {
        return "vec4(" + vector.x + "," + vector.y + "," + vector.z + "," + vector.w + ")";
    }

    /**
     * Construct a shader
     * @param {String} vertex The vertex shader
     * @param {String} fragment The fragment shader
     * @param {String[][]} [defines] An optional array of preprocessor defines
     */
    constructor(vertex, fragment, defines = null) {
        const shaderVertex = gl.createShader(gl.VERTEX_SHADER);
        const shaderFragment = gl.createShader(gl.FRAGMENT_SHADER);
        let prefix = "#version 300 es\nprecision highp float;\n";

        if (defines)
            prefix += Shader.makeDefines(defines);

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