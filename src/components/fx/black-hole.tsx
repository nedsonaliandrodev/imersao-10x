"use client"

// From GradFlow, animated WebGL gradients for React: https://gradflow.meerbahadin.dev

import { useEffect, useRef } from "react"

export interface BlackHoleProps {
  /** The corona around the disc. */
  color1?: string
  /** The sky, and the disc itself. */
  color2?: string
  /** The hot rim. */
  color3?: string
  /** Animation speed. 0 freezes it. */
  speed?: number
  /** Size of the disc. Higher is smaller. */
  scale?: number
  /** Film grain, 0 to 0.5. */
  noise?: number
  className?: string
}

const VERTEX = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAGMENT = `
  precision highp float;

  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_scale;
  uniform float u_noise;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  float grain(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // centered coordinates, y in [-0.5, 0.5], x stretched by the aspect ratio
  vec2 centered(vec2 uv) {
    vec2 p = uv - 0.5;
    p.x *= u_resolution.x / max(u_resolution.y, 1.0);
    return p;
  }

  // the sun behind a moon: a dark disc with a crisp bright rim and a long soft
  // corona outside it. One side burns brighter, and that side drifts around.
  vec3 shade(vec2 uv, float time) {
    vec2 p = centered(uv) * 2.0;
    float t = time * 0.6;

    float r = length(p);
    float a = atan(p.y, p.x);
    float radius = 0.58 / sqrt(max(u_scale, 0.05));

    // whole multiples of the angle only, so the atan seam never shows
    float wobble = 0.007 * sin(a * 3.0 + t * 0.7) + 0.004 * sin(a * 5.0 - t * 0.5);
    float d = r - radius - wobble;
    float away = max(d, 0.0);

    float arc = 0.5 + 0.5 * cos(a - t * 0.35 - 1.2);
    arc *= arc;

    float outside = smoothstep(-0.05, 0.0, d);
    float corona = exp(-away * (6.5 - 4.0 * arc)) * outside;
    float rim = exp(-abs(d) * 46.0);
    float flare = exp(-away * 2.2) * arc * outside;

    vec3 color = u_color2 * (1.0 - 0.45 * smoothstep(0.0, 1.8, r));
    // the disc itself, a shade under the sky around it
    color *= mix(0.4, 1.0, smoothstep(-0.3, 0.02, d));

    color += u_color1 * (corona * (0.5 + 0.5 * arc) + flare * 0.35);
    color += u_color3 * (rim * (0.35 + 0.65 * arc) + corona * corona * arc * 0.55);

    return clamp(color, 0.0, 1.0);
  }

  void main() {
    vec3 color = shade(vUv, u_time);
    if (u_noise > 0.001) {
      float g = grain(vUv * 200.0 + u_time * 0.1);
      color *= 1.0 - u_noise * 0.4 + u_noise * g * 0.4;
    }
    gl_FragColor = vec4(color, 1.0);
  }
`

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const n = parseInt(full, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

export function BlackHole({
  color1 = "#ff5a14",
  color2 = "#080a24",
  color3 = "#ffe1aa",
  speed = 0.6,
  scale = 1.2,
  noise = 0.14,
  className,
}: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // the draw loop reads the latest props from here, so changing one never
  // rebuilds the WebGL program
  const props = useRef({ color1, color2, color3, speed, scale, noise })
  props.current = { color1, color2, color3, speed, scale, noise }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false })
    if (!gl) return

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )
    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      time: uniform("u_time"),
      color1: uniform("u_color1"),
      color2: uniform("u_color2"),
      color3: uniform("u_color3"),
      scale: uniform("u_scale"),
      noise: uniform("u_noise"),
      resolution: uniform("u_resolution"),
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      gl.viewport(0, 0, width, height)
    }

    let elapsed = 0
    let last: number | null = null
    let frame = 0

    const draw = (now: number) => {
      const p = props.current
      // accumulate speed over time, so changing it never makes the pattern jump
      if (last !== null) elapsed += Math.min((now - last) / 1000, 0.1) * p.speed
      last = now

      resize()
      gl.uniform1f(u.time, elapsed)
      gl.uniform3fv(u.color1, hexToVec3(p.color1))
      gl.uniform3fv(u.color2, hexToVec3(p.color2))
      gl.uniform3fv(u.color3, hexToVec3(p.color3))
      gl.uniform1f(u.scale, p.scale)
      gl.uniform1f(u.noise, p.noise)
      gl.uniform2f(u.resolution, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const loop = (now: number) => {
      draw(now)
      if (!still) frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    // with motion off there is no loop, so repaint the still frame on resize
    const observer = new ResizeObserver(() => {
      if (still) draw(performance.now())
    })
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  )
}
