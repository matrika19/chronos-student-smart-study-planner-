"use client";

import { cn } from "@/lib/cn";

export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { id: T; label: string }[];
}) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={value === item.id}
          type="button"
          className={cn(
            "brutal-hover border-[3px] border-ink px-3 py-1.5 font-display text-sm font-bold shadow-brutal",
            value === item.id ? "bg-ink text-paper" : "bg-paper"
          )}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
