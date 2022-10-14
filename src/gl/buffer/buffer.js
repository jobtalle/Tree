import {gl} from "../gl.js";

export class Buffer {
    static #INITIAL_CAPACITY = 0x40000;

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
    constructor(type, capacity = Buffer.#INITIAL_CAPACITY, usage = gl.STATIC_DRAW) {
        this.#type = type;
        this.#usage = usage;

        this.capacity = capacity;

        gl.bindBuffer(type, this.buffer);
        gl.bufferData(type, this.capacity, usage);
    }

    /**
     * Upload attributes
     * @param {Attributes} attributes The attributes to upload
     */
    upload(attributes) {
        const bytes = attributes.format();

        if (this.capacity < bytes.byteLength)
            this.double(this.doublesUntil(bytes.byteLength));
        else
            gl.bindBuffer(this.#type, this.buffer);

        gl.bufferSubData(this.#type, 0, bytes);
    }

    /**
     * Double buffer capacity, erasing buffer contents
     * @param {number} [doubleCount] The number of buffer doubles
     */
    double(doubleCount = 1) {
        gl.bindBuffer(this.#type, this.buffer);
        gl.bufferData(this.#type, this.capacity <<= doubleCount, this.#usage);
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
     * Free resources
     */
    free() {
        gl.deleteBuffer(this.buffer);
    }
}