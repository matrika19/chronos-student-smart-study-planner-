"use client";

import { BrutalButton } from "@/components/ui/BrutalButton";
import { PaperCard } from "@/components/ui/PaperCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SkeletonDesk } from "@/components/ui/Skeleton";
import { Slider } from "@/components/ui/Slider";
import { StampCheck } from "@/components/ui/StampCheck";
import { StatusBadge } from "@/components/ui/Badge";
import { addDays, formatPretty, localKey, mondayOf, todayKey, weekdayName } from "@/lib/dates";
import { bunkBank, countAttendance } from "@/lib/engine";
import { repo, useHydrated, useLogs, useSettings, useSlots, useSubjects } from "@/lib/repo";
import { parseKey } from "@/lib/dates";
import { useState } from "react";

export default function AttendancePage() {
  const hydrated = useHydrated();
  const subjects = useSubjects();
  const slots = useSlots();
  const logs = useLogs();
  const settings = useSettings();
  const [week, setWeek] = useState(() => mondayOf(todayKey()));
  if (!hydrated) return <SkeletonDesk />;

  const T = settings.attendanceThreshold / 100;
  const today = todayKey();
  const days = [0, 1, 2, 3, 4].map((i) => localKey(addDays(parseKey(week), i)));

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold tracking-tighter">Roll call</h1>
      <div className="flex flex-wrap items-center gap-2">
        <BrutalButton variant="paper" onClick={() => setWeek(localKey(addDays(parseKey(week), -7)))}>
          Prev
        </BrutalButton>
        <BrutalButton variant="ink" onClick={() => setWeek(mondayOf(todayKey()))}>
          Today
        </BrutalButton>
        <BrutalButton variant="paper" onClick={() => setWeek(localKey(addDays(parseKey(week), 7)))}>
          Next
        </BrutalButton>
        <span className="font-display text-sm font-bold">Week of {formatPretty(week)}</span>
      </div>
      <Slider
        label="Attendance threshold %"
        min={50}
        max={90}
        value={settings.attendanceThreshold}
        onChange={(v) => repo.setSettings({ attendanceThreshold: v })}
      />

      {days.map((date, di) => {
        const daySlots = slots
          .filter((s) => s.day === di && s.kind !== "break")
          .sort((a, b) => a.start.localeCompare(b.start));
        const future = date > today;
        return (
          <PaperCard key={date} id={`att-${date}`}>
            <h2 className="mb-2 font-display font-bold">
              {weekdayName(di)} · {formatPretty(date)}
            </h2>
            <ul className="space-y-2">
              {daySlots.map((slot) => {
                const sub = subjects.find((s) => s.id === slot.subjectId);
                const log = logs.find((l) => l.slotId === slot.id && l.date === date);
                const attended = log?.status === "attended";
                return (
                  <li key={slot.id} className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={future}
                      aria-pressed={attended}
                      className="flex items-center gap-2 text-left disabled:opacity-40"
                      onClick={() =>
                        repo.setStatus(slot.id, date, attended ? "missed" : "attended")
                      }
                    >
                      <StampCheck checked={attended} />
                      <span>
                        <span className="font-display font-bold">{sub?.code ?? "—"}</span>
                        <span className="ml-2 text-xs tabular">
                          {slot.start} {slot.room}
                        </span>
                      </span>
                    </button>
                    <BrutalButton
                      variant="paper"
                      className="px-2 py-1 text-[10px]"
                      disabled={future}
                      onClick={() => repo.setStatus(slot.id, date, "cancelled")}
                    >
                      cancel
                    </BrutalButton>
                  </li>
                );
              })}
            </ul>
          </PaperCard>
        );
      })}

      <div className="grid gap-3 sm:grid-cols-2">
        {subjects.map((sub) => {
          const ids = slots.filter((s) => s.subjectId === sub.id).map((s) => s.id);
          const c = countAttendance(logs, ids);
          const bank = bunkBank(c.attended, c.total, T, sub.code);
          return (
            <PaperCard key={sub.id} id={`bar-${sub.id}`}>
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display font-bold">{sub.code}</p>
                <StatusBadge status={bank.status} />
              </div>
              <ProgressBar value={bank.pct} label={`${bank.attended}/${bank.total}`} />
              <p className="mt-2 text-xs">
                skip {bank.safeSkips} · must {bank.mustAttend}
              </p>
            </PaperCard>
          );
        })}
      </div>
    </div>
  );
}
