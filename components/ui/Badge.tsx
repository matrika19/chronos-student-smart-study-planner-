import { cn } from "@/lib/cn";
import type { BunkStatus } from "@/lib/types";

export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: React.ReactNode;
  tone?: "ink" | "sage" | "tomato" | "butter";
  className?: string;
}) {
  const map = {
    ink: "bg-ink text-paper",
    sage: "bg-sage text-ink",
    tomato: "bg-tomato text-paper",
    butter: "bg-butter text-ink",
  };
  return (
    <span
      className={cn(
        "inline-flex border-2 border-ink px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wide",
        map[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: BunkStatus }) {
  const tone = status === "SAFE" ? "sage" : status === "EDGE" ? "butter" : "tomato";
  return <Badge tone={tone}>{status}</Badge>;
}
