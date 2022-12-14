export class Random {
    static #MULTIPLIER = 69069;
    static #MODULUS = 0x100000000;

    /**
     * Make a random seed
     * @returns {number} A valid random seed
     */
    static makeSeed() {
        return Math.floor(Math.random() * Random.#MODULUS);
    }

    /**
     * Construct a randomizer
     * @param {number} seed The seed, which must be a 32-bit unsigned integer
     */
    constructor(seed = Random.makeSeed()) {
        this.n = seed;
    }

    /**
     * Get a randomized integer in the range [0, 0xFFFFFFFF]
     * @returns {number} A random integer
     */
    get integer() {
        return this.n = (Random.#MULTIPLIER * this.n + 1) % Random.#MODULUS;
    }

    /**
     * Get a randomized number in the range [0, 1]
     * @returns {number} A random number
     */
    get float() {
        return this.integer / Random.#MODULUS;
    }
}