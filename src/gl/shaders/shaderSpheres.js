import {Shader} from "./shader.js";
import {Color} from "../../color.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslShade} from "./glsl/glslShade.js";
import {Vector4} from "../../math/vector4.js";

export class ShaderSpheres extends Shader {
    static #COLOR = new Color("#729d70");
    static #MATERIAL = new Vector4(.3, .7, .5, 7);
    static #TRANSPARENCY = .5;

    static #VERTEX = glslGlobals + `
        in vec3 vertex;
        
        in vec4 sphere;
        in vec2 distance;
        
        out vec3 iNormal;
        out vec3 iPosition;
        
        void main() {
            float scale = smoothstep(0., 1., (growth - distance.x) / (distance.y - distance.x));
            
            iNormal = vertex;
            iPosition = vertex * sphere.w * scale + sphere.xyz;
        
            gl_Position = vp * vec4(iPosition, 1.);
        }
        `;

    static #FRAGMENT = glslGlobals + glslShade + `
        in vec3 iNormal;
        in vec3 iPosition;
        
        out vec4 color;
        
        void main() {
            color = vec4(shade(iPosition, COLOR, normalize(iNormal), MATERIAL), TRANSPARENCY);
        }
        `;

    /**
     * Construct the sphere shader
     */
    constructor() {
        super(ShaderSpheres.#VERTEX, ShaderSpheres.#FRAGMENT, [
            ["COLOR", Shader.makeVec3(ShaderSpheres.#COLOR)],
            ["MATERIAL", Shader.makeVec4(ShaderSpheres.#MATERIAL)],
            ["TRANSPARENCY", ShaderSpheres.#TRANSPARENCY]]);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}