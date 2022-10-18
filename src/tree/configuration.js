export class Configuration {
    growth = 1;
    layerWireframe = true;
    layerGeometry = true;

    seed = Math.floor(Math.random() * 0x100000000);

    radiusInitial = .1;
    radiusDecay = .89;
    radiusThreshold = .015;

    extendTries = 3;
    extendAngle = .7;
}