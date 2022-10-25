import {Vector2} from "./math/vector2.js";
import {Collision} from "./network/collision.js";

export class Interface {
    static #ELEMENT = document.getElementById("interface");
    static #TABLE = Interface.#ELEMENT.appendChild(document.createElement("table"));
    static #CLASS_HEADER = "header";
    static #RANGE_STEPS = 512;
    static #RANGE_DECIMALS = 3;

    #configuration;
    #onUpdate;
    #onRemodel;
    #header = null;

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

        this.#addHeader("Rendering", "rendering");

        this.#addCheckbox("Wireframe", "layerWireframe", false);
        this.#addCheckbox("Branches", "layerBranches", false);
        this.#addCheckbox("Spheres", "layerSpheres", false);
        this.#addFieldSlider("Growth", new Vector2(0, 1), "growth", false);

        this.#addHeader("Structure", "structure");

        const randomize = this.#addFieldRandomizer("Seed", new Vector2(0, 0xFFFFFFFF), "seed", true);

        window.addEventListener("keydown", event => {
            if (event.key === " ")
                randomize.click();
        });

        this.#addFieldSlider("Radius at root", new Vector2(.05, Collision.RADIUS_MAX), "radiusInitial", true);
        this.#addFieldSlider("Radius decay", new Vector2(.7, .95), "radiusDecay", true);
        this.#addFieldSlider("Radius threshold", new Vector2(.012, .1), "radiusThreshold", true);
        this.#addFieldSlider("Extend tries", new Vector2(1, 20), "extendTries", true, true);
        this.#addFieldSlider("Extend angle", new Vector2(.1, 1.5), "extendAngle", true);
    }

    /**
     * Make a table row
     * @returns {HTMLTableRowElement} The table row
     */
    #makeRow() {
        const row = document.createElement("tr");

        this.#header.push(row);

        return Interface.#TABLE.appendChild(row);
    }

    /**
     * Add a header to the table
     * @param {string} title The header title
     * @param {string} category The category to toggle
     * @param {boolean} [visible] The initial visibility state
     */
    #addHeader(title, category, visible = true) {
        const children = [];

        Interface.#TABLE.appendChild(document.createElement("tr")).appendChild(Object.assign(
            document.createElement("td"),
            {
                className: Interface.#CLASS_HEADER,
                colSpan: 3,
                onclick: () => {
                    if (visible) {
                        for (const child of children)
                            child.style.display = "none";

                        visible = false;
                    }
                    else {
                        for (const child of children)
                            child.style.display = "";

                        visible = true;
                    }
                }
            })).appendChild(document.createTextNode(title));

        this.#header = children;
    }

    /**
     * Add a label to a row
     * @param {HTMLTableRowElement} row The row
     * @param {string} title The label name
     */
    #addLabel(row, title) {
        row.appendChild(
            document.createElement("td")).appendChild(
            document.createElement("label")).appendChild(
            document.createTextNode(title + ":"));
    }

    /**
     * Add a checkbox
     * @param {string} title The checkbox title
     * @param {string} key The key in the configuration to bind this checkbox to
     * @param {boolean} [remodel] True if this change requires remodelling
     */
    #addCheckbox(
        title,
        key,
        remodel = true) {
        const row = this.#makeRow();

        this.#addLabel(row, title);

        Object.assign(
            row.appendChild(document.createElement("input")),
            {
                type: "checkbox",
                checked: this.#configuration[key],
                onchange: event => {
                    this.#configuration[key] = event.target.checked;

                    if (remodel)
                        this.#onRemodel();
                    else
                        this.#onUpdate();
                }
            });
    }

    /**
     * Add a field
     * @param {string} title The field title
     * @param {Vector2} range The range
     * @param {string} key The key in the configuration to bind this range to
     * @param {boolean} [round] True if the value should be rounded
     * @param {number} [decimals] The number of decimals to display
     * @returns {{HTMLTableRowElement}, {HTMLInputElement}} The row and input elements
     */
    #addField(
        title,
        range,
        key,
        round = false,
        decimals = Interface.#RANGE_DECIMALS) {
        const row = this.#makeRow();

        this.#addLabel(row, title);

        return [row, Object.assign(
            row.appendChild(document.createElement("td")).appendChild(
                document.createElement("input")),
            {
                value: round ? this.#configuration[key].toString() : this.#configuration[key].toFixed(decimals),
                readOnly: true
            })];
    }

    /**
     * Add a field with a slider
     * @param {string} title The field title
     * @param {Vector2} range The range
     * @param {string} key The key in the configuration to bind this range to
     * @param {boolean} [remodel] True if this change requires remodelling
     * @param {boolean} [round] True if the value should be rounded
     */
    #addFieldSlider(
        title,
        range,
        key,
        remodel = true,
        round = false) {
        const [row, field] = this.#addField(title, range, key, round);

        Object.assign(
            row.appendChild(document.createElement("td")).appendChild(
                document.createElement("input")),
            {
                type: "range",
                min: range.x,
                max: range.y,
                step: round ? 1 : ((range.y - range.x) / Interface.#RANGE_STEPS).toString(),
                value: this.#configuration[key].toString(),
                oninput: event => {
                    field.value = round ?
                        this.#configuration[key] = Number.parseInt(event.target.value) :
                        (this.#configuration[key] = Number.parseFloat(event.target.value)).toFixed(
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
     * @returns {HTMLButtonElement} The button element
     */
    #addFieldRandomizer(
        title,
        range,
        key,
        remodel = true) {
        const [row, field] = this.#addField(title, range, key, true, 0);

        return Object.assign(
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