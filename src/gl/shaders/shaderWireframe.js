import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {Color} from "../../color.js";

export class ShaderWireframe extends Shader {
    static #COLOR = new Color("#ffffff");

    static #VERTEX = glslGlobals + `
        layout(location = 0) in vec4 position;
        
        out float distance;
        
        void main() {
            distance = position.w;
            
            gl_Position = vp * vec4(position.xyz, 1.);
        }
        `;
    static #FRAGMENT = glslGlobals + `
        in float distance;
        
        out vec4 color;
        
        void main() {
            if (distance > growth)
                discard;
                
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