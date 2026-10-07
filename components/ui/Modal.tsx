"use client";

import { useEffect } from "react";
import { BrutalButton } from "./BrutalButton";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/40 p-3 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg border-[3px] border-ink bg-paper p-4 shadow-brutal"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="modal-title" className="font-display text-xl font-bold tracking-tight">
            {title}
          </h2>
          <BrutalButton variant="paper" onClick={onClose} aria-label="Close">
            Close
          </BrutalButton>
        </div>
        {children}
      </div>
    </div>
  );
}
