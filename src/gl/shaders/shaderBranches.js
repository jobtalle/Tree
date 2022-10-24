import {Shader} from "./shader.js";
import {Color} from "../../color.js";
import {Vector4} from "../../math/vector4.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslShade} from "./glsl/glslShade.js";
import {glslShadow} from "./glsl/glslShadow.js";

export class ShaderBranches extends Shader {
    static #COLOR = new Color("#9d8a70");
    static #MATERIAL = new Vector4(.3, .7, .2, 5);

    static #VERTEX = glslGlobals + `
        layout(location = 0) in vec3 vertex;
        layout(location = 1) in vec3 normal;
        layout(location = 2) in float depth;
        
        out vec3 iNormal;
        out vec3 iPosition;
        out float iDepth;
        
        void main() {
            iNormal = normal;
            iPosition = vertex;
            iDepth = depth;
        
            gl_Position = vp * vec4(iPosition, 1.);
        }
        `;

    static #FRAGMENT = glslGlobals + glslShade + glslShadow + `
        uniform sampler2D shadows;
        
        in vec3 iNormal;
        in vec3 iPosition;
        in float iDepth;
        
        out vec4 color;
        
        void main() {
            if (iDepth > growth)
                discard;
                
            vec3 normal = normalize(iNormal);
        
            color = vec4(shade(iPosition, COLOR, normal, MATERIAL), 1.);
            
            if (detectShadow(iPosition, normal, shadows))
                color.rgb *= .5;
        }
        `;

    /**
     * Construct the branches shader
     */
    constructor() {
        super(ShaderBranches.#VERTEX, ShaderBranches.#FRAGMENT, [
            ["COLOR", Shader.makeVec3(ShaderBranches.#COLOR)],
            ["MATERIAL", Shader.makeVec4(ShaderBranches.#MATERIAL)]]);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}