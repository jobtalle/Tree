import {Tree} from "./tree.js";

export function boot(canvas, fps) {
    const game = new Tree(canvas.width, canvas.height, canvas);

    const updateRate = 1 / fps;
    let lastTime = performance.now();
    let updateTime = 0;

    const loop = time => {
        game.render(updateTime / updateRate);

        updateTime += Math.min(.1, .001 * Math.max(0, time - lastTime));

        while (updateTime > updateRate) {
            game.update();

            updateTime -= updateRate;
        }

        lastTime = time;

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}