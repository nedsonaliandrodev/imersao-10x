"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const anchors = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { duration: 2.2 });
    };
    document.addEventListener("click", anchors);

    /* ?ver=<id>&off=<ecrãs> abre a página já numa secção (útil para rever e para links diretos) */
    const q = new URLSearchParams(location.search);
    const ver = q.get("ver");
    if (ver) {
      setTimeout(() => {
        const el = document.getElementById(ver);
        if (el) lenis.scrollTo(el.getBoundingClientRect().top + window.scrollY + Number(q.get("off") || 0) * window.innerHeight, { immediate: true });
      }, 1200);
    }

    return () => {
      document.removeEventListener("click", anchors);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
