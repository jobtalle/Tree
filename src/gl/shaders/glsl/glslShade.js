export const glslShade = `
    vec3 shade(const vec3 position, const vec3 color, const vec3 normal, const vec4 material) {
        float diffuse = max(0., -dot(normal, sun)) * material.y;
        vec3 d = normalize(eye - position);
        vec3 r = reflect(sun, normal);
        
        return color * (material.x + diffuse) + material.z * pow(max(0., dot(r, d)), material.w);
    }
    `;