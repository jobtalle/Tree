import {ShaderWireframe} from "./shaderWireframe.js";
import {ShaderSpheres} from "./shaderSpheres.js";

export class Shaders {
    static WIREFRAME = new ShaderWireframe();
    static SPHERES = new ShaderSpheres();
}