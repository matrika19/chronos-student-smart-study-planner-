"use client";

import { useEffect, useState } from "react";

type ToastItem = { id: number; message: string; tone: "ink" | "tomato" | "sage" };

let push: ((t: Omit<ToastItem, "id">) => void) | null = null;

export function toast(message: string, tone: ToastItem["tone"] = "ink"): void {
  push?.({ message, tone });
}

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    push = (t) => {
      const id = Date.now();
      setItems((prev) => [...prev, { ...t, id }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id));
      }, 3200);
    };
    return () => {
      push = null;
    };
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-20 right-3 z-[95] flex flex-col gap-2 md:bottom-4" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto border-[3px] border-ink px-3 py-2 font-display text-sm font-bold shadow-brutal ${
            t.tone === "tomato" ? "bg-tomato text-paper" : t.tone === "sage" ? "bg-sage text-ink" : "bg-ink text-paper"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
