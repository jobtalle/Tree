export class Interface {
    static #ELEMENT = document.getElementById("interface");

    #configuration;
    #onChange;

    /**
     * Construct the configuration interface
     * @param {Configuration} configuration A configuration to edit
     * @param {function} onChange A function to call when properties have changed
     */
    constructor(configuration, onChange) {
        this.#configuration = configuration;
        this.#onChange = onChange;
    }
}