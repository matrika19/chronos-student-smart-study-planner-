"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={reduce ? false : { rotateY: -12, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={reduce ? undefined : { rotateY: 12, opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{ transformOrigin: "left center", perspective: 800 }}
      >
        {!reduce ? (
          <motion.div
            className="pointer-events-none fixed inset-y-0 left-0 z-30 w-full origin-left bg-butter"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 0.35 }}
          />
        ) : null}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
