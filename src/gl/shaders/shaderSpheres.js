import {Shader} from "./shader.js";
import {Color} from "../../color.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslPhong} from "./glsl/glslPhong.js";
import {Vector3} from "../../math/vector3.js";

export class ShaderSpheres extends Shader {
    static #COLOR = new Color("#729d70");
    static #MATERIAL = new Vector3(.2, .8, 12);

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

    static #FRAGMENT = glslGlobals + glslPhong + `
        in vec3 iNormal;
        
        out vec4 color;
        
        void main() {
            color = vec4(phong(COLOR, normalize(iNormal), sun, MATERIAL), 1.);
        }
        `;

    /**
     * Construct the sphere shader
     */
    constructor() {
        super(ShaderSpheres.#VERTEX, ShaderSpheres.#FRAGMENT, [
            ["COLOR", Shader.makeVec3(ShaderSpheres.#COLOR)],
            ["MATERIAL", Shader.makeVec3(ShaderSpheres.#MATERIAL)]]);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}