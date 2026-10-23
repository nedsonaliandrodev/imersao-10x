"use client";

import { useEffect, useRef, useState } from "react";
import { BASE } from "@/lib/asset";

const TOTAL = 330;
const WORD = "IMERSÃO".split("");

/* capítulos: [início, fim] em progresso 0..1 da secção */
const CHAPTERS = [
  { n: "01", label: "Mostrador", title: "Preto absoluto, ouro 18k", at: [0.13, 0.2] },
  { n: "02", label: "Mecanismo", title: "Dentro da máquina", at: [0.23, 0.32] },
  { n: "03", label: "Tourbillon", title: "O coração que vence a gravidade", at: [0.35, 0.45] },
  { n: "04", label: "Anatomia", title: "Nada sobra, nada falta", at: [0.49, 0.61] },
  { n: "05", label: "Montagem", title: "Tudo regressa ao lugar", at: [0.65, 0.74] },
  { n: "06", label: "No pulso", title: "O tempo, do seu lado", at: [0.8, 0.97] },
] as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export default function HeroCinema() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idxRef = useRef<HTMLSpanElement>(null);
  const [load, setLoad] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches;
    const dir = mobile ? "m" : "d";

    const frames: (HTMLImageElement | null)[] = new Array(TOTAL).fill(null);
    let alive = true;
    let loaded = 0;
    let current = 0;
    let drawn = -1;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.imageSmoothingQuality = "high";
      drawn = -1;
    };
    const nearest = (i: number) => {
      if (frames[i]) return i;
      for (let d = 1; d < TOTAL; d++) {
        if (i - d >= 0 && frames[i - d]) return i - d;
        if (i + d < TOTAL && frames[i + d]) return i + d;
      }
      return -1;
    };
    const draw = (i: number) => {
      const k = nearest(i);
      if (k < 0 || k === drawn) return;
      const img = frames[k]!;
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      drawn = k;
    };

    /* pré-carregamento em passadas: 1 em 8, depois 4, 2, 1 */
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [8, 4, 2, 1]) {
      for (let i = 0; i < TOTAL; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    }
    if (!seen.has(TOTAL - 1)) order.push(TOTAL - 1);
    const firstPass = Math.ceil(TOTAL / 8) + 1;
    let cursor = 0;
    const loadNext = () => {
      if (!alive || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.src = `${BASE}/frames/${dir}/${String(i + 1).padStart(4, "0")}.webp`;
      const done = () => {
        if (!alive) return;
        frames[i] = img.naturalWidth ? img : null;
        loaded++;
        if (loaded <= firstPass) setLoad(loaded / firstPass);
        if (loaded === firstPass) setReady(true);
        drawn = -1;
        draw(current);
        loadNext();
      };
      img.onload = done;
      img.onerror = done;
    };
    for (let c = 0; c < 6; c++) loadNext();

    let tx = 0, ty = 0, px = 0, py = 0;
    const fine = window.matchMedia("(pointer: fine)").matches && !reduce;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -16;
      ty = (e.clientY / window.innerHeight - 0.5) * -10;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let lastChap = -2;
    let raf = 0;
    const tick = () => {
      const top = section.offsetTop;
      const span = section.offsetHeight - window.innerHeight;
      const p = clamp((window.scrollY - top) / span);

      current = Math.round(p * (TOTAL - 1));
      draw(current);

      /* a câmara atravessa o título */
      const h = range(p, 0.015, 0.11);
      const e = h * h;
      stage.style.setProperty("--head-o", String(1 - range(p, 0.03, 0.11)));
      stage.style.setProperty("--head-s", String(1 + e * 0.5));
      stage.style.setProperty("--head-blur", `${e * 12}px`);
      stage.style.setProperty("--track", `${e * 0.45}em`);
      stage.style.setProperty("--head-veil", String(1 - range(p, 0.02, 0.12)));
      stage.style.setProperty("--cue-o", String(1 - range(p, 0, 0.04)));
      const f = 1 - range(p, 0, 0.09);
      stage.style.setProperty("--cb", `${(f * 2.5).toFixed(2)}px`);
      stage.style.setProperty("--cs", (1 + f * 0.035).toFixed(4));

      let on = -1;
      CHAPTERS.forEach((c, i) => { if (p >= c.at[0] && p <= c.at[1]) on = i; });
      if (on !== lastChap) {
        chapRefs.current.forEach((el, i) => el?.classList.toggle("is-on", i === on));
        if (idxRef.current) idxRef.current.textContent = on >= 0 ? CHAPTERS[on].n : "00";
        lastChap = on;
      }

      if (fine) {
        px += (tx - px) * 0.06;
        py += (ty - py) * 0.06;
        stage.style.setProperty("--px", `${px.toFixed(2)}px`);
        stage.style.setProperty("--py", `${py.toFixed(2)}px`);
      }
      raf = requestAnimationFrame(tick);
    };

    size();
    const onResize = () => { size(); draw(current); };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div className={`loader ${ready ? "is-done" : ""}`} aria-hidden={ready}>
        <div className="loader__in">
          <span className="loader__mark">Imersão <i className="t-accent">10X</i></span>
          <div className="loader__bar" style={{ ["--load" as string]: load }}>
            <span />
          </div>
          <span className="t-label">{String(Math.round(load * 100)).padStart(2, "0")}</span>
        </div>
      </div>

      <section id="topo" ref={sectionRef} className={`cine ${ready ? "is-ready" : ""}`} aria-label="IMERSÃO 10X, o tempo visto por dentro">
        <div ref={stageRef} className="cine__stage">
          <canvas ref={canvasRef} className="cine__canvas" aria-hidden />
          <div className="cine__veil" />
          <div className="cine__veil cine__veil--head" />

          <div className="head">
            <p className="head__eyebrow t-label fade-in" style={{ ["--d" as string]: "0.2s" }}>
              Calibre IMX·10 · Tourbillon voador · Ouro 18k
            </p>
            <h1 className="head__word" aria-label="Imersão 10X">
              {WORD.map((c, i) => (
                <span key={i} className="cut" aria-hidden style={{ ["--i" as string]: Math.abs(i - 3) }}>
                  <span className="cut__in">{c}</span>
                </span>
              ))}
            </h1>
            <div className="head__row" aria-hidden>
              <i />
              <span className="head__ten t-accent fade-in" style={{ ["--d" as string]: "0.9s" }}>10X</span>
              <i />
            </div>
            <p className="head__line fade-in" style={{ ["--d" as string]: "1.2s" }}>
              O tempo, visto <em className="t-accent">por dentro.</em>
            </p>
          </div>

          <div className="cine__index t-label" aria-hidden>
            <span ref={idxRef}>00</span> / 06
          </div>

          {CHAPTERS.map((c, i) => (
            <div key={c.n} ref={(el) => { chapRefs.current[i] = el; }} className="chap">
              <span className="t-label" style={{ color: "var(--gold)" }}>{c.n} · {c.label}</span>
              <h2>{c.title}</h2>
            </div>
          ))}

          <div className="foot">
            <div className="cue t-label">
              <span className="cue__line" />
              Desça para entrar
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
