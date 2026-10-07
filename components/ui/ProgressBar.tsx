import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1 flex justify-between font-display text-xs font-bold">
          <span>{label}</span>
          <span className="tabular">{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div className="h-4 overflow-hidden border-[3px] border-ink bg-paper">
        <div
          className="h-full bg-ink"
          style={{
            width: `${pct}%`,
            backgroundImage:
              "repeating-linear-gradient(45deg, #121212 0 8px, #2a2a2a 8px 16px)",
          }}
        />
      </div>
    </div>
  );
}
