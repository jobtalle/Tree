import {gl} from "../gl.js";

export class Attributes {
    array = [];
    stride;
    #formats;

    /**
     * Get the stride of a data type
     * @param {GLenum} type The data type
     * @returns {number} The stride in bytes
     */
    static #typeStride(type) {
        switch (type) {
            default:
            case gl.FLOAT:
            case gl.UNSIGNED_INT:
                return 4;
            case gl.UNSIGNED_SHORT:
                return 2;
            case gl.UNSIGNED_BYTE:
                return 1;
        }
    }

    /**
     * Construct an attributes viewer
     * @param {GLenum[]} formats The formats of the elements
     */
    constructor(formats) {
        this.stride = formats.length;
        this.#formats = formats;
    }

    /**
     * Get the byte stride of all formats in this attribute array
     * @returns {number} The stride in bytes
     */
    get byteStride() {
        let stride = 0;

        for (let format = 0, formatCount = this.#formats.length; format < formatCount; ++format)
            stride += Attributes.#typeStride(this.#formats[format]);

        return stride;
    }

    /**
     * Get the number of attribute sets
     * @returns {number} The number of attribute sets
     */
    get attributeCount() {
        return this.array.length / this.stride;
    }

    /**
     * Get the number of attribute  values
     * @returns {number} The number of attribute values
     */
    get elementCount() {
        return this.array.length;
    }

    /**
     * Clear the attributes
     */
    clear() {
        this.array.length = 0;
    }

    /**
     * Format the attributes in this view
     * @returns {ArrayBuffer} A buffer containing the formatted attributes
     */
    format() {
        const buffer = new ArrayBuffer(this.byteStride * this.array.length / this.stride);
        const view = new DataView(buffer);
        let byte = 0;

        for (let index = 0, indices = this.array.length; index < indices; index += this.stride) {
            for (let element = 0; element < this.stride; ++element) {
                switch (this.#formats[element]) {
                    case gl.FLOAT:
                        view.setFloat32(byte, this.array[index + element], true);

                        break;
                    case gl.UNSIGNED_INT:
                        view.setUint32(byte, this.array[index + element], true);

                        break;
                    case gl.UNSIGNED_SHORT:
                        view.setUint16(byte, this.array[index + element], true);

                        break;
                    case gl.UNSIGNED_BYTE:
                        view.setUint8(byte, this.array[index + element]);

                        break;
                }

                byte += Attributes.#typeStride(this.#formats[element]);
            }
        }

        return buffer;
    }
}