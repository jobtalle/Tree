import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslShade} from "./glsl/glslShade.js";
import {glslShadow} from "./glsl/glslShadow.js";

export class ShaderFloor extends Shader {
    static #VERTEX = glslGlobals + `
        layout(location = 0) in vec3 vertex;
        
        out vec3 iPosition;
        
        void main() {
            iPosition = vertex;
            
            gl_Position = vp * vec4(vertex, 1.);
        }
        `;

    static #FRAGMENT = glslGlobals + glslShade + glslShadow + `
        uniform sampler2D shadows;

        in vec3 iPosition;
        
        out vec4 color;
        
        void main() {
            const vec3 normal = vec3(0., 1., 0.);
            
            color = vec4(vec3(.9), 1.);
            
            if (detectShadow(iPosition, normal, shadows))
                color.rgb *= .5;
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
