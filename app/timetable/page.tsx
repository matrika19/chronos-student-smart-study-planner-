"use client";

import { useMemo, useState } from "react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PaperCard } from "@/components/ui/PaperCard";
import { SkeletonDesk } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { weekdayName } from "@/lib/dates";
import { repo, useHydrated, useSlots, useSubjects } from "@/lib/repo";
import { COLOR_HEX, type Slot, type SlotKind, type Subject, type SubjectColor } from "@/lib/types";

type OcrSlot = {
  day: number;
  start: string;
  end: string;
  subjectCode: string;
  room: string;
  kind: SlotKind;
};
type OcrSub = { code: string; name: string; faculty: string };

const COLORS: SubjectColor[] = ["sage", "butter", "lavender", "peach", "sky"];

export default function TimetablePage() {
  const hydrated = useHydrated();
  const subjects = useSubjects();
  const slots = useSlots();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ subjects: OcrSub[]; slots: OcrSlot[] } | null>(null);
  const [edit, setEdit] = useState<Slot | null>(null);
  const [open, setOpen] = useState(false);

  const times = useMemo(() => {
    const set = new Set(slots.map((s) => `${s.start}-${s.end}`));
    return Array.from(set).sort();
  }, [slots]);

  if (!hydrated) return <SkeletonDesk />;

  async function onFile(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/ocr", { method: "POST", body: fd });
      const json = (await res.json()) as {
        error?: string;
        subjects?: OcrSub[];
        slots?: OcrSlot[];
      };
      if (!res.ok || !json.slots) {
        toast(json.error ?? "OCR failed", "tomato");
        return;
      }
      setPreview({ subjects: json.subjects ?? [], slots: json.slots });
      toast("Preview ready — edit then confirm", "sage");
    } catch {
      toast("OCR failed — try demo timetable", "tomato");
    } finally {
      setBusy(false);
    }
  }

  function confirmPreview() {
    if (!preview) return;
    const subs: Subject[] = preview.subjects.map((s, i) => ({
      id: `ocr-${s.code.toLowerCase()}`,
      code: s.code,
      name: s.name || s.code,
      faculty: s.faculty || "TBA",
      credits: 3,
      color: COLORS[i % COLORS.length],
    }));
    const built: Slot[] = preview.slots.map((s, i) => ({
      id: `ocr-slot-${i}`,
      day: s.day,
      start: s.start,
      end: s.end,
      subjectId: s.kind === "break" ? null : `ocr-${s.subjectCode.toLowerCase()}`,
      room: s.room,
      kind: s.kind,
    }));
    repo.replaceSchedule(subs, built);
    setPreview(null);
    toast("Schedule stamped in", "sage");
  }

  function saveSlot() {
    if (!edit) return;
    if (slots.some((s) => s.id === edit.id)) repo.updateSlot(edit.id, edit);
    else repo.addSlot(edit);
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold tracking-tighter">Weekly grid</h1>
      <label
        className="block cursor-pointer border-[3px] border-dashed border-ink bg-dotted p-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) void onFile(f);
        }}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        <p className="font-display font-bold">{busy ? "Reading ink…" : "Drop a timetable photo"}</p>
        <p className="text-sm">or click to upload · Gemini OCR</p>
      </label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) void onFile(f);
        }}
        className="hidden"
      />

      {preview ? (
        <PaperCard id="ocr-preview">
          <h2 className="mb-2 font-display text-lg font-bold">OCR preview</h2>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Code</th>
                  <th>Room</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {preview.slots.map((s, i) => (
                  <tr key={i} className="border-t border-ink/20">
                    <td>
                      <input
                        aria-label="day"
                        className="w-12 border-2 border-ink"
                        value={s.day}
                        onChange={(e) => {
                          const next = [...preview.slots];
                          next[i] = { ...s, day: Number(e.target.value) };
                          setPreview({ ...preview, slots: next });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        aria-label="start"
                        className="w-16 border-2 border-ink"
                        value={s.start}
                        onChange={(e) => {
                          const next = [...preview.slots];
                          next[i] = { ...s, start: e.target.value };
                          setPreview({ ...preview, slots: next });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        aria-label="end"
                        className="w-16 border-2 border-ink"
                        value={s.end}
                        onChange={(e) => {
                          const next = [...preview.slots];
                          next[i] = { ...s, end: e.target.value };
                          setPreview({ ...preview, slots: next });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        aria-label="code"
                        className="w-16 border-2 border-ink"
                        value={s.subjectCode}
                        onChange={(e) => {
                          const next = [...preview.slots];
                          next[i] = { ...s, subjectCode: e.target.value };
                          setPreview({ ...preview, slots: next });
                        }}
                      />
                    </td>
                    <td>{s.room}</td>
                    <td>
                      <button
                        type="button"
                        className="underline"
                        onClick={() =>
                          setPreview({ ...preview, slots: preview.slots.filter((_, j) => j !== i) })
                        }
                      >
                        del
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-2">
            <BrutalButton variant="sage" onClick={confirmPreview}>
              Confirm & build schedule
            </BrutalButton>
            <BrutalButton variant="paper" onClick={() => setPreview(null)}>
              Discard
            </BrutalButton>
          </div>
        </PaperCard>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <BrutalButton
          variant="paper"
          onClick={() => {
            setEdit({
              id: `slot-${Date.now()}`,
              day: 0,
              start: "08:30",
              end: "09:20",
              subjectId: subjects[0]?.id ?? null,
              room: "SMVB 510",
              kind: "lecture",
            });
            setOpen(true);
          }}
        >
          Add slot
        </BrutalButton>
        <BrutalButton
          variant="ink"
          onClick={() => {
            repo.loadDemo();
            toast("Demo timetable loaded", "sage");
          }}
        >
          Use demo timetable
        </BrutalButton>
      </div>

      {slots.length === 0 ? (
        <EmptyState doodle="empty" title="Blank ledger" body="Upload a photo or stamp the demo grid." />
      ) : (
        <div className="overflow-x-auto border-[3px] border-ink">
          <div className="grid min-w-[720px]" style={{ gridTemplateColumns: "72px repeat(5, 1fr)" }}>
            <div className="border-b-2 border-r-2 border-ink bg-paper p-1 text-xs font-bold">Time</div>
            {[0, 1, 2, 3, 4].map((d) => (
              <div key={d} className="border-b-2 border-r-2 border-ink bg-paper p-1 text-center font-display text-xs font-bold">
                {weekdayName(d)}
              </div>
            ))}
            {times.map((t) => (
              <div key={t} className="contents">
                <div className="border-b border-r-2 border-ink p-1 font-display text-[10px] tabular">
                  {t.replace("-", " ")}
                </div>
                {[0, 1, 2, 3, 4].map((d) => {
                  const [start, end] = t.split("-");
                  const slot = slots.find((s) => s.day === d && s.start === start && s.end === end);
                  const sub = subjects.find((s) => s.id === slot?.subjectId);
                  return (
                    <button
                      key={`${d}-${t}`}
                      type="button"
                      className={cn("min-h-14 border-b border-r border-ink p-1 text-left text-[11px]")}
                      style={{ background: sub ? COLOR_HEX[sub.color] : slot?.kind === "break" ? "#eee" : "#F9F6F0" }}
                      onClick={() => {
                        if (!slot) return;
                        setEdit(slot);
                        setOpen(true);
                      }}
                    >
                      <span className="font-display font-bold">{slot?.kind === "break" ? "break" : sub?.code}</span>
                      <span className="block">{slot?.room}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={open} title="Edit slot" onClose={() => setOpen(false)}>
        {edit ? (
          <div className="space-y-2">
            <Input
              label="Day 0-4"
              type="number"
              value={edit.day}
              onChange={(e) => setEdit({ ...edit, day: Number(e.target.value) })}
            />
            <Input label="Start" value={edit.start} onChange={(e) => setEdit({ ...edit, start: e.target.value })} />
            <Input label="End" value={edit.end} onChange={(e) => setEdit({ ...edit, end: e.target.value })} />
            <Input label="Room" value={edit.room} onChange={(e) => setEdit({ ...edit, room: e.target.value })} />
            <label className="block text-sm" htmlFor="kind">
              <span className="mb-1 block font-display text-xs font-bold uppercase">Kind</span>
              <select
                id="kind"
                className="w-full border-[3px] border-ink p-2"
                value={edit.kind}
                onChange={(e) => setEdit({ ...edit, kind: e.target.value as SlotKind })}
              >
                <option value="lecture">lecture</option>
                <option value="lab">lab</option>
                <option value="break">break</option>
              </select>
            </label>
            <label className="block text-sm" htmlFor="subj">
              <span className="mb-1 block font-display text-xs font-bold uppercase">Subject</span>
              <select
                id="subj"
                className="w-full border-[3px] border-ink p-2"
                value={edit.subjectId ?? ""}
                onChange={(e) => setEdit({ ...edit, subjectId: e.target.value || null })}
              >
                <option value="">None</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <BrutalButton variant="ink" onClick={saveSlot}>
                Save
              </BrutalButton>
              <BrutalButton
                variant="tomato"
                onClick={() => {
                  repo.removeSlot(edit.id);
                  setOpen(false);
                }}
              >
                Delete
              </BrutalButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
