"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ScrollWordReveal } from "@/components/ui/scroll-word-reveal";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import HorizontalScroll, { type HPanel } from "@/components/ui/horizontal-scroll";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { asset } from "@/lib/asset";

/* ───────── título de secção que se corta ao entrar ───────── */
function CutTitle({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <h2 ref={ref} className={`title-2 ${className}`} aria-label={children}>
      <VerticalCutReveal
        key={inView ? "on" : "off"}
        autoStart={inView}
        splitBy="words"
        staggerDuration={0.08}
        transition={{ type: "spring", stiffness: 150, damping: 26 }}
      >
        {children}
      </VerticalCutReveal>
    </h2>
  );
}

function Label({ n, children }: { n: string; children: ReactNode }) {
  return (
    <span className="t-label flex items-center gap-3">
      <b className="font-normal text-[color:var(--gold)]">{n}</b>
      <i className="h-px w-8 bg-[color:var(--line)]" />
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
      <a href="#topo" className="nav__mark">Imersão <i className="t-accent">10X</i></a>
      <nav className="nav__links t-label" aria-label="Secções">
        <a href="#manifesto">Manifesto</a>
        <a href="#calibre">Calibre</a>
        <a href="#pulso">No pulso</a>
        <a href="#especificacoes">Especificações</a>
      </nav>
      <a className="nav__cta" href="#reservar">Reservar</a>
    </header>
  );
}

/* ───────── manifesto ───────── */
export function Manifesto() {
  return (
    <div id="manifesto">
      <ScrollWordReveal
        kicker={<Label n="01">Manifesto</Label>}
        text="Um relógio não se usa. Habita-se. Quatrocentas e doze peças trabalham em silêncio para que cada segundo seu valha mais do que o anterior."
        accentWords={["habita-se", "silêncio"]}
      />
    </div>
  );
}

