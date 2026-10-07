"use client";

export function StampCheck({ checked }: { checked: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <rect x="2" y="2" width="20" height="20" fill="#F9F6F0" stroke="#121212" strokeWidth="2.5" />
      {checked ? (
        <path
          d="M6 12.5l4 4 8-9"
          fill="none"
          stroke="#5E8C61"
          strokeWidth="2.8"
          pathLength={1}
          className="stamp-draw"
        />
      ) : null}
    </svg>
  );
}
