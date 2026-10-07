"use client";

import { cn, paperTilt } from "@/lib/cn";
import type { SubjectColor } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";

const BG: Record<SubjectColor, string> = {
  sage: "bg-sage",
  butter: "bg-butter",
  lavender: "bg-lavender",
  peach: "bg-peach",
  sky: "bg-sky",
};

type Props = {
  id: string;
  color?: SubjectColor;
  children: React.ReactNode;
  className?: string;
};

export function StickyNote({ id, color = "butter", children, className }: Props) {
  const reduce = useReducedMotion();
  const tilt = paperTilt(id);
  return (
    <motion.div
      className={cn(
        "relative border-[3px] border-ink p-3 shadow-brutal",
        BG[color],
        className
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
      whileHover={reduce ? undefined : { y: -6, rotate: tilt, boxShadow: "6px 6px 0 #121212" }}
    >
      {children}
    </motion.div>
  );
}
