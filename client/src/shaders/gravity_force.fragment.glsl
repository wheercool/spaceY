#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

//#define SPCOL1 (vec3(116.,255.,255.)/255.)
#define SPCOL1 (vec3(233.0, 30.0, 99.0)/255.)
//#define SPCOL2 (vec3(55.,213.,255.)/255.)
#define SPCOL2 (vec3(175.0, 21.0, 73.0)/255.)
#define BACKCOL (vec3(0.0, 0.0, 0.0)/255.)
#define PI 3.14159265359

/*
void main()
{
    float border = 0.1;
    vec2 st = vUv;
    float radius = 0.4; // * sin(u_time);
    float d = 0.0;
    float n = 10.0;
    float factor = fract(pow(1.0 + 2.0 * abs(sin(u_time / 80.0)), 2.0));
    d = length(st-0.5);
    float pct = fract(d * n * factor);
    pct = 1.0 - smoothstep(0.1, 0.11, pct);
    vec3 color = vec3(pct);
    gl_FragColor = vec4(color, pct);
}
*/
void main()
{
    // vec2 uv = 2.0 * vUv - 1.0; spiral
    vec2 uv = vUv;


    // float r = length(uv - 1.0); spiral
    float r = length(uv - 0.5);
    float a = atan(uv.y,uv.x); // to polar
    float R = 0.5;
    float circle = smoothstep(r, r+0.3, R);
    float s2 = 2.0 * a + 2.0*PI*log(r);
    float pct = sin(2.0 * s2-u_time);
    pct = mix(1.0 - circle, pct, circle);
    float c2 = smoothstep(-1.0, 1.0, pct);
    vec3 col = mix(SPCOL1, BACKCOL, c2);
    gl_FragColor = vec4(col, col);

    //omit in sfml
    //fragColor = fakeAlpha(fragColor);
}
