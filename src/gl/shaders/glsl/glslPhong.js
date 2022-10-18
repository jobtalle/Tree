export const glslPhong = `
    vec3 phong(const vec3 color, const vec3 normal, const vec3 material) {
        float diffuse = max(0., -dot(normal, sun)) * material.y;
        
        return color * (material.x + diffuse);
    }
    `;