/* IMERSÃO 10X · emblema: luneta canelada com ponteiros às 10h10 (a hora da publicidade de relojoaria, o "10" de 10X) */

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i * 6 * Math.PI) / 180;
  const major = i % 5 === 0;
  const r1 = major ? 35.5 : 39;
  const r2 = 43;
  const f = (v: number) => Math.round(v * 1000) / 1000;
  return {
    x1: f(50 + r1 * Math.sin(a)),
    y1: f(50 - r1 * Math.cos(a)),
    x2: f(50 + r2 * Math.sin(a)),
    y2: f(50 - r2 * Math.cos(a)),
    major,
  };
});

export function Emblem({ size = 44, className = "", animated = false }: { size?: number; className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`emblem ${animated ? "emblem--anim" : ""} ${className}`} aria-hidden>
      <circle cx="50" cy="50" r="47.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      {TICKS.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth={t.major ? 1.6 : 0.6} strokeLinecap="round" opacity={t.major ? 1 : 0.7} />
      ))}
      <g className="emblem__h">
        <line x1="50" y1="50" x2="31.98" y2="37.37" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="emblem__m">
        <line x1="50" y1="50" x2="77.71" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <Emblem size={30} />
      <span className="logo__word">
        IMERSÃO <i>10X</i>
      </span>
    </span>
  );
}
