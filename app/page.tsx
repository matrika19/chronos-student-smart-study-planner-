"use client";

import { Flame } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaperCard } from "@/components/ui/PaperCard";
import { SkeletonDesk } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/Badge";
import { StickyNote } from "@/components/ui/StickyNote";
import { classDateContext, todayKey } from "@/lib/dates";
import { bunkBank, computeStreak, countAttendance, daysUntil } from "@/lib/engine";
import {
  repo,
  useExamDates,
  useFocusSessions,
  useHydrated,
  useLogs,
  useSettings,
  useSlots,
  useSubjects,
} from "@/lib/repo";
import type { AttendanceStatus, SubjectColor } from "@/lib/types";

export default function DashboardPage() {
  const hydrated = useHydrated();
  const subjects = useSubjects();
  const slots = useSlots();
  const logs = useLogs();
  const exams = useExamDates();
  const sessions = useFocusSessions();
  const settings = useSettings();
  const reduce = useReducedMotion();
  if (!hydrated) return <SkeletonDesk />;

  const ctx = classDateContext();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const todaySlots = slots.filter((s) => s.day === ctx.day).sort((a, b) => a.start.localeCompare(b.start));
  const T = settings.attendanceThreshold / 100;
  const classSlots = slots.filter((s) => s.kind !== "break" && s.subjectId);
  const overallC = countAttendance(
    logs,
    classSlots.map((s) => s.id)
  );
  const overall = bunkBank(overallC.attended, overallC.total, T, "campus life");
  const streak = computeStreak(logs, sessions);
  const nextExam = [...exams].sort((a, b) => a.date.localeCompare(b.date))[0];
  const subjBanks = subjects
    .map((sub) => {
      const ids = slots.filter((s) => s.subjectId === sub.id).map((s) => s.id);
      return { sub, bank: bunkBank(...tuple(countAttendance(logs, ids)), T, sub.code) };
    })
    .sort((a, b) => a.bank.pct - b.bank.pct);

  return (
    <div className="space-y-4">
      <header>
        <p className="font-display text-sm font-bold uppercase tracking-wide">AIML III-C · REVA</p>
        <h1 className="font-display text-3xl font-bold tracking-tighter">{greet}, scholar.</h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <PaperCard id="gauge">
          <p className="font-display text-xs font-bold uppercase">Overall attendance</p>
          <p className="font-display text-4xl font-bold tabular">{Math.round(overall.pct)}%</p>
          <StatusBadge status={overall.status} />
        </PaperCard>
        <PaperCard id="streak">
          <p className="flex items-center gap-1 font-display text-xs font-bold uppercase">
            <Flame className="h-4 w-4" /> Streak
          </p>
          <p className="font-display text-4xl font-bold tabular">{streak}</p>
          <p className="text-sm">days of showing up</p>
        </PaperCard>
        <PaperCard id="exam">
          <p className="font-display text-xs font-bold uppercase">Next exam</p>
          {nextExam ? (
            <>
              <p className="font-display text-2xl font-bold">{daysUntil(nextExam.date)}d</p>
              <p className="text-sm">{nextExam.label}</p>
            </>
          ) : (
            <p>None pinned</p>
          )}
        </PaperCard>
      </div>

      <section>
        <h2 className="mb-2 font-display text-xl font-bold">{ctx.weekend ? "Up next · Monday" : "Today's classes"}</h2>
        {ctx.weekend ? (
          <EmptyState
            doodle="weekend"
            title="Studio closed"
            body="It's the weekend. Monday's stack is waiting — rest the graphite."
          />
        ) : todaySlots.length === 0 ? (
          <EmptyState doodle="empty" title="No periods" body="Add a timetable or load demo data." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {todaySlots.map((slot, i) => {
              const sub = subjects.find((s) => s.id === slot.subjectId);
              const log = logs.find((l) => l.slotId === slot.id && l.date === todayKey());
              const color = (sub?.color ?? "butter") as SubjectColor;
              return (
                <motion.div
                  key={slot.id}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <StickyNote id={slot.id} color={color}>
                    <p className="font-display text-xs font-bold tabular">
                      {slot.start}–{slot.end}
                    </p>
                    <p className="font-display text-lg font-bold">
                      {slot.kind === "break" ? slot.room : sub?.code ?? "Free"}
                    </p>
                    <p className="text-xs">
                      {sub?.name} · {slot.room}
                    </p>
                    {slot.kind !== "break" && sub ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(["attended", "missed", "cancelled"] as AttendanceStatus[]).map((st) => (
                          <BrutalButton
                            key={st}
                            variant={log?.status === st ? "ink" : "paper"}
                            className="px-2 py-1 text-[10px]"
                            onClick={() => repo.setStatus(slot.id, todayKey(), st)}
                          >
                            {st}
                          </BrutalButton>
                        ))}
                      </div>
                    ) : null}
                  </StickyNote>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <PaperCard id="bunk-bank">
        <h2 className="mb-2 font-display text-xl font-bold">Bunk Bank</h2>
        <ul className="space-y-2">
          {subjBanks.map(({ sub, bank }) => (
            <li key={sub.id} className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/20 pb-2">
              <div>
                <p className="font-display font-bold">
                  {sub.code} · {Math.round(bank.pct)}%
                </p>
                <p className="text-sm">{bank.sentence}</p>
              </div>
              <StatusBadge status={bank.status} />
            </li>
          ))}
        </ul>
      </PaperCard>

      <PaperCard id="settings">
        <h2 className="mb-2 font-display text-lg font-bold">Settings</h2>
        <div className="flex flex-wrap gap-2">
          <BrutalButton variant="sage" onClick={() => repo.loadDemo()}>
            Load demo data
          </BrutalButton>
          <BrutalButton variant="tomato" onClick={() => repo.resetAll()}>
            Reset
          </BrutalButton>
        </div>
      </PaperCard>
    </div>
  );
}

function tuple(c: { attended: number; total: number }): [number, number] {
  return [c.attended, c.total];
}
