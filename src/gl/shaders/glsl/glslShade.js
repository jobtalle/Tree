export const glslShade = `
    uniform sampler2D shadows;
    
    vec3 shade(const vec3 position, const vec3 positionShadow, const vec3 color, const vec3 normal, const vec4 material) {
        float shadow = texture(shadows, positionShadow.xy * .5 + .5).r + .001 < positionShadow.z * .5 + .5 ? .5 : 1.;
        float diffuse = max(0., -dot(normal, sun)) * material.y * shadow;
        vec3 d = normalize(eye - position);
        vec3 r = reflect(sun, normal);
        
        return color * (material.x + diffuse) + material.z * pow(max(0., dot(r, d)), material.w);
    }
    `;