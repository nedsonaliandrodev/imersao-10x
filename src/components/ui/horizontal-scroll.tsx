"use client";

/* Horizontal Scroll · 21st.dev (@uilayout.contact/horizontal-scroll), refeito com escopo próprio:
   a secção prende, os painéis correm na horizontal e cada título desliza em sentido contrário. */

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

export type HPanel = { n: string; word: string; title: string; text: string; src: string; position?: string };

function Panel({ p, i, total, progress }: { p: HPanel; i: number; total: number; progress: MotionValue<number> }) {
  const seg = 1 / total;
  const x = useTransform(progress, [Math.max(0, (i - 1) * seg), Math.min(1, (i + 1) * seg)], ["38vw", "-38vw"]);
  const scale = useTransform(progress, [Math.max(0, (i - 0.5) * seg), i * seg + seg / 2, Math.min(1, (i + 1.5) * seg)], [1.18, 1.04, 1.18]);

  return (
    <li className="hpanel">
      <motion.img src={p.src} alt="" loading="lazy" className="hpanel__img" style={{ scale, objectPosition: p.position || "center" }} />
      <div className="hpanel__veil" />
      <motion.h3 className="hpanel__word" style={{ x }} aria-hidden="true">
        {p.word}
      </motion.h3>
      <div className="hpanel__cap">
        <span className="t-label" style={{ color: "var(--gold)" }}>
          {p.n} / {String(total).padStart(2, "0")}
        </span>
        <h4>{p.title}</h4>
        <p>{p.text}</p>
      </div>
    </li>
  );
}

export default function HorizontalScroll({ panels }: { panels: HPanel[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], ["0vw", `-${(panels.length - 1) * 100}vw`]);

  return (
    <section ref={ref} className="relative" style={{ height: `${panels.length * 100}vh` }} aria-label="O calibre, capítulo a capítulo">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.ul className="flex h-full" style={{ x, width: `${panels.length * 100}vw` }}>
          {panels.map((p, i) => (
            <Panel key={p.n} p={p} i={i} total={panels.length} progress={smooth} />
          ))}
        </motion.ul>
        <div className="hbar" aria-hidden="true">
          <motion.span style={{ scaleX: smooth }} />
        </div>
      </div>
    </section>
  );
}
