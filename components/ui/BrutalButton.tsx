"use client";

import { cn } from "@/lib/cn";
import { motion, useReducedMotion } from "framer-motion";

type Variant = "ink" | "paper" | "tomato" | "sage";

const STYLES: Record<Variant, string> = {
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
  tomato: "bg-tomato text-paper",
  sage: "bg-sage-dark text-paper",
};

type Props = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
};

export function BrutalButton({
  variant = "ink",
  className,
  children,
  disabled,
  onClick,
  type = "button",
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      whileTap={reduce || disabled ? undefined : { scale: 0.96 }}
      className={cn(
        "brutal-hover inline-flex items-center justify-center gap-2 border-[3px] border-ink px-3 py-2 font-display text-sm font-bold tracking-tight shadow-brutal disabled:opacity-50",
        STYLES[variant],
        className
      )}
      disabled={disabled}
      onClick={onClick}
      aria-label={rest["aria-label"]}
    >
      {children}
    </motion.button>
  );
}
