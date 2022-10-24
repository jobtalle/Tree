import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslShade} from "./glsl/glslShade.js";

export class ShaderBranchesDepth extends Shader {
    static #VERTEX = glslGlobals + `
        in vec3 vertex;
        in vec3 normal;
        in float depth;
        
        out float iDepth;
        
        void main() {
            iDepth = depth;
        
            gl_Position = shadowMatrix * vec4(vertex, 1.);
        }
        `;

    static #FRAGMENT = glslGlobals + glslShade + `
        in float iDepth;
        
        void main() {
            if (iDepth > growth)
                discard;
        }
        `;

    constructor() {
        super(ShaderBranchesDepth.#VERTEX, ShaderBranchesDepth.#FRAGMENT);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}