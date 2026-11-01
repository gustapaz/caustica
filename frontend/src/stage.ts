export function opticsStage(
  glass: HTMLCanvasElement,
  beams: HTMLCanvasElement,
) {
  const ctx = beams.getContext("2d")!;
  const gl = glass.getContext("webgl", { alpha: true, antialias: false });
  let data: any,
    paused = matchMedia("(prefers-reduced-motion: reduce)").matches,
    phase = 0,
    visible = true;
  const vert = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const frag = `precision mediump float;uniform vec2 resolution;uniform vec2 a;uniform vec2 b;uniform vec2 c;uniform float time;float edge(vec2 p,vec2 a,vec2 b){vec2 v=b-a;return length(p-a-v*clamp(dot(p-a,v)/dot(v,v),0.,1.));}float cross2(vec2 a,vec2 b){return a.x*b.y-a.y*b.x;}void main(){vec2 p=(gl_FragCoord.xy-resolution*.5)/min(resolution.x,resolution.y)*5.;float d=min(edge(p,a,b),min(edge(p,b,c),edge(p,c,a)));bool inside=cross2(b-a,p-a)>=0.&&cross2(c-b,p-b)>=0.&&cross2(a-c,p-c)>=0.;float rim=exp(-d*90.);float glow=exp(-d*14.)*.1;vec3 col=vec3(.68,.85,.94)*(rim*.7+glow);if(inside){float sweep=pow(max(0.,sin((p.x+p.y*.4)*2.5+time*.1)),12.);col+=vec3(.12,.16,.21)+sweep*.14;col+=.06*cos(vec3(0.,2.,4.)+p.y*3.);}gl_FragColor=vec4(col,inside?.55:rim*.8+glow);}`;
  let program: WebGLProgram | undefined;
  if (gl) {
    try {
      const shader = (kind: number, src: string) => {
        const s = gl.createShader(kind)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
          throw new Error("shader");
        return s;
      };
      program = gl.createProgram()!;
      gl.attachShader(program, shader(gl.VERTEX_SHADER, vert));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(program);
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const p = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(p);
      gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
    } catch {
      program = undefined;
    }
  }
  function resize() {
    const r = glass.getBoundingClientRect(),
      dpr = Math.min(devicePixelRatio, 1.5);
    for (const c of [glass, beams]) {
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
    }
    gl?.viewport(0, 0, glass.width, glass.height);
  }
  resize();
  new ResizeObserver(resize).observe(glass);
  const xy = (p: number[]) => [
    beams.width / 2 + (p[0] * Math.min(beams.width, beams.height)) / 5,
    beams.height / 2 - (p[1] * Math.min(beams.width, beams.height)) / 5,
  ];
  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden || !visible) return;
    if (!paused) phase += 0.015;
    ctx.clearRect(0, 0, beams.width, beams.height);
    if (!data) return;
    if (gl && program) {
      gl.useProgram(program);
      gl.uniform2f(
        gl.getUniformLocation(program, "resolution"),
        glass.width,
        glass.height,
      );
      for (let i = 0; i < 3; i++)
        gl.uniform2f(
          gl.getUniformLocation(program, ["a", "b", "c"][i]),
          ...(data.vertices[i] as [number, number]),
        );
      gl.uniform1f(gl.getUniformLocation(program, "time"), phase);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      ctx.strokeStyle = "#b4cbd9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      data.vertices.forEach((p: number[], i: number) => {
        const [x, y] = xy(p);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "lighter";
    for (const ray of data.rays) {
      for (const [j, s] of ray.segments.entries()) {
        const a = xy(s.from),
          b = xy(s.to);
        ctx.strokeStyle = ray.color;
        ctx.shadowColor = ray.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(...(a as [number, number]));
        ctx.lineTo(...(b as [number, number]));
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (!paused) {
          const t = (phase * 0.32 + j * 0.17 + ray.wavelength_nm * 0.001) % 1;
          ctx.fillStyle = "#fff";
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.arc(
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t,
            1.7,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
  frame();
  new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
  }).observe(glass);
  return {
    set: (r: any) => {
      data = r;
    },
    pause: (v: boolean) => {
      paused = v;
    },
  };
}
