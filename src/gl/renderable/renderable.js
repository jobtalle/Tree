import {Buffer} from "../buffer/buffer.js";
import {gl} from "../gl.js";

export class Renderable {
    #vertices = new Buffer(gl.ARRAY_BUFFER);
    #indices = new Buffer(gl.ELEMENT_ARRAY_BUFFER);
    #vao = gl.createVertexArray();
    #indexCount = 0;

    /**
     * A renderable
     * @param {Function} configureVAO A function that configures the VAO
     */
    constructor(configureVAO) {
        gl.bindVertexArray(this.#vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertices.buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indices.buffer);

        configureVAO();

        gl.bindVertexArray(null);
    }

    /**
     * Upload renderable geometry
     * @param {Attributes} attributes The attributes
     * @param {Attributes} indices The indices
     */
    upload(attributes, indices) {

    }

    draw() {
        if (this.#indexCount === 0)
            return;


    }

    free() {
        gl.deleteVertexArray(this.#vao);
    }
}