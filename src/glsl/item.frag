#include snoise3d.glsl;

uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_mask;

varying vec3 v_pos;
varying vec2 v_uv;

void main(void) {
  vec2 uv = v_uv / (1.0 + sin(u_time * 1.1) * 0.025);
  vec4 color = texture2D(u_texture, v_uv);
  vec4 mask = texture2D(u_mask, uv);

  float offx = v_uv.x + sin(v_uv.y + u_time) / 5.0;
  float offy = v_uv.y - u_time * 0.1 - cos(u_time) / 5.0;
  float n = snoise(vec3(offx, offy, u_time * 0.1) * 3.0) * 0.4;

  // float r = 0.5;
  // float dis = length(v_uv - vec2(0.5));
  // float blob = smoothstep(r, 0.0, dis) * 3.0;
  float blobMask = smoothstep(0.4, 0.4, n + mask.r);

  vec4 transparent = vec4(1.0, 1.0, 1.0, 0.0);

  vec4 final = mix(color, transparent, blobMask);

  gl_FragColor = final;
  // gl_FragColor = vec4(vec3(blobMask), 1.0);
  // gl_FragColor = vec4(vec3(n), 1.0);
}
