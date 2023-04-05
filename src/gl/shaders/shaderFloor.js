import {Shader} from "./shader.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {Color} from "../../color.js";

export class ShaderFloor extends Shader {
    static #COLOR = new Color("#3c5581");

    // language=GLSL
    static #VERTEX = glslGlobals + `
        layout(location = 0) in vec3 vertex;
        
        out vec3 iPosition;
        out vec3 iPositionProjected;
        
        void main() {
            iPosition = vertex;
            iPositionProjected = (shadowMatrix * vec4(vertex, 1.)).xyz;
            
            gl_Position = vp * vec4(vertex, 1.);
        }
        `;

    // language=GLSL
    static #FRAGMENT = glslGlobals + `
        uniform sampler2D shadows;

        in vec3 iPosition;
        in vec3 iPositionProjected;
        
        out vec4 color;
        
        void main() {
            const vec3 normal = vec3(0., 1., 0.);
            
            color = vec4(vec3(.9), 1.);
            
            float shadowDepth = texture(shadows, iPositionProjected.xy * .5 + .5).r;
            
            if (iPositionProjected.z * .5 + .5 > shadowDepth)
                color = vec4(COLOR, 1.);
            else
                discard;
        }
        `;

    /**
     * Construct the floor shader
     */
    constructor() {
        super(ShaderFloor.#VERTEX, ShaderFloor.#FRAGMENT, [
            ["COLOR", Shader.makeVec3(ShaderFloor.#COLOR)]
        ]);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}
