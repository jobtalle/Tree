import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslShade} from "./glsl/glslShade.js";

export class ShaderFloor extends Shader {
    static #VERTEX = glslGlobals + `
        layout(location = 0) in vec3 vertex;
        
        out vec3 iPosition;
        
        void main() {
            iPosition = vertex;
            
            gl_Position = vp * vec4(vertex, 1.);
        }
        `;

    static #FRAGMENT = glslGlobals + glslShade + `
        in vec3 iPosition;
        
        out vec4 color;
        
        void main() {
            color = vec4(1., 0., 0., 1.);
        }
        `;

    /**
     * Construct the floor shader
     */
    constructor() {
        super(ShaderFloor.#VERTEX, ShaderFloor.#FRAGMENT);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}
