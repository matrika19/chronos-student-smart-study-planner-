"use client";

import { cn } from "@/lib/cn";

type Props = {
  pressed: boolean;
  onPressed: (next: boolean) => void;
  label: string;
  disabled?: boolean;
};

export function Toggle({ pressed, onPressed, label, disabled }: Props) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      disabled={disabled}
      onClick={() => onPressed(!pressed)}
      className={cn(
        "brutal-hover border-[3px] border-ink px-2 py-1 font-display text-xs font-bold shadow-brutal",
        pressed ? "bg-sage-dark text-paper" : "bg-paper text-ink",
        disabled && "opacity-40"
      )}
    >
      {label}
    </button>
  );
}
