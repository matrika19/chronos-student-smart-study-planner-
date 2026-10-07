export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function localKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayKey(now = new Date()): string {
  return localKey(now);
}

export function parseKey(key: string): Date {
  const [y, m, day] = key.split("-").map(Number);
  return new Date(y, (m || 1) - 1, day || 1);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}

export function jsToGridDay(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function gridDayOf(d: Date): number {
  return jsToGridDay(d.getDay());
}

export function formatPretty(key: string): string {
  const d = parseKey(key);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function weekdayName(day: number): string {
  return ["Mon", "Tue", "Wed", "Thu", "Fri"][day] ?? "Day";
}

export function nextMonday(from = new Date()): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const gd = gridDayOf(d);
  if (gd <= 4) return d;
  const add = gd === 5 ? 2 : 1;
  return addDays(d, add);
}

export function classDateContext(now = new Date()): {
  date: Date;
  key: string;
  day: number;
  weekend: boolean;
} {
  const gd = gridDayOf(now);
  if (gd > 4) {
    const monday = nextMonday(now);
    return { date: monday, key: localKey(monday), day: 0, weekend: true };
  }
  return { date: now, key: localKey(now), day: gd, weekend: false };
}

export function mondayOf(key: string): string {
  const d = parseKey(key);
  const gd = gridDayOf(d);
  return localKey(addDays(d, -Math.min(gd, 6)));
}

export function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}
