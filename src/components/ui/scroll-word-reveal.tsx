"use client"

/* Scroll Word Reveal · 21st.dev (@motiondotdev/motion-scroll-word-reveal), adaptado: scroll da janela, texto por props, destaque em itálico */

import { Fragment, useRef, type ReactNode } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

const REST_OPACITY = 0.12
const REVEAL_SPAN = 0.8
const WORD_WINDOW = 0.2

function getWordRange(index: number, count: number) {
  const start = count <= 1 ? 0 : (index / (count - 1)) * REVEAL_SPAN
  return { start, end: Math.min(1, start + WORD_WINDOW) }
}

export function getWordOpacity(
  progress: number,
  { start, end }: { start: number; end: number },
  rest = REST_OPACITY,
) {
  if (progress <= start) return rest
  if (progress >= end) return 1
  const t = (progress - start) / (end - start)
  return rest + (1 - rest) * t
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
  accent,
}: {
  children: string
  progress: MotionValue<number>
  index: number
  count: number
  reducedMotion: boolean
  accent: boolean
}) {
  const range = getWordRange(index, count)
  const opacity = useTransform(progress, (value) => getWordOpacity(value, range))
  const blur = useTransform(progress, (value) => `blur(${(1 - getWordOpacity(value, range, 0)) * 6}px)`)

  return (
    <motion.span
      aria-hidden="true"
      className={accent ? "t-accent text-[color:var(--gold)]" : undefined}
      style={reducedMotion ? undefined : { opacity, filter: blur }}
    >
      {children}
    </motion.span>
  )
}

export function ScrollWordReveal({
  text,
  accentWords = [],
  kicker,
  footer,
}: {
  text: string
  accentWords?: string[]
  kicker?: ReactNode
  footer?: ReactNode
}) {
  const targetRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })
  const words = text.split(" ")
  const accents = new Set(accentWords.map((w) => w.toLowerCase()))

  return (
    <section ref={targetRef} className="relative h-[260vh]" aria-label={text}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="wrap grid w-full grid-cols-12 gap-x-6">
          <div className="col-span-12 mb-10 flex items-center gap-4 md:col-span-2 md:mb-0 md:flex-col md:items-start">
            {kicker}
            <div className="relative hidden h-40 w-px overflow-hidden bg-[color:var(--line)] md:block" aria-hidden="true">
              <motion.span
                className="absolute inset-x-0 top-0 h-full origin-top bg-[color:var(--gold)]"
                style={{ scaleY: reducedMotion ? 1 : scrollYProgress }}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <p className="manifesto">
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <Word
                    progress={scrollYProgress}
                    index={index}
                    count={words.length}
                    reducedMotion={!!reducedMotion}
                    accent={accents.has(word.toLowerCase().replace(/[.,:]/g, ""))}
                  >
                    {word}
                  </Word>
                  {index < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
            {footer}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScrollWordReveal
