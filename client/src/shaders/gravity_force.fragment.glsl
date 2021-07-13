#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_push; // 1.0 - push, 0.0 - pull
varying vec2 vUv;

#define SPCOL1 (vec3(233.0, 30.0, 99.0)/255.)
#define SPCOL2 (vec3(83.0, 205.0, 80.0)/255.)
#define BACKCOL (vec3(0.0, 0.0, 0.0)/255.)
#define PI 3.14159265359

void main()
{
    // vec2 uv = 2.0 * vUv - 1.0; spiral
    // float r = length(uv - 1.0); spiral
    vec2 uv = vUv;
    float r = length(uv - 0.5);
    float a = atan(uv.y,uv.x); // to polar
    float R = 0.5;
    float circle = smoothstep(r, r+0.3, R);
    float s2 = 2.0 * a + 2.0*PI*log(r);
    float pct = sin(2.0 * s2+(1.0 - 2.0 * u_push)*u_time);
    pct = mix(1.0 - circle, pct, circle);
    float c2 = smoothstep(-1.0, 1.0, pct);
    vec3 FRCOL = mix(SPCOL1, SPCOL2, u_push);
    vec3 col = mix(FRCOL, BACKCOL, c2);
    gl_FragColor = vec4(col, col);
}
