import {gl} from "./gl/gl.js";
import {Color} from "./color.js";
import {Shaders} from "./gl/shaders/shaders.js";
import {Renderables} from "./gl/renderable/renderables.js";
import {AttributesWireframe} from "./gl/attributes/attributesWireframe.js";
import {AttributesIndices} from "./gl/attributes/attributesIndices.js";
import {Vector3} from "./math/vector3.js";
import {Uniforms} from "./gl/uniforms/uniforms.js";
import {Matrix4} from "./math/matrix4.js";

export class Tree {
    static #COLOR_BACKGROUND = new Color("#336997");

    #width;
    #height;

    constructor(width, height, canvas) {
        this.#width = width;
        this.#height = height;

        gl.clearColor(Tree.#COLOR_BACKGROUND.r, Tree.#COLOR_BACKGROUND.g, Tree.#COLOR_BACKGROUND.b, 1);

        const wireframeAttributes = new AttributesWireframe();
        const wireframeIndices = new AttributesIndices();

        wireframeAttributes.push(new Vector3());
        wireframeAttributes.push(new Vector3(Math.random(), Math.random(), Math.random()));

        wireframeIndices.push(0);
        wireframeIndices.push(1);

        Renderables.WIREFRAME.upload(wireframeAttributes, wireframeIndices);

        Uniforms.GLOBALS.setVP(new Matrix4());
        Uniforms.GLOBALS.upload();
    }

    update() {

    }

    render(time) {
        gl.viewport(0, 0, this.#width, this.#height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        Shaders.WIREFRAME.use();
        Renderables.WIREFRAME.draw();
    }
}