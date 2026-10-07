"use client";

import { QUOTES } from "@/lib/quotes";
import {
  useExamDates,
  useFocusSessions,
  useHydrated,
  useLogs,
  useSettings,
  useSlots,
  useSubjects,
} from "@/lib/repo";
import { bunkBank, computeStreak, countAttendance, daysUntil } from "@/lib/engine";

export function Ticker() {
  const hydrated = useHydrated();
  const logs = useLogs();
  const sessions = useFocusSessions();
  const exams = useExamDates();
  const slots = useSlots();
  const subjects = useSubjects();
  const settings = useSettings();

  if (!hydrated) {
    return <div className="h-9 border-b-[3px] border-ink bg-charcoal" />;
  }

  const streak = computeStreak(logs, sessions);
  const next = [...exams].sort((a, b) => a.date.localeCompare(b.date))[0];
  const classSlots = slots.filter((s) => s.kind !== "break" && s.subjectId);
  const counted = countAttendance(
    logs,
    classSlots.map((s) => s.id)
  );
  const overall = bunkBank(
    counted.attended,
    counted.total,
    settings.attendanceThreshold / 100,
    "overall"
  );
  const bits = [
    `streak ${streak}d`,
    next ? `${daysUntil(next.date)}d to ${next.label}` : "no exams pinned",
    `attendance ${Math.round(overall.pct)}%`,
    `${subjects.length} papers on the desk`,
    ...QUOTES,
  ];
  const line = bits.join("  ·  ");

  return (
    <div className="overflow-hidden border-b-[3px] border-ink bg-charcoal text-paper">
      <div className="marquee-track py-2 font-display text-xs font-bold uppercase tracking-wide">
        <span className="px-6">{line}</span>
        <span className="px-6">{line}</span>
      </div>
    </div>
  );
}
