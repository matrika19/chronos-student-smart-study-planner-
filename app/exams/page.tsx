"use client";

import { useState } from "react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { Input } from "@/components/ui/Input";
import { PaperCard } from "@/components/ui/PaperCard";
import { SkeletonDesk } from "@/components/ui/Skeleton";
import { Slider } from "@/components/ui/Slider";
import { StickyNote } from "@/components/ui/StickyNote";
import { gradePoint, reverseSolver, subjectTotal } from "@/lib/engine";
import { repo, useExamDates, useHydrated, useMarks, useSettings, useSubjects } from "@/lib/repo";
import type { GradeBand } from "@/lib/types";

export default function ExamsPage() {
  const hydrated = useHydrated();
  const subjects = useSubjects();
  const marks = useMarks();
  const settings = useSettings();
  const exams = useExamDates();
  const [bandsOpen, setBandsOpen] = useState(false);
  if (!hydrated) return <SkeletonDesk />;

  const result = reverseSolver(settings.targetCgpa, subjects, marks, settings.gradeBands);

  function clamp(n: number, max: number): number {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(max, n));
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold tracking-tighter">Marks & target CGPA</h1>
      <PaperCard id="target">
        <Slider
          label="Target CGPA"
          min={5}
          max={10}
          step={0.1}
          value={settings.targetCgpa}
          onChange={(v) => repo.setSettings({ targetCgpa: v })}
        />
        <Input
          label="Target number"
          type="number"
          min={5}
          max={10}
          step={0.1}
          value={settings.targetCgpa}
          onChange={(e) => repo.setSettings({ targetCgpa: Number(e.target.value) })}
        />
        <p className="mt-2 font-display text-lg font-bold tabular">
          Projected SGPA {result.projectedSgpa.toFixed(2)} · {result.reachable ? "reachable" : "stretch"}
        </p>
      </PaperCard>

      <div className="grid gap-3 sm:grid-cols-2">
        {subjects.map((sub) => {
          const m = marks.find((x) => x.subjectId === sub.id);
          const total = subjectTotal(m);
          const gp = gradePoint(total, settings.gradeBands);
          return (
            <StickyNote key={sub.id} id={sub.id} color={sub.color}>
              <p className="font-display font-bold">{sub.code}</p>
              <p className="text-xs">{sub.name}</p>
              <div className="mt-2 grid grid-cols-3 gap-1">
                <Input
                  label="IA1 /25"
                  type="number"
                  value={m?.ia1 ?? ""}
                  onChange={(e) => repo.setMarks(sub.id, { ia1: clamp(Number(e.target.value), 25) })}
                />
                <Input
                  label="IA2 /25"
                  type="number"
                  value={m?.ia2 ?? ""}
                  onChange={(e) => repo.setMarks(sub.id, { ia2: clamp(Number(e.target.value), 25) })}
                />
                <Input
                  label="SEE /50"
                  type="number"
                  value={m?.see ?? ""}
                  onChange={(e) => repo.setMarks(sub.id, { see: clamp(Number(e.target.value), 50) })}
                />
              </div>
              <p className="mt-2 font-display text-sm font-bold tabular">
                {total}/100 · GP {gp}
              </p>
            </StickyNote>
          );
        })}
      </div>

      <PaperCard id="solver">
        <h2 className="mb-2 font-display text-xl font-bold">Reverse solver</h2>
        <ul className="space-y-2 text-sm">
          {result.subjects.map((r) => (
            <li key={r.subjectId} className={r.unreachable ? "text-tomato" : ""}>
              {r.sentence}
            </li>
          ))}
        </ul>
      </PaperCard>

      <PaperCard id="exams-mgr">
        <h2 className="mb-2 font-display text-lg font-bold">Exam dates</h2>
        <ul className="space-y-2">
          {exams.map((e) => (
            <li key={e.id} className="flex flex-wrap items-end gap-2">
              <Input
                label="Label"
                value={e.label}
                onChange={(ev) => repo.updateExamDate(e.id, { label: ev.target.value })}
              />
              <Input
                label="Date"
                type="date"
                value={e.date}
                onChange={(ev) => repo.updateExamDate(e.id, { date: ev.target.value })}
              />
              <BrutalButton variant="tomato" onClick={() => repo.removeExamDate(e.id)}>
                Del
              </BrutalButton>
            </li>
          ))}
        </ul>
        <BrutalButton
          className="mt-2"
          variant="paper"
          onClick={() =>
            repo.addExamDate({
              id: `ex-${Date.now()}`,
              subjectId: subjects[0]?.id ?? "x",
              label: "New exam",
              date: settings.semesterEnd,
            })
          }
        >
          Add exam date
        </BrutalButton>
      </PaperCard>

      <PaperCard id="bands">
        <button type="button" className="font-display font-bold" onClick={() => setBandsOpen(!bandsOpen)}>
          Grade bands {bandsOpen ? "▾" : "▸"}
        </button>
        {bandsOpen ? (
          <div className="mt-2 space-y-2">
            {settings.gradeBands.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  label="Min"
                  type="number"
                  value={b.min}
                  onChange={(e) => {
                    const next: GradeBand[] = settings.gradeBands.map((x, j) =>
                      j === i ? { ...x, min: Number(e.target.value) } : x
                    );
                    repo.setSettings({ gradeBands: next });
                  }}
                />
                <Input
                  label="GP"
                  type="number"
                  value={b.gp}
                  onChange={(e) => {
                    const next: GradeBand[] = settings.gradeBands.map((x, j) =>
                      j === i ? { ...x, gp: Number(e.target.value) } : x
                    );
                    repo.setSettings({ gradeBands: next });
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </PaperCard>
    </div>
  );
}
