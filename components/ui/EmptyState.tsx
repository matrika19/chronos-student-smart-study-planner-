export function EmptyState({
  title,
  body,
  doodle = "weekend",
}: {
  title: string;
  body: string;
  doodle?: "weekend" | "empty" | "rain" | "error";
}) {
  return (
    <div className="border-[3px] border-dashed border-ink bg-paper p-6 text-center">
      <div className="mx-auto mb-3 h-24 w-40">{art(doodle)}</div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm opacity-80">{body}</p>
    </div>
  );
}

function art(kind: string) {
  if (kind === "rain") {
    return (
      <svg viewBox="0 0 160 96" aria-hidden>
        <rect x="1" y="1" width="158" height="94" fill="#CDE4F2" stroke="#121212" strokeWidth="3" />
        <path d="M20 20l8 18M40 12l8 18M70 18l8 18M100 10l8 18M130 22l8 18" stroke="#121212" strokeWidth="3" />
        <circle cx="80" cy="70" r="14" fill="#F9F6F0" stroke="#121212" strokeWidth="3" />
      </svg>
    );
  }
  if (kind === "error") {
    return (
      <svg viewBox="0 0 160 96" aria-hidden>
        <rect x="1" y="1" width="158" height="94" fill="#F7D3C1" stroke="#121212" strokeWidth="3" />
        <path d="M50 30h60v40H50z" fill="#F9F6F0" stroke="#121212" strokeWidth="3" />
        <path d="M70 44l20 20M90 44L70 64" stroke="#E8553D" strokeWidth="4" />
      </svg>
    );
  }
  if (kind === "empty") {
    return (
      <svg viewBox="0 0 160 96" aria-hidden>
        <rect x="1" y="1" width="158" height="94" fill="#F6E7A1" stroke="#121212" strokeWidth="3" />
        <path d="M30 70h100M40 50h20M70 40h30" stroke="#121212" strokeWidth="3" />
        <circle cx="120" cy="36" r="10" fill="#F9F6F0" stroke="#121212" strokeWidth="3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 96" aria-hidden>
      <rect x="1" y="1" width="158" height="94" fill="#CFE3C8" stroke="#121212" strokeWidth="3" />
      <path d="M20 70c20-30 40-30 60 0s40 30 60 0" fill="none" stroke="#121212" strokeWidth="3" />
      <circle cx="50" cy="36" r="10" fill="#F6E7A1" stroke="#121212" strokeWidth="3" />
      <text x="78" y="40" fontSize="12" fontFamily="sans-serif">
        Sat/Sun
      </text>
    </svg>
  );
}
