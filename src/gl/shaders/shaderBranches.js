import {Shader} from "./shader.js";
import {Color} from "../../color.js";
import {Vector4} from "../../math/vector4.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslShade} from "./glsl/glslShade.js";

export class ShaderBranches extends Shader {
    static #COLOR = new Color("#9d8a70");
    static #MATERIAL = new Vector4(.3, .7, .2, 5);

    static #VERTEX = glslGlobals + `
        layout(location = 0) in vec3 vertex;
        layout(location = 1) in vec3 normal;
        layout(location = 2) in float depth;
        
        out vec3 iNormal;
        out vec3 iPosition;
        out vec3 iPositionShadow;
        out float iDepth;
        
        void main() {
            iNormal = normal;
            iPosition = vertex;
            iPositionShadow = (shadowMatrix * vec4(vertex, 1.)).xyz;
            iDepth = depth;
        
            gl_Position = vp * vec4(iPosition, 1.);
        }
        `;

    static #FRAGMENT = glslGlobals + glslShade + `
        in vec3 iNormal;
        in vec3 iPosition;
        in vec3 iPositionShadow;
        in float iDepth;
        
        out vec4 color;
        
        void main() {
            if (iDepth > growth)
                discard;
                
            vec3 normal = normalize(iNormal);
        
            color = vec4(shade(iPosition, iPositionShadow, COLOR, normal, MATERIAL), 1.);
        }
        `;

    /**
     * Construct the branches shader
     */
    constructor() {
        super(ShaderBranches.#VERTEX, ShaderBranches.#FRAGMENT, [
            ["SHADOWS"],
            ["COLOR", Shader.makeVec3(ShaderBranches.#COLOR)],
            ["MATERIAL", Shader.makeVec4(ShaderBranches.#MATERIAL)]]);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}