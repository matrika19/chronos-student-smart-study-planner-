import type {
  AttendanceLog,
  BunkResult,
  BunkStatus,
  FocusSession,
  GradeBand,
  Marks,
  ReverseResult,
  ReverseSubject,
  Subject,
} from "./types";
import { parseKey, todayKey } from "./dates";

export function attendancePct(attended: number, total: number): number {
  if (total <= 0) return 100;
  return (attended / total) * 100;
}

export function bunkStatus(pct: number, thresholdPct: number): BunkStatus {
  if (pct >= thresholdPct + 5) return "SAFE";
  if (pct >= thresholdPct) return "EDGE";
  return "DANGER";
}

export function bunkBank(
  attended: number,
  total: number,
  T: number,
  subjectName = "this subject"
): BunkResult {
  const thresholdPct = T * 100;
  const pct = attendancePct(attended, total);
  const safeSkips =
    T <= 0 ? Math.max(0, 999) : Math.max(0, Math.floor(attended / T - total));
  let mustAttend = 0;
  if (T >= 1) {
    mustAttend = pct >= 100 ? 0 : Number.POSITIVE_INFINITY;
  } else if (T <= 0) {
    mustAttend = 0;
  } else {
    mustAttend = Math.max(0, Math.ceil((T * total - attended) / (1 - T)));
  }
  const status = bunkStatus(pct, thresholdPct);
  return {
    attended,
    total,
    pct,
    safeSkips: Number.isFinite(safeSkips) ? safeSkips : 0,
    mustAttend: Number.isFinite(mustAttend) ? mustAttend : 99,
    status,
    sentence: bunkSentence(subjectName, status, safeSkips, mustAttend),
  };
}

export function bunkSentence(
  name: string,
  status: BunkStatus,
  safeSkips: number,
  mustAttend: number
): string {
  if (status === "SAFE") {
    const n = Number.isFinite(safeSkips) ? safeSkips : 0;
    return n === 0
      ? `${name} is safe, but do not bunk the next class`
      : `You can bunk ${n} more ${name} class${n === 1 ? "" : "es"}`;
  }
  if (status === "EDGE") {
    return `${name} is on the edge — attend the next class to stay safe`;
  }
  const n = Number.isFinite(mustAttend) ? mustAttend : 0;
  return `Attend the next ${n} ${name} class${n === 1 ? "" : "es"} in a row to get back to safe`;
}

export function subjectTotal(marks: Marks | undefined): number {
  if (!marks) return 0;
  return (marks.ia1 ?? 0) + (marks.ia2 ?? 0) + (marks.see ?? 0);
}

export function iaSum(marks: Marks | undefined): number {
  if (!marks) return 0;
  return (marks.ia1 ?? 0) + (marks.ia2 ?? 0);
}

export function gradePoint(total: number, bands: GradeBand[]): number {
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  const hit = sorted.find((b) => total >= b.min);
  return hit?.gp ?? 0;
}

export function countAttendance(
  logs: AttendanceLog[],
  slotIds: string[]
): { attended: number; total: number } {
  const set = new Set(slotIds);
  let attended = 0;
  let total = 0;
  for (const log of logs) {
    if (!set.has(log.slotId)) continue;
    if (log.status === "cancelled") continue;
    total += 1;
    if (log.status === "attended") attended += 1;
  }
  return { attended, total };
}

export function reverseSolver(
  targetCgpa: number,
  subjects: Subject[],
  marks: Marks[],
  bands: GradeBand[]
): ReverseResult {
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  const wantGp = Math.ceil(targetCgpa);
  const targetBand =
    sorted.find((b) => b.gp >= wantGp) ?? sorted[sorted.length - 1];
  const markMap = new Map(marks.map((m) => [m.subjectId, m]));
  const rows: ReverseSubject[] = subjects.map((sub) => {
    const m = markMap.get(sub.id);
    const ia = iaSum(m);
    const requiredTotal = targetBand?.min ?? 0;
    const requiredSee = Math.max(0, requiredTotal - ia);
    const unreachable = requiredSee > 50;
    let suggestedGp: number | null = null;
    let suggestedSee: number | null = null;
    if (unreachable) {
      const reachable = [...sorted]
        .sort((a, b) => b.gp - a.gp)
        .find((b) => Math.max(0, b.min - ia) <= 50);
      if (reachable) {
        suggestedGp = reachable.gp;
        suggestedSee = Math.max(0, reachable.min - ia);
      }
    }
    const sentence = unreachable
      ? `${sub.name} cannot reach GP ${targetBand?.gp ?? wantGp} with current IA — best reachable is GP ${suggestedGp ?? 0} with ${suggestedSee ?? 0}/50 SEE`
      : `To hit ${wantGp}+ you need at least ${requiredSee}/50 in SEE for ${sub.name}`;
    return {
      subjectId: sub.id,
      name: sub.name,
      targetGp: targetBand?.gp ?? wantGp,
      requiredTotal,
      requiredSee,
      unreachable,
      suggestedGp,
      suggestedSee,
      sentence,
    };
  });

  let creditSum = 0;
  let weighted = 0;
  for (const sub of subjects) {
    const row = rows.find((r) => r.subjectId === sub.id);
    const m = markMap.get(sub.id);
    const see = unreachableSee(row, m);
    const total = iaSum(m) + see;
    const gp = gradePoint(total, bands);
    creditSum += sub.credits;
    weighted += gp * sub.credits;
  }
  const projectedSgpa = creditSum === 0 ? 0 : weighted / creditSum;
  const reachable = rows.every((r) => !r.unreachable) && projectedSgpa + 1e-9 >= targetCgpa;
  return { subjects: rows, projectedSgpa, reachable };
}

function unreachableSee(row: ReverseSubject | undefined, m: Marks | undefined): number {
  if (!row) return m?.see ?? 0;
  if (row.unreachable) return row.suggestedSee ?? 50;
  return Math.min(50, row.requiredSee);
}

export function computeStreak(
  logs: AttendanceLog[],
  sessions: FocusSession[],
  today = todayKey()
): number {
  const active = new Set<string>();
  for (const log of logs) {
    if (log.status === "attended") active.add(log.date);
  }
  for (const s of sessions) {
    if (s.minutes > 0) active.add(s.date);
  }
  const t = parseKey(today);
  const y = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1);
  const yKey = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
  let start = today;
  if (!active.has(today)) {
    if (!active.has(yKey)) return 0;
    start = yKey;
  }
  let count = 0;
  let cursor = parseKey(start);
  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (!active.has(key)) break;
    count += 1;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }
  return count;
}

export function daysUntil(date: string, from = todayKey()): number {
  const a = parseKey(from);
  const b = parseKey(date);
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86400000);
}

export function projectedSgpa(
  subjects: Subject[],
  marks: Marks[],
  bands: GradeBand[]
): number {
  let c = 0;
  let w = 0;
  const map = new Map(marks.map((m) => [m.subjectId, m]));
  for (const s of subjects) {
    const gp = gradePoint(subjectTotal(map.get(s.id)), bands);
    c += s.credits;
    w += gp * s.credits;
  }
  return c === 0 ? 0 : w / c;
}
