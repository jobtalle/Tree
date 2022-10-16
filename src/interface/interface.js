import {Vector2} from "../math/vector2.js";

export class Interface {
    static #ELEMENT = document.getElementById("interface");
    static #TABLE = Interface.#ELEMENT.appendChild(document.createElement("table"));
    static #RANGE_STEPS = 512;

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

        this.addFieldRange("Growth", new Vector2(0, 1), "growth");
    }

    /**
     * Add a range field
     * @param {string} title The field title
     * @param {Vector2} range The range
     * @param {string} key The key in the configuration to bind this range to
     */
    addFieldRange(title, range, key) {
        const row = document.createElement("tr");

        row.appendChild(
            document.createElement("td")).appendChild(
            document.createElement("label")).appendChild(
            document.createTextNode(title + ":"));

        const input = row.appendChild(
            document.createElement("td")).appendChild(
            document.createElement("input"));

        input.type = "range";
        input.min = range.x.toString();
        input.max = range.y.toString();
        input.step = ((range.y - range.x) / Interface.#RANGE_STEPS).toString();
        input.value = this.#configuration[key].toString();
        input.oninput = () => {
            this.#configuration[key] = Number.parseFloat(input.value);
            this.#onChange();
        };

        Interface.#TABLE.appendChild(row);
    }
}