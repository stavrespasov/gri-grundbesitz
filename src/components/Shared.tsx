import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function Wordmark(): ReactNode {
  return (
    <span className="wordmark">
      <span className="wordmark-name">
        GRI<span className="wordmark-point">.</span>
      </span>
      <span className="wordmark-descriptor">GRUNDBESITZ</span>
    </span>
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
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
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
      <ArrowUpRight size={19} strokeWidth={1.6} />
    </button>
  );
}

export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="section-label">
      <span>{number.padStart(2, "0")}</span>
      <span className="section-label-line" />
      <span>{children}</span>
    </div>
  );
}
