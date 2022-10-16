import {Tree} from "./tree.js";

export function boot(canvas, fps) {
    const tree = new Tree();

    const updateRate = 1 / fps;
    let lastTime = performance.now();
    let updateTime = 0;

    const loop = time => {
        tree.render(updateTime / updateRate);

        updateTime += Math.min(.1, .001 * Math.max(0, time - lastTime));

        while (updateTime > updateRate) {
            tree.update();

            updateTime -= updateRate;
        }

        lastTime = time;

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}