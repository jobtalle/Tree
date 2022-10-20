import {Renderable} from "./renderable.js";
import {gl} from "../gl.js";
import {PrimitiveSphere} from "./primitives/primitiveSphere.js";
import {AttributesShape} from "../attributes/attributesShape.js";
import {AttributesIndices} from "../attributes/attributesIndices.js";

export class Renderables {
    static WIREFRAME = new Renderable(() => {
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 16, 0);
    }, gl.LINES);

    static SPHERES = new Renderable(() => {
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    }, gl.TRIANGLES, () => {
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 24, 0);
        gl.vertexAttribDivisor(2, 1);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 24, 16);
        gl.vertexAttribDivisor(3, 1);
    });

    /**
     * Create primitive shapes
     */
    static createPrimitives() {
        const attributes = new AttributesShape();
        const indices = new AttributesIndices();

        new PrimitiveSphere().model(attributes, indices);

        Renderables.SPHERES.upload(attributes, indices);

        attributes.clear();
        indices.clear();
    }
}

Renderables.createPrimitives();