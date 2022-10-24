export const glslShade = `
    #ifdef SHADOWS
    uniform sampler2D shadows;
    #endif
    
    vec3 shade(
        const vec3 position,
        #ifdef SHADOWS
        const vec3 positionShadow,
        #endif
        const vec3 color,
        const vec3 normal,
        const vec4 material) {
        float diffuse = max(0., -dot(normal, sun)) * material.y;
        #ifdef SHADOWS
        float shadow = texture(shadows, positionShadow.xy * .5 + .5).r + .001 < positionShadow.z * .5 + .5 ? .5 : 1.;
        
        diffuse *= shadow;
        #endif
        vec3 d = normalize(eye - position);
        vec3 r = reflect(sun, normal);
        
        return color * (material.x + diffuse) + material.z * pow(max(0., dot(r, d)), material.w);
    }
    `;