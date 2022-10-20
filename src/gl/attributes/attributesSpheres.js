import {Attributes} from "./attributes.js";
import {gl} from "../gl.js";

export class AttributesSpheres extends Attributes {
    /**
     * Sphere instance attributes
     */
    constructor() {
        super([
                gl.FLOAT,
                gl.FLOAT,
                gl.FLOAT,
                gl.FLOAT,
                gl.FLOAT,
                gl.FLOAT
            ]);
    }

    /**
     * Push a sphere
     * @param {Vector3} center The sphere center
     * @param {number} radius The sphere radius
     * @param {number} growthStart The start growth
     * @param {number} growthEnd The end growth
     */
    push(center, radius, growthStart, growthEnd) {
        this.array.push(center.x, center.y, center.z, radius, growthStart, growthEnd);
    }
}