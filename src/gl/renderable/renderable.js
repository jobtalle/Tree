import {Buffer} from "../buffer/buffer.js";
import {gl} from "../gl.js";

export class Renderable {
    #type;
    #vertices = new Buffer(gl.ARRAY_BUFFER);
    #indices = new Buffer(gl.ELEMENT_ARRAY_BUFFER);
    #instances = null;
    #instanceCount = 0;
    #vao = gl.createVertexArray();
    #indexCount = 0;

    /**
     * A renderable
     * @param {Function} configureVAO A function that configures the VAO
     * @param {GLenum} type The geometry type
     * @param {Buffer} [instances] Optional instance data
     * @param {Function} [configureInstances] Optional instance buffer configuration
     */
    constructor(configureVAO, type, instances = null, configureInstances = null) {
        this.#type = type;
        this.#instances = instances;

        gl.bindVertexArray(this.#vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertices.buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indices.buffer);

        configureVAO();

        if (instances) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#instances);

            configureInstances();
        }

        gl.bindVertexArray(null);
    }

    /**
     * Upload renderable geometry
     * @param {Attributes} attributes The attributes
     * @param {Attributes} indices The indices
     */
    upload(attributes, indices) {
        this.#indexCount = indices.elementCount;

        this.#vertices.upload(attributes);
        this.#indices.upload(indices);
    }

    /**
     * Upload instance data
     * @param {Attributes} attributes Instance attributes
     */
    uploadInstances(attributes) {
        if (this.#instances) {
            this.#instances.upload(attributes);
            this.#instanceCount = attributes.elementCount;
        }
    }

    /**
     * Draw
     */
    draw() {
        if (this.#indexCount === 0)
            return;

        gl.bindVertexArray(this.#vao);
        gl.drawElements(this.#type, this.#indexCount, gl.UNSIGNED_INT, 0);
        gl.bindVertexArray(null);
    }

    /**
     * Free resources
     */
    free() {
        this.#vertices.free();
        this.#indices.free();

        gl.deleteVertexArray(this.#vao);
    }
}