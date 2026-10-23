"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ScrollWordReveal } from "@/components/ui/scroll-word-reveal";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import { NeuralNoise } from "@/components/fx/neural-noise";
import { BlackHole } from "@/components/fx/black-hole";
import { GlassFold } from "@/components/fx/glass-fold";
import { ParticleTextEffect } from "@/components/fx/text-particle";
import HalftoneWordmarkFooter from "@/components/fx/halftone-wordmark-footer";
import LazyMount from "@/components/LazyMount";
import Logo, { Emblem } from "@/components/Logo";
import { asset } from "@/lib/asset";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────── título que se corta ao entrar (lógica do Vertical Cut Reveal · 21st, animada em CSS) ───────── */
function CutTitle({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const words = children.split(" ");
  return (
    <h2 ref={ref} className={`${className} cutw ${inView ? "is-in" : ""}`} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} className="cut" aria-hidden style={{ ["--i" as string]: i }}>
          <span className="cut__w">{w}</span>
        </span>
      ))}
    </h2>
  );
}

function Label({ n, children, dark = false }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <span className="t-label flex items-center gap-3" style={dark ? { color: "#5b4a2c" } : undefined}>
      <b className="font-normal" style={{ color: dark ? "#8a6a2f" : "var(--gold)" }}>{n}</b>
      <i className="h-px w-8" style={{ background: dark ? "rgba(23,18,10,.25)" : "var(--line)" }} />
      {children}
    </span>
  );
}

/* ───────── navegação ───────── */
export function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`nav ${solid ? "is-solid" : ""}`}>
      <a href="#topo" aria-label="IMERSÃO 10X, início"><Logo /></a>
      <nav className="nav__links t-label" aria-label="Secções">
        <a href="#manifesto">Manifesto</a>
        <a href="#eclipse">O tempo</a>
        <a href="#materia">Matéria</a>
        <a href="#especificacoes">Ficha</a>
      </nav>
      <a className="nav__cta" href="#reservar">Reservar</a>
    </header>
  );
}

/* ───────── 01 · manifesto sobre fumo de ouro (21st · Neural Noise + Scroll Word Reveal) ───────── */
export function Manifesto() {
  return (
    <div id="manifesto">
      <ScrollWordReveal
        background={
          <LazyMount className="absolute inset-0 opacity-70">
            <NeuralNoise color={[0.86, 0.66, 0.32]} opacity={0.9} speed={0.0007} />
          </LazyMount>
        }
        kicker={<Label n="01">Manifesto</Label>}
        text="Um relógio não se usa. Habita-se. Quatrocentas e doze peças trabalham em silêncio para que cada segundo seu valha mais do que o anterior."
        accentWords={["habita-se", "silêncio"]}
      />
    </div>
  );
}

