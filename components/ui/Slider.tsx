"use client";

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 flex justify-between font-display text-xs font-bold uppercase">
        <span>{label}</span>
        <span className="tabular">{value}</span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink"
      />
    </label>
  );
}
