import {Vector2} from "./math/vector2.js";
import {Collision} from "./network/collision/collision.js";
import {BoundsType} from "./boundsType.js";

export class Interface {
    static #ELEMENT = document.getElementById("interface");
    static #TABLE = Interface.#ELEMENT.appendChild(document.createElement("table"));
    static #CLASS_HEADER = "header";
    static #CLASS_HIDDEN = "hidden";
    static #CLASS_HIDDEN_DROPDOWN = "hidden-dropdown";
    static #RANGE_STEPS = 512;
    static #RANGE_DECIMALS = 3;

    #configuration;
    #onUpdate;
    #onRemodel;
    #header = null;
    #select = null;
    #selectChildren = null;
    #selectGroup = null;

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

        this.#addHeader("Rendering");

        this.#addCheckbox("Wireframe", "layerWireframe", false);
        this.#addCheckbox("Branches", "layerBranches", false);
        this.#addCheckbox("Spheres", "layerSpheres", false);
        this.#addCheckbox("Volumes", "layerVolumes", false);
        this.#addFieldSlider("Growth", new Vector2(0, 1), "growth", false);

        this.#addHeader("Structure");

        const randomize = this.#addFieldRandomizer("Seed", new Vector2(0, 0xFFFFFFFF), "seed", true);

        window.addEventListener("keydown", event => {
            if (event.key === " ")
                randomize.click();
        });

        this.#addFieldSlider("Roots", new Vector2(1, 8), "roots", true, true);
        this.#addFieldSlider("Radius at root", new Vector2(.05, Collision.RADIUS_MAX), "radiusInitial", true);
        this.#addFieldSlider("Radius decay", new Vector2(.7, .95), "radiusDecay", true);
        this.#addFieldSlider("Radius threshold", new Vector2(.012, .1), "radiusThreshold", true);
        this.#addFieldSlider("Extend tries", new Vector2(1, 20), "extendTries", true, true);
        this.#addFieldSlider("Extend angle", new Vector2(.1, 1.5), "extendAngle", true);
        this.#addFieldSlider("Extend threshold", new Vector2(0, 6), "extendThreshold", true, true);
        this.#addFieldSlider("Collision radius", new Vector2(0, 1.5), "collisionRadius", true, false);

        this.#addHeader("Bounds");

        this.#addDropdown("Type", "boundsType", true);
        this.#addDropdownOption("None", BoundsType.NONE);

        this.#addDropdownOption("Oval", BoundsType.OVAL);
        this.#addFieldSlider("Oval base", new Vector2(-Collision.SIZE * .5, 0), "boundsOvalBase", true, false);
        this.#addFieldSlider("Oval height", new Vector2(.5, Collision.SIZE), "boundsOvalHeight", true, false);
        this.#addFieldSlider("Oval radius", new Vector2(.1, Collision.SIZE * .5), "boundsOvalRadius", true, false);

        this.#endDropdown();
    }

    /**
     * Make a table row
     * @param {boolean} [collapsible] True if this row should be collapsible by its header
     * @returns {HTMLTableRowElement} The table row
     */
    #makeRow(collapsible = true) {
        const row = document.createElement("tr");

        if (collapsible) {
            this.#header?.push(row);

            if (this.#selectGroup) {
                this.#selectGroup.push(row);

                if (this.#select.children.length !== 1)
                    row.classList.add(Interface.#CLASS_HIDDEN_DROPDOWN);
            }
        }

        return Interface.#TABLE.appendChild(row);
    }

    /**
     * Add a header to the table
     * @param {string} title The header title
     * @param {boolean} [visible] The initial visibility state
     */
    #addHeader(title, visible = true) {
        const children = [];

        this.#makeRow(false).appendChild(Object.assign(
            document.createElement("td"),
            {
                className: Interface.#CLASS_HEADER,
                colSpan: 3,
                onclick: () => {
                    if (visible) {
                        for (const child of children)
                            child.classList.add(Interface.#CLASS_HIDDEN);

                        visible = false;
                    }
                    else {
                        for (const child of children)
                            child.classList.remove(Interface.#CLASS_HIDDEN);

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
     * Add a dropdown
     * @param {string} title The dropdown title
     * @param {string} key The key in the configuration to bind this dropdown to
     * @param {boolean} [remodel] True if this change requires remodelling
     */
    #addDropdown(title, key, remodel = false) {
        const row = this.#makeRow();
        const children = {};

        this.#addLabel(row, title);

        this.#selectChildren = children;
        this.#select = row.appendChild(Object.assign(
            document.createElement("td"),
            {
                colSpan: 2
            })).appendChild(Object.assign(
                document.createElement("select"),
            {
                    onchange: event => {
                        this.#configuration[key] = event.target.value;

                        for (const category of Object.keys(children)) {
                            if (category === event.target.value) {
                                for (const child of children[category])
                                    child.classList.remove(Interface.#CLASS_HIDDEN_DROPDOWN);
                            }
                            else {
                                for (const child of children[category])
                                    child.classList.add(Interface.#CLASS_HIDDEN_DROPDOWN);
                            }
                        }

                        if (remodel)
                            this.#onRemodel();
                        else
                            this.#onUpdate();
                    }
                }));
    }

    /**
     * Add a dropdown option
     * @param {string} title The option title
     * @param {string} value The value of this option
     */
    #addDropdownOption(title, value) {
        this.#selectChildren[value] = this.#selectGroup = [];
        this.#select?.appendChild(Object.assign(document.createElement("option"),
            {
                value: value
            })).appendChild(document.createTextNode(title));
    }

    /**
     * End the dropdown that's currently being appended
     */
    #endDropdown() {
        this.#selectGroup = null;
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
            row.appendChild(document.createElement("td")).appendChild(document.createElement("input")),
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
     * @param {boolean} [readonly] True if the field is readonly
     * @param {function} [onChange] A function that returns a new value if it was manually entered
     * @returns {{HTMLTableRowElement}, {HTMLInputElement}} The row and input elements
     */
    #addField(
        title,
        range,
        key,
        round = false,
        decimals = Interface.#RANGE_DECIMALS,
        readonly = true,
        onChange = null) {
        const row = this.#makeRow();

        this.#addLabel(row, title);

        return [row, Object.assign(
            row.appendChild(document.createElement("td")).appendChild(
                document.createElement("input")),
            {
                value: round ? this.#configuration[key].toString() : this.#configuration[key].toFixed(decimals),
                readOnly: readonly,
                oninput: event => {
                    if (onChange)
                        onChange(Number.parseFloat(event.target.value));
                }
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
        const [row, field] = this.#addField(title, range, key, true, 0, false, value => {
            const seed = Math.max(range.x, Math.min(range.y, Math.round(value)));

            if (!isNaN(seed)) {
                this.#configuration[key] = seed;

                if (remodel)
                    this.#onRemodel();
                else
                    this.#onUpdate();
            }
        });

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