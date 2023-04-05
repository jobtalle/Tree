import {Shader} from "./shader.js";
import {Color} from "../../color.js";
import {Vector4} from "../../math/vector4.js";
import {glslGlobals, UniformBlockGlobals} from "../uniforms/uniformBlockGlobals.js";
import {glslShade} from "./glsl/glslShade.js";

export class ShaderObstructions extends Shader {
    static #COLOR = new Color("#d23535");
    static #MATERIAL = new Vector4(.5, .5, .2, 12);

    // language=GLSL
    static #VERTEX = glslGlobals + `
        layout(location = 0) in vec3 vertex;
        layout(location = 1) in vec3 normal;

        out vec3 iNormal;
        out vec3 iPosition;
        out vec3 iPositionShadow;

        void main() {
            iNormal = normal;
            iPosition = vertex;
            iPositionShadow = (shadowMatrix * vec4(vertex, 1.)).xyz;

            gl_Position = vp * vec4(vertex, 1.);
        }
        `;

    // language=GLSL
    static #FRAGMENT = glslGlobals + glslShade + `
        in vec3 iNormal;
        in vec3 iPosition;
        in vec3 iPositionShadow;

        out vec4 color;

        void main() {
            if (iPosition.y < 0.)
            discard;

            color = vec4(shade(iPosition, iPositionShadow, COLOR, normalize(iNormal), MATERIAL), 1.);
        }
        `;

    /**
     * Construct the obstructions shader
     */
    constructor() {
        const defines = [
            ["SHADOWS"],
            ["COLOR", Shader.makeVec3(ShaderObstructions.#COLOR)],
            ["MATERIAL", Shader.makeVec4(ShaderObstructions.#MATERIAL)]];

        super(ShaderObstructions.#VERTEX, ShaderObstructions.#FRAGMENT, defines);

        this.use();
        this.bindUniformBlock(UniformBlockGlobals.NAME, UniformBlockGlobals.BINDING);
    }
}