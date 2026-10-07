export function SkeletonDesk() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {["a", "b", "c", "d"].map((id) => (
        <div key={id} className="h-28 animate-pulse border-[3px] border-ink bg-paper shadow-brutal" />
      ))}
    </div>
  );
}
