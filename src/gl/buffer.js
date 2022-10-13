import {gl} from "./gl.js";

export class Buffer {
    static #INITIAL_CAPACITY = 0x40000;
    static #INTERMEDIATE_ARRAY_BUFFER = new Buffer(gl.ARRAY_BUFFER);
    static #INTERMEDIATE_ELEMENT_ARRAY_BUFFER = new Buffer(gl.ELEMENT_ARRAY_BUFFER);

    #type;
    #usage;

    buffer = gl.createBuffer();
    capacity;

    /**
     * Construct a buffer
     * @param {GLenum} type A buffer type
     * @param {number} [capacity] Initial capacity, ~4MB by default
     * @param {GLenum} [usage] The buffer usage type
     */
    constructor(type, capacity = Buffer.#INITIAL_CAPACITY, usage = gl.DYNAMIC_DRAW) {
        this.#type = type;
        this.#usage = usage;

        this.capacity = capacity;

        gl.bindBuffer(type, this.buffer);
        gl.bufferData(type, this.capacity, usage);
    }

    /**
     * Get an intermediate buffer for copy operations
     * @param {number} capacity The capacity the buffer needs to have
     * @returns {Buffer} The intermediate buffer
     */
    getIntermediate(capacity) {
        let intermediate;

        switch (this.#type) {
            case gl.ELEMENT_ARRAY_BUFFER:
                intermediate = Buffer.#INTERMEDIATE_ELEMENT_ARRAY_BUFFER;

                break;
            default:
                intermediate = Buffer.#INTERMEDIATE_ARRAY_BUFFER;

                break;
        }

        if (capacity > intermediate.capacity)
            intermediate.doubleDestructive(intermediate.doublesUntil(capacity));

        return intermediate;
    }

    /**
     * Calculate the number of doubles required to reach a given capacity
     * @param {number} capacity The capacity that much be reached by doubling
     * @returns {number} The number of doubles
     */
    doublesUntil(capacity) {
        let doubles = 1;

        while (this.capacity << doubles < capacity)
            ++doubles;

        return doubles;
    }

    /**
     * Double buffer capacity, erasing buffer contents
     * @param {number} [doubleCount] The number of buffer doubles
     */
    doubleDestructive(doubleCount = 1) {
        gl.bindBuffer(this.#type, this.buffer);
        gl.bufferData(this.#type, this.capacity <<= doubleCount, this.#usage);
    }

    /**
     * Double buffer capacity
     * @param {number} [doubleCount] The number of buffer doubles
     */
    double(doubleCount = 1) {
        const intermediate = this.getIntermediate(this.capacity << doubleCount);

        gl.bindBuffer(gl.COPY_READ_BUFFER, this.buffer);
        gl.bindBuffer(gl.COPY_WRITE_BUFFER, intermediate.buffer);
        gl.copyBufferSubData(
            gl.COPY_READ_BUFFER,
            gl.COPY_WRITE_BUFFER,
            0,
            0,
            this.capacity);
        gl.bufferData(gl.COPY_READ_BUFFER, this.capacity <<= doubleCount, this.#usage);
        gl.bindBuffer(gl.COPY_READ_BUFFER, intermediate.buffer);
        gl.bindBuffer(gl.COPY_WRITE_BUFFER, this.buffer);
        gl.copyBufferSubData(
            gl.COPY_READ_BUFFER,
            gl.COPY_WRITE_BUFFER,
            0,
            0,
            this.capacity >> doubleCount);
    }

    /**
     * Free resources
     */
    free() {
        gl.deleteBuffer(this.buffer);
    }
}