/* ───────── 02 · eclipse: o tempo dobra-se (21st · Black Hole) ───────── */
function Count({ to, sep = false }: { to: number; sep?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 2400;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{sep ? v.toLocaleString("pt-PT").replace(/\s/g, " ") : v}</span>;
}

const NUMBERS = [
  { v: 412, unit: "", label: "Componentes" },
  { v: 72, unit: "h", label: "Reserva de marcha" },
  { v: 28800, unit: "", label: "Alternâncias por hora", sep: true },
  { v: 10, unit: "", label: "Peças no mundo" },
];

export function Eclipse() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.25, 0.92]);
  const titleO = useTransform(scrollYProgress, [0.05, 0.25, 0.7, 0.9], [0, 1, 1, 0.15]);
  const titleY = useTransform(scrollYProgress, [0.05, 0.3], [60, 0]);
  const numsO = useTransform(scrollYProgress, [0.45, 0.62], [0, 1]);
  const numsY = useTransform(scrollYProgress, [0.45, 0.62], [40, 0]);

  return (
    <section id="eclipse" ref={ref} className="relative h-[260vh]" aria-label="O tempo dobra-se aqui">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale }}>
          <LazyMount className="absolute inset-0">
            <BlackHole color1="#c99a4c" color2="#040302" color3="#fff1cf" speed={0.35} scale={1.75} noise={0.08} className="h-full w-full" />
          </LazyMount>
        </motion.div>
        <div className="eclipse__veil" />
        <motion.div className="eclipse__copy wrap" style={{ opacity: titleO, y: titleY }}>
          <Label n="02">O tempo</Label>
          <p className="eclipse__title">
            O tempo <em className="t-accent">dobra-se</em> aqui.
          </p>
        </motion.div>
        <motion.div className="eclipse__nums wrap" style={{ opacity: numsO, y: numsY }}>
          {NUMBERS.map((n) => (
            <div key={n.label} className="eclipse__n">
              <b>
                <Count to={n.v} sep={n.sep} />
                {n.unit ? <small className="t-accent">{n.unit}</small> : null}
              </b>
              <span className="t-label">{n.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── 03 · a lupa: o tourbillon visto por uma abertura que cresce com o scroll ───────── */
export function Lupa() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const r = useTransform(scrollYProgress, [0, 0.6], [6, 30]);
  const clip = useTransform(r, (v) => `circle(${v}vmin at 50% 50%)`);
  const ring = useTransform(r, (v) => `${v * 2 + 4}vmin`);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.5, 1.08]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const leftO = useTransform(scrollYProgress, [0.15, 0.35, 0.85, 1], [0, 1, 1, 0]);
  const rightO = useTransform(scrollYProgress, [0.35, 0.55, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]" aria-label="O coração do calibre">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="lupa__window" style={{ clipPath: clip }}>
          <motion.img src={asset("/img/tourbillon.webp")} alt="O tourbillon voador do calibre IMX·10" className="lupa__img" style={{ scale: imgScale }} />
        </motion.div>
        <motion.div className="lupa__ring" style={{ width: ring, height: ring, rotate: rot }} aria-hidden>
          <Emblem size={100} className="lupa__emblem" />
        </motion.div>
        <motion.div className="lupa__left" style={{ opacity: leftO }}>
          <Label n="03">O coração</Label>
          <p className="lupa__big">Tourbillon <em className="t-accent">voador</em></p>
        </motion.div>
        <motion.p className="lupa__right" style={{ opacity: rightO }}>
          Uma gaiola de titânio dá uma volta completa por minuto para anular a gravidade. Sem ponte por cima. Só luz.
        </motion.p>
      </div>
    </section>
  );
}

/* ───────── 04 · matéria, secção clara sobre seda champanhe (21st · Glass Fold + Text Block) ───────── */
const MATERIALS = [
  { n: "Au 750", title: "Ouro amarelo 18k", text: "Fundido, torneado e polido à mão até a luneta canelada devolver a luz como um espelho." },
  { n: "Al₂O₃", title: "Safira", text: "Vidro e fundo em cristal de safira, quase tão duro como o diamante." },
  { n: "Rh", title: "Ródio preto", text: "As pontes esqueletizadas ganham profundidade e as bordas polidas brilham por contraste." },
];

export function Materia() {
  return (
    <section id="materia" className="materia" aria-label="Matéria">
      <LazyMount className="absolute inset-0">
        <GlassFold color1="#f6ecd6" color2="#d8bd86" color3="#b08a4a" speed={0.25} className="h-full w-full" />
      </LazyMount>
      <div className="materia__veil" />
      <div className="materia__in wrap">
        <Label n="04" dark>Matéria</Label>
        <CutTitle className="materia__title">Ouro que respira.</CutTitle>
        <div className="materia__grid">
          {MATERIALS.map((m, i) => (
            <motion.article
              key={m.title}
              className="materia__card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: EASE }}
            >
              <span className="materia__sym">{m.n}</span>
              <h3>{m.title}</h3>
              <TextBlockAnimation blockColor="#17120a" stagger={0.1} duration={0.6}>
                <p>{m.text}</p>
              </TextBlockAnimation>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 05 · ficha técnica ───────── */
const SPECS = [
  ["Caixa", "41 mm, ouro amarelo 18k"],
  ["Luneta", "Canelada, polida à mão"],
  ["Calibre", "IMX·10, automático, tourbillon voador"],
  ["Componentes", "412"],
  ["Reserva de marcha", "72 horas"],
  ["Frequência", "4 Hz · 28 800 alternâncias por hora"],
  ["Vidro", "Safira com lupa sobre a data"],
  ["Fundo", "Safira, rotor em ouro gravado"],
  ["Bracelete", "Três elos em ouro 18k"],
  ["Estanqueidade", "100 metros"],
  ["Edição", "Limitada a 10 peças numeradas"],
];

export function Specs() {
  return (
    <section id="especificacoes" className="specs wrap" aria-label="Ficha técnica">
      <div className="specs__head">
        <Label n="05">Ficha técnica</Label>
        <CutTitle className="title-2 mt-8">Nada sobra. Nada falta.</CutTitle>
        <Emblem size={140} animated className="specs__emblem" />
      </div>
      <dl className="specs__list">
        {SPECS.map(([k, v], i) => (
          <motion.div
            key={k}
            className="specs__row"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.9, delay: (i % 4) * 0.06, ease: EASE }}
          >
            <dt className="t-label">{k}</dt>
            <dd>{v}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}

/* ───────── 06 · reserva com 10X em partículas de ouro (21st · Interactive Text Particle) ───────── */
function Magnetic({ children, href }: { children: ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      ref={ref}
      href={href}
      className="magnet"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setP({ x: (e.clientX - (r.left + r.width / 2)) * 0.35, y: (e.clientY - (r.top + r.height / 2)) * 0.35 });
      }}
      onMouseLeave={() => setP({ x: 0, y: 0 })}
      animate={{ x: p.x, y: p.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.3 }}
    >
      <motion.span animate={{ x: p.x * 0.4, y: p.y * 0.4 }} transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.3 }}>
        {children}
      </motion.span>
    </motion.a>
  );
}

export function Reserva() {
  const [font, setFont] = useState<string | null>(null);
  useEffect(() => {
    const f = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
    document.fonts.ready.then(() => setFont(f || "serif"));
  }, []);
  return (
    <section id="reservar" className="cta" aria-label="Reservar">
      <div className="cta__particles" aria-hidden>
        <LazyMount className="h-full w-full">
          {font ? (
            <ParticleTextEffect key={font} text="10X" fontFamily={font} fontWeight={500} colors={["f6ecd6", "e7c983", "c99a4c", "a8874c", "8a6a2f"]} animationForce={70} particleDensity={3} />
          ) : null}
        </LazyMount>
      </div>
      <div className="cta__in wrap">
        <Label n="06">Reserva</Label>
        <CutTitle className="title-2 mt-8 text-center">Dez peças no mundo.</CutTitle>
        <p className="cta__p">Passe o rato pelo ouro. Cada IMERSÃO 10X é numerado e entregue em mão, no atelier.</p>
        <Magnetic href="#reservar">Pedir reserva</Magnetic>
      </div>
    </section>
  );
}

/* ───────── rodapé em meio-tom dourado (21st · Halftone Wordmark Footer) ───────── */
export function Footer() {
  const [fonts, setFonts] = useState<{ d: string; m: string } | null>(null);
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    document.fonts.ready.then(() => setFonts({ d: cs.getPropertyValue("--font-display").trim(), m: cs.getPropertyValue("--font-mono").trim() }));
  }, []);
  return (
    <footer className="foot3">
      <LazyMount margin="600px">
        {fonts ? (
          <HalftoneWordmarkFooter
            wordmark="imersão"
            label="IMERSÃO 10X"
            meta="Marca fictícia · 2026"
            columns={[
              { title: "Calibre", links: [{ label: "IMX·10" }, { label: "Tourbillon voador" }, { label: "72 h de reserva" }] },
              { title: "Site", links: [{ label: "Manifesto", href: "#manifesto" }, { label: "Matéria", href: "#materia" }, { label: "Ficha técnica", href: "#especificacoes" }] },
              { title: "Edição", links: [{ label: "10 peças numeradas" }, { label: "Entrega no atelier" }] },
            ]}
            palette={{ background: "#080706", ink: "#d9b56a", warm: "#fff1cf" }}
            fontFamily={fonts.d}
            fontWeight={500}
            monoFamily={fonts.m}
            grain={0.35}
            dotGap={6}
            height="100vh"
          />
        ) : null}
      </LazyMount>
    </footer>
  );
}
