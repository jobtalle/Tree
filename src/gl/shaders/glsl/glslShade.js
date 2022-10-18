export const glslShade = `
    vec3 shade(const vec3 color, const vec3 normal, const vec2 material) {
        float diffuse = max(0., -dot(normal, sun)) * material.y;
        
        return color * (material.x + diffuse);
    }
    `;