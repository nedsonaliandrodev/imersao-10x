"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* monta efeitos WebGL só quando a secção se aproxima do ecrã, e desmonta quando sai (poupa GPU e bateria) */
export default function LazyMount({ children, className = "", margin = "300px" }: { children: ReactNode; className?: string; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return (
    <div ref={ref} className={className}>
      {on ? children : null}
    </div>
  );
}
