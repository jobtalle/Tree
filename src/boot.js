import {Tree} from "./tree.js";

export function boot(canvas, fps) {
    const tree = new Tree();

    const loop = () => {
        tree.render();

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}