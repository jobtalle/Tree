export class Configuration {
    growth = 1;

    seed = Math.floor(Math.random() * 0x100000000);

    radiusInitial = .1;
    radiusDecay = .85;
    radiusThreshold = .02;

    extendTries = 15;
    extendAngle = .7;
}