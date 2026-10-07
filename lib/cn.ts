export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function paperTilt(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 31) / 30) * 3 - 1.5;
}

export function tapeKind(id: string): "washi" | "fold" | "none" {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 17 + id.charCodeAt(i)) | 0;
  }
  const n = Math.abs(h) % 3;
  if (n === 0) return "washi";
  if (n === 1) return "fold";
  return "none";
}
