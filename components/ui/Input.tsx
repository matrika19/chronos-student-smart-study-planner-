import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className, id, ...rest }: Props) {
  const fid = id ?? rest.name ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="block font-body text-sm" htmlFor={fid}>
      <span className="mb-1 block font-display text-xs font-bold uppercase">{label}</span>
      <input
        id={fid}
        className={cn(
          "w-full border-[3px] border-ink bg-paper px-3 py-2 font-body tabular outline-none",
          className
        )}
        {...rest}
      />
    </label>
  );
}
