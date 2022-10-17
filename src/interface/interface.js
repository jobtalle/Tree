import {Vector2} from "../math/vector2.js";

export class Interface {
    static #ELEMENT = document.getElementById("interface");
    static #TABLE = Interface.#ELEMENT.appendChild(document.createElement("table"));
    static #RANGE_STEPS = 512;
    static #RANGE_DECIMALS = 3;

    #configuration;
    #onUpdate;
    #onRemodel;

    /**
     * Construct the configuration interface
     * @param {Configuration} configuration A configuration to edit
     * @param {function} onUpdate A function to call when properties were updated
     * @param {function} onRemodel A function to call when the tree needs to be remodelled
     */
    constructor(configuration, onUpdate, onRemodel) {
        this.#configuration = configuration;
        this.#onUpdate = onUpdate;
        this.#onRemodel = onRemodel;

        this.#addFieldRandomizer("Seed", new Vector2(0, 0xFFFFFFFF), "seed", true);
        this.#addFieldSlider("Growth", new Vector2(0, 1), "growth", false);
    }

    /**
     * Add a field
     * @param {string} title The field title
     * @param {Vector2} range The range
     * @param {string} key The key in the configuration to bind this range to
     * @param {number} [decimals] The number of decimals to display
     * @returns {{HTMLTrElement}, {HTMLInputElement}} The row and input elements
     */
    #addField(title, range, key, decimals = Interface.#RANGE_DECIMALS) {
        const row = Interface.#TABLE.appendChild(document.createElement("tr"));

        row.appendChild(document.createElement("td")).appendChild(
            document.createElement("label")).appendChild(
            document.createTextNode(title + ":"));

        return [row, Object.assign(
            row.appendChild(document.createElement("td")).appendChild(
                document.createElement("input")),
            {
                value: this.#configuration[key].toFixed(decimals),
                readOnly: true
            })];
    }

    /**
     * Add a field with a slider
     * @param {string} title The field title
     * @param {Vector2} range The range
     * @param {string} key The key in the configuration to bind this range to
     * @param {boolean} [remodel] True if this change requires remodelling
     */
    #addFieldSlider(title, range, key, remodel = true) {
        const [row, field] = this.#addField(title, range, key);

        Object.assign(
            row.appendChild(document.createElement("td")).appendChild(
                document.createElement("input")),
            {
                type: "range",
                min: range.x,
                max: range.y,
                step: ((range.y - range.x) / Interface.#RANGE_STEPS).toString(),
                value: this.#configuration[key].toString(),
                oninput: event => {
                    field.value = (this.#configuration[key] = Number.parseFloat(event.target.value)).toFixed(
                        Interface.#RANGE_DECIMALS);

                    if (remodel)
                        this.#onRemodel();
                    else
                        this.#onUpdate();
                }
            });
    }

    /**
     * Add a field with a randomizer
     * @param {string} title The field title
     * @param {Vector2} range The range
     * @param {string} key The key in the configuration to bind this range to
     * @param {boolean} [remodel] True if this change requires remodelling
     */
    #addFieldRandomizer(title, range, key, remodel = true) {
        const [row, field] = this.#addField(title, range, key, 0);

        Object.assign(
            row.appendChild(document.createElement("td")).appendChild(
                Object.assign(
                    document.createElement("button"),
                    {
                        innerText: "Randomize"
                    })),
            {
                onclick: () => {
                    field.value = (this.#configuration[key] =
                        range.x + Math.floor((range.y - range.x + 1) * Math.random()));

                    if (remodel)
                        this.#onRemodel();
                    else
                        this.#onUpdate();
                }
            });
    }
}