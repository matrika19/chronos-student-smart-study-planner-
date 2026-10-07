import { cn, paperTilt, tapeKind } from "@/lib/cn";

type Props = {
  id: string;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
};

export function PaperCard({ id, children, className, padded = true }: Props) {
  const tilt = paperTilt(id);
  const tape = tapeKind(id);
  return (
    <div
      className={cn(
        "relative border-[3px] border-ink bg-paper shadow-brutal",
        padded && "p-4",
        tape === "washi" && "washi",
        tape === "fold" && "fold-corner",
        className
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </div>
  );
}
