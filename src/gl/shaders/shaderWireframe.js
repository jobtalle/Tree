import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {Color} from "../../color.js";

export class ShaderWireframe extends Shader {
    static #COLOR = new Color("#9fbee1");

    static #VERTEX = glslGlobals + `
        in vec3 position;
        
        void main() {
            gl_Position = vp * vec4(position, 1.);
        }
        `;
    static #FRAGMENT = `
        out vec4 color;
        
        void main() {
            color = vec4(COLOR, 1.);
        }
        `;

    /**
     * Construct the wireframe shader
     */
    constructor() {
        super(ShaderWireframe.#VERTEX, ShaderWireframe.#FRAGMENT, [
            ["COLOR", Shader.makeVec3(ShaderWireframe.#COLOR)]]);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}