/* ───────── números ───────── */
function Count({ to, sep = false }: { to: number; sep?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 2200;
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
  { v: 412, unit: "", label: "Componentes num só calibre" },
  { v: 72, unit: "h", label: "De reserva de marcha" },
  { v: 28800, unit: "", label: "Alternâncias por hora", sep: true },
  { v: 10, unit: "", label: "Peças no mundo" },
];

export function Numbers() {
  return (
    <section className="numbers wrap" aria-label="O calibre em números">
      {NUMBERS.map((n, i) => (
        <motion.div
          key={n.label}
          className="numbers__item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.2, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <b className="numbers__v">
            <Count to={n.v} sep={n.sep} />
            {n.unit ? <small className="t-accent">{n.unit}</small> : null}
          </b>
          <span className="t-label">{n.label}</span>
        </motion.div>
      ))}
    </section>
  );
}

/* ───────── anatomia: detalhes a flutuar com o rato ───────── */
export function Anatomia() {
  return (
    <section id="calibre" className="anat" aria-label="Anatomia do calibre">
      <Floating sensitivity={-0.6} className="anat__float">
        <FloatingElement depth={0.6} className="left-[4%] top-[10%]">
          <img src={asset("/img/tourbillon.webp")} alt="" loading="lazy" className="anat__img w-[22vw] aspect-[4/5]" />
        </FloatingElement>
        <FloatingElement depth={1.4} className="right-[6%] top-[6%]">
          <img src={asset("/img/engrenagens.webp")} alt="" loading="lazy" className="anat__img w-[16vw] aspect-square" />
        </FloatingElement>
        <FloatingElement depth={2.2} className="left-[14%] bottom-[8%]">
          <img src={asset("/img/mostrador.webp")} alt="" loading="lazy" className="anat__img w-[13vw] aspect-[3/4]" />
        </FloatingElement>
        <FloatingElement depth={1} className="right-[10%] bottom-[10%]">
          <img src={asset("/img/explodida.webp")} alt="" loading="lazy" className="anat__img w-[24vw] aspect-[16/10]" />
        </FloatingElement>
      </Floating>

      <div className="anat__copy">
        <Label n="02">Anatomia</Label>
        <CutTitle className="mt-8">Cada peça conta.</CutTitle>
        <div className="anat__p">
          <TextBlockAnimation blockColor="#b89a5e" stagger={0.12} duration={0.7}>
            <p>
              Pontes esqueletizadas em ródio preto, bordas polidas à mão e rubis que reduzem o atrito a quase nada.
              Por baixo do mostrador há uma cidade inteira a trabalhar.
            </p>
          </TextBlockAnimation>
        </div>
      </div>
    </section>
  );
}

/* ───────── galeria horizontal ───────── */
const PANELS: HPanel[] = [
  { n: "01", word: "Luz", title: "O mostrador", text: "Sunburst preto e índices aplicados em ouro. Muda a cada inclinação do pulso.", src: asset("/img/mostrador.webp") },
  { n: "02", word: "Máquina", title: "O mecanismo", text: "Rodas em camadas, acabadas à mão com côtes de Genève e perlage.", src: asset("/img/engrenagens.webp") },
  { n: "03", word: "Coração", title: "O tourbillon", text: "Uma gaiola voadora dá uma volta por minuto para anular a gravidade.", src: asset("/img/tourbillon.webp") },
  { n: "04", word: "Anatomia", title: "A vista explodida", text: "412 componentes alinhados num só eixo. Nenhum está ali por acaso.", src: asset("/img/explodida.webp") },
  { n: "05", word: "Gesto", title: "A montagem", text: "Semanas de afinação até ao último parafuso azulado.", src: asset("/img/montado.webp") },
];

export function Galeria() {
  return (
    <div className="gal">
      <div className="wrap gal__intro">
        <Label n="03">O calibre, capítulo a capítulo</Label>
      </div>
      <HorizontalScroll panels={PANELS} />
    </div>
  );
}

/* ───────── no pulso ───────── */
export function NoPulso() {
  return (
    <section id="pulso" aria-label="No pulso">
      <ZoomParallax
        height="h-[320vh]"
        images={[
          { src: asset("/img/pulso.webp"), alt: "O IMERSÃO 10X no pulso, num terraço ao pôr do sol" },
          { src: asset("/img/pordosol.webp") },
          { src: asset("/img/tourbillon.webp") },
          { src: asset("/img/mostrador.webp") },
          { src: asset("/img/engrenagens.webp") },
          { src: asset("/img/montado.webp") },
          { src: asset("/img/explodida.webp") },
        ]}
      >
        <div className="pulso__cap wrap">
          <Label n="04">No pulso</Label>
          <p className="title-1 mt-6">
            Feito para <em className="t-accent">ser vivido.</em>
          </p>
        </div>
      </ZoomParallax>
    </section>
  );
}

/* ───────── especificações ───────── */
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
    <section id="especificacoes" className="specs wrap" aria-label="Especificações">
      <div className="specs__head">
        <Label n="05">Especificações</Label>
        <CutTitle className="mt-8">A ficha técnica.</CutTitle>
      </div>
      <dl className="specs__list">
        {SPECS.map(([k, v], i) => (
          <motion.div
            key={k}
            className="specs__row"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.9, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <dt className="t-label">{k}</dt>
            <dd>{v}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}

/* ───────── reserva com botão magnético ───────── */
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
  return (
    <section id="reservar" className="cta" aria-label="Reservar">
      <img src={asset("/img/montado.webp")} alt="" loading="lazy" className="cta__bg" />
      <div className="cta__veil" />
      <div className="cta__in wrap">
        <Label n="06">Reserva</Label>
        <CutTitle className="mt-8 text-center">Dez peças. Uma pode ser sua.</CutTitle>
        <p className="cta__p">Cada IMERSÃO 10X é numerado e entregue em mão, no atelier.</p>
        <Magnetic href="#reservar">Pedir reserva</Magnetic>
      </div>
    </section>
  );
}

/* ───────── rodapé ───────── */
export function Footer() {
  return (
    <footer className="foot2">
      <div className="wrap foot2__grid">
        <div>
          <span className="t-label">Calibre</span>
          <p>IMX·10 · Tourbillon voador</p>
        </div>
        <div>
          <span className="t-label">Matéria</span>
          <p>Ouro amarelo 18k</p>
        </div>
        <div>
          <span className="t-label">Edição</span>
          <p>10 peças numeradas</p>
        </div>
        <div className="foot2__nav t-label">
          <a href="#manifesto">Manifesto</a>
          <a href="#calibre">Calibre</a>
          <a href="#pulso">No pulso</a>
          <a href="#topo">Voltar ao topo</a>
        </div>
      </div>
      <motion.p
        className="foot2__mark"
        initial={{ y: "40%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      >
        Imersão <i className="t-accent">10X</i>
      </motion.p>
      <p className="wrap foot2__legal t-label">Marca fictícia criada para demonstração · 2026</p>
    </footer>
  );
}
