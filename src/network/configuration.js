import {BoundsType} from "../boundsType.js";

export class Configuration {
    growth = 1;

    layerWireframe = false;
    layerBranches = true;
    layerSpheres = false;
    layerVolumes = true;

    seed = 42;

    roots = 1;

    radiusInitial = .1;
    radiusDecay = .89;
    radiusThreshold = .015;

    angleThreshold = Math.PI * .7;

    collisionRadius = .85;

    extendTries = 5;
    extendAngle = .72;
    extendThreshold = 1;

    boundsType = BoundsType.NONE;

    boundsEllipsoidBase = 0;
    boundsEllipsoidHeight = 1.5;
    boundsEllipsoidRadius = .5;
}