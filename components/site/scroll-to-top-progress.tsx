"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const REVEAL_OFFSET = 140;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function scrollToTop() {
  if (prefersReducedMotion()) {
    window.scrollTo({ top: 0 });
    return;
  }

  const startY = window.scrollY;
  const duration = Math.min(900, Math.max(420, startY * 0.45));
  const startTime = performance.now();

  const tick = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = clamp(elapsed / duration);
    const nextY = startY * (1 - easeOutCubic(progress));

    window.scrollTo(0, nextY);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

export function ScrollToTopProgress() {
  const frameRef = useRef<number | null>(null);
  const [scrollState, setScrollState] = useState({ progress: 0, isVisible: false });

  useEffect(() => {
    const update = () => {
      frameRef.current = null;

      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableDistance > 0 ? clamp(window.scrollY / scrollableDistance) : 0;
      const isVisible = window.scrollY > REVEAL_OFFSET;

      setScrollState((current) => {
        if (Math.abs(current.progress - progress) < 0.002 && current.isVisible === isVisible) {
          return current;
        }

        return { progress, isVisible };
      });
    };

    const requestUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const strokeOffset = CIRCUMFERENCE * (1 - scrollState.progress);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={scrollToTop}
      className={[
        "fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border border-white/70 bg-white/80 text-slate-900 shadow-card backdrop-blur-xl",
        "transition-[opacity,transform,background-color,border-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-glow active:translate-y-0 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50",
        "motion-reduce:transition-none sm:bottom-6 sm:right-6 sm:h-16 sm:w-16",
        scrollState.isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 52 52"
        aria-hidden="true"
      >
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="rgba(148, 163, 184, 0.28)"
          strokeWidth="2.5"
        />
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="rgb(37, 99, 235)"
          strokeLinecap="round"
          strokeWidth="2.5"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
          className="transition-[stroke-dashoffset] duration-100 ease-linear motion-reduce:transition-none"
        />
      </svg>
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white shadow-sm sm:h-9 sm:w-9">
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );
}
