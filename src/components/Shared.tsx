import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function BrandMark({
  className = "",
}: {
  className?: string;
}): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 38 38"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 35V3h17v16H2m17 16V3h17v32M19 19h17"
        stroke="currentColor"
        strokeWidth="3.5"
      />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }): ReactNode {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M50 0 57 32 82 9 68 39 100 43 70 54 91 82 61 69 57 100 45 70 18 91 32 61 0 57 31 45 9 18 39 32Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}): ReactNode {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ActionButton({
  onClick,
  children,
  light = false,
  className = "",
}: {
  onClick: () => void;
  children: ReactNode;
  light?: boolean;
  className?: string;
}): ReactNode {
  return (
    <button
      className={`action-button ${light ? "is-light" : ""} ${className}`}
      onClick={onClick}
    >
      <span>{children}</span>
      <span className="action-icon">
        <ArrowUpRight size={21} strokeWidth={1.7} />
      </span>
    </button>
  );
}

export function SectionLabel({
  number,
  children,
  light = false,
}: {
  number: string;
  children: ReactNode;
  light?: boolean;
}): ReactNode {
  return (
    <div className={`section-label ${light ? "is-light" : ""}`}>
      <span className="label-dot" />
      <span>{children}</span>
      <span className="section-index">[ {number} ]</span>
    </div>
  );
}

export function ScrollPrompt({ target }: { target: string }): ReactNode {
  return (
    <a className="scroll-prompt" href={target}>
      <span className="scroll-arrow">
        <ArrowDown size={18} />
      </span>
      Weiter entdecken
    </a>
  );
}
