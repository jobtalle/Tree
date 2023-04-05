import {ShaderWireframe} from "./shaderWireframe.js";
import {ShaderSpheres} from "./shaderSpheres.js";
import {ShaderBranches} from "./shaderBranches.js";
import {ShaderBranchesDepth} from "./shaderBranchesDepth.js";
import {ShaderFloor} from "./shaderFloor.js";
import {ShaderVolumes} from "./shaderVolumes.js";
import {ShaderObstructions} from "./shaderObstructions.js";

export class Shaders {
    static FLOOR = new ShaderFloor();
    static WIREFRAME = new ShaderWireframe();
    static SPHERES = new ShaderSpheres();
    static BRANCHES = new ShaderBranches();
    static BRANCHES_DEPTH = new ShaderBranchesDepth();
    static VOLUMES = new ShaderVolumes();
    static OBSTRUCTIONS = new ShaderObstructions();
}