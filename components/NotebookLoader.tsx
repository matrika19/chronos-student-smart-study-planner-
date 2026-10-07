"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ProgressBar } from "./ui/ProgressBar";

const LINES = ["sharpening pencils...", "stapling timetable...", "87%"];

export function NotebookLoader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(0);
  const [pct, setPct] = useState(12);

  useEffect(() => {
    const t = window.setTimeout(onDone, reduce ? 400 : 2200);
    const i = window.setInterval(() => setLine((n) => (n + 1) % LINES.length), 500);
    const p = window.setInterval(() => setPct((n) => Math.min(100, n + 8)), 160);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(i);
      window.clearInterval(p);
    };
  }, [onDone, reduce]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-paper">
      <div className="relative h-[280px] w-[min(92vw,420px)]" style={{ perspective: 900 }}>
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 origin-right border-[3px] border-ink bg-ruled"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: reduce ? 0 : -70 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 origin-left border-[3px] border-ink bg-ruled"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: reduce ? 0 : 70 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <p className="font-display text-3xl font-bold tracking-tighter">Chronos & Canvas</p>
          <p className="mt-2 font-display text-sm italic">{LINES[line]}</p>
          <div className="mt-4 w-48">
            <ProgressBar value={pct} />
          </div>
        </div>
      </div>
    </div>
  );
}
