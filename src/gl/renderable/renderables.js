import {Renderable} from "./renderable.js";
import {gl} from "../gl.js";

export class Renderables {
    static WIREFRAME = new Renderable(() => {
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 16, 0);
    }, gl.LINES);
}