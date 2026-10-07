"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduce) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      let tx = e.clientX;
      let ty = e.clientY;
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const mag = el?.closest("button, a, input, textarea, [data-cursor]") as HTMLElement | null;
      if (mag) {
        const r = mag.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
      }
      x.set(tx);
      y.set(ty);
      if (!el) {
        setLabel("");
        return;
      }
      if (el.closest("input, textarea")) setLabel("pen");
      else if (el.closest("[data-cursor='grab']")) setLabel("grab");
      else if (el.closest("a")) setLabel("view");
      else if (el.closest("button")) setLabel("stamp");
      else setLabel("");
    };
    window.addEventListener("pointermove", move);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
    };
  }, [reduce, x, y]);

  if (!on) return null;
  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[120] h-2 w-2 rounded-full bg-ink"
        style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      />
      <motion.div
        className="pointer-events-none fixed z-[120] flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink bg-paper/80 font-display text-[9px] font-bold uppercase"
        style={{ left: sx, top: sy, x: "-50%", y: "-50%" }}
      >
        {label}
      </motion.div>
    </>
  );
}
