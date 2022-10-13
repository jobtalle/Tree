export const gl = Object.freeze(document.getElementById("renderer").getContext("webgl2", {
    stencil: true,
    desynchronized: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
    premultipliedAlpha: false,
    alpha: false
}));