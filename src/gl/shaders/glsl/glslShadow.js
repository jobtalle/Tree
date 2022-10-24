export const  glslShadow = `
    bool detectShadow(vec3 position, vec3 normal, sampler2D shadows) {
        vec4 shadowMapPosition = shadowMatrix * vec4(position - normal * .001, 1.);
        vec2 normalized = vec2(shadowMapPosition.x * .5 + .5, .5 - shadowMapPosition.y * .5);
        
        return shadowMapPosition.z > texture(shadows, normalized).r - .001;
    }
    `;