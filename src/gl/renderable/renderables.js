import {Renderable} from "./renderable.js";
import {gl} from "../gl.js";

export class Renderables {
    static WIREFRAME = new Renderable(() => {
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    }, gl.LINES);
}