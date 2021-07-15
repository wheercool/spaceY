precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

#define PI 3.1415

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898, 78.233)))*
    43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

    #define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    float speed = 0.5;
    vec2 position = 8.0 * vec2(vUv.x, vUv.y + u_time * speed);
    float noise1 = fbm(position);
    float noise2 = fbm(8.0 * vec2(vUv.x, vUv.y + u_time * 2.0*speed));
    //
    float y = 1.0 - pow(cos(PI * (vUv.x - 0.5) / 2.0), 1.0);
    float gradient2 = vUv.y;
    float gradient = (vUv.y - y);
    float fire = gradient2 - 0.5 * noise2;

    // rendering
    vec3 color = vec3(0.0);
    vec3 COLOR = vec3(255.0, 193.0, 7.0) / 255.0;
    color = mix(color, COLOR, fire);

    //    float opacity = color;
    float opacity = 1.0;
    gl_FragColor = vec4(color, gradient);
//    gl_FragColor = vec4(vec3(gradient), 1.0);
}