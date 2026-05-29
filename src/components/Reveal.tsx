"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal-on-scroll wrapper. Adds `.is-visible` once the element enters the
 * viewport (one-shot), letting globals.css fade + lift it in. Falls back to
 * visible immediately under reduced-motion (handled in CSS).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${seen ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
