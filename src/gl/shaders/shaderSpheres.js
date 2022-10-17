import {Shader} from "./shader.js";
import {Color} from "../../color.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";

export class ShaderSpheres extends Shader {
    static #COLOR = new Color("#ad9c56");

    static #VERTEX = glslGlobals + `
        in vec3 vertex;
        in vec3 normal;
        in vec4 sphere;
        
        out vec3 iNormal;
        
        void main() {
            iNormal = vertex;
        
            gl_Position = vp * vec4(vertex * sphere.w + sphere.xyz, 1.);
        }
        `;

    static #FRAGMENT = glslGlobals + `
        in vec3 iNormal;
        
        out vec4 color;
        
        void main() {
            color = vec4(COLOR, 1.);
        }
        `;

    /**
     * Construct the sphere shader
     */
    constructor() {
        super(ShaderSpheres.#VERTEX, ShaderSpheres.#FRAGMENT, [
            ["COLOR", Shader.makeVec3(ShaderSpheres.#COLOR)]]);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}