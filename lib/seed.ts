import { addDays, localKey } from "./dates";
import type {
  AttendanceLog,
  ExamDate,
  FocusSession,
  Marks,
  Settings,
  Slot,
  Subject,
} from "./types";
import { DEFAULT_BANDS } from "./types";

function uid(prefix: string, n: number): string {
  return `${prefix}-${n}`;
}

export function demoBundle(now = new Date()): {
  subjects: Subject[];
  slots: Slot[];
  logs: AttendanceLog[];
  marks: Marks[];
  examDates: ExamDate[];
  focusSessions: FocusSession[];
  settings: Settings;
} {
  const subjects: Subject[] = [
    { id: "sub-dmgt", code: "DMGT", name: "Discrete Mathematics & Graph Theory", faculty: "Dr. Ananya Rao", credits: 4, color: "sage" },
    { id: "sub-ds", code: "DS", name: "Data Structures", faculty: "Prof. Vikram Hegde", credits: 4, color: "butter" },
    { id: "sub-dbms", code: "DBMS", name: "Database Management Systems", faculty: "Dr. Meera Iyer", credits: 4, color: "lavender" },
    { id: "sub-oopp", code: "OOPP", name: "Object Oriented Programming with Java", faculty: "Prof. Rohan Kulkarni", credits: 3, color: "peach" },
    { id: "sub-wmad", code: "WMAD", name: "Web & Mobile App Development", faculty: "Dr. Sana Qureshi", credits: 3, color: "sky" },
    { id: "sub-pb", code: "PB", name: "Probability & Problem-solving Basics", faculty: "Prof. Nikhil Sharma", credits: 3, color: "sage" },
  ];

  const S = {
    DMGT: "sub-dmgt",
    DS: "sub-ds",
    DBMS: "sub-dbms",
    OOPP: "sub-oopp",
    WMAD: "sub-wmad",
    PB: "sub-pb",
  };

  const slots: Slot[] = [];
  let n = 1;
  const push = (
    day: number,
    start: string,
    end: string,
    subjectId: string | null,
    room: string,
    kind: Slot["kind"]
  ) => {
    slots.push({ id: uid("slot", n), day, start, end, subjectId, room, kind });
    n += 1;
  };

  const week: Array<Array<{ start: string; end: string; code: keyof typeof S | "BREAK" | "TEA" | "LUNCH"; room: string; kind: Slot["kind"] }>> = [
    [
      { start: "08:30", end: "09:20", code: "DMGT", room: "SMVB 510", kind: "lecture" },
      { start: "09:20", end: "10:10", code: "DS", room: "SMVB 308", kind: "lecture" },
      { start: "10:10", end: "10:25", code: "TEA", room: "Canteen", kind: "break" },
      { start: "10:25", end: "11:15", code: "DBMS", room: "SMVB 510", kind: "lecture" },
      { start: "11:15", end: "12:05", code: "OOPP", room: "SMVB 308", kind: "lecture" },
      { start: "12:05", end: "12:55", code: "LUNCH", room: "Mess", kind: "break" },
      { start: "12:55", end: "13:45", code: "WMAD", room: "SMVB 510", kind: "lecture" },
      { start: "13:45", end: "14:35", code: "PB", room: "SMVB 308", kind: "lecture" },
      { start: "14:35", end: "16:15", code: "DS", room: "SMVB Lab-2", kind: "lab" },
    ],
    [
      { start: "08:30", end: "09:20", code: "DBMS", room: "SMVB 510", kind: "lecture" },
      { start: "09:20", end: "10:10", code: "DMGT", room: "SMVB 308", kind: "lecture" },
      { start: "10:10", end: "10:25", code: "TEA", room: "Canteen", kind: "break" },
      { start: "10:25", end: "11:15", code: "OOPP", room: "SMVB 510", kind: "lecture" },
      { start: "11:15", end: "12:05", code: "DS", room: "SMVB 308", kind: "lecture" },
      { start: "12:05", end: "12:55", code: "LUNCH", room: "Mess", kind: "break" },
      { start: "12:55", end: "13:45", code: "PB", room: "SMVB 510", kind: "lecture" },
      { start: "13:45", end: "14:35", code: "WMAD", room: "SMVB 308", kind: "lecture" },
      { start: "14:35", end: "16:15", code: "OOPP", room: "SMVB Lab-1", kind: "lab" },
    ],
    [
      { start: "08:30", end: "09:20", code: "WMAD", room: "SMVB 510", kind: "lecture" },
      { start: "09:20", end: "10:10", code: "DBMS", room: "SMVB 308", kind: "lecture" },
      { start: "10:10", end: "10:25", code: "TEA", room: "Canteen", kind: "break" },
      { start: "10:25", end: "11:15", code: "DS", room: "SMVB 510", kind: "lecture" },
      { start: "11:15", end: "12:05", code: "DMGT", room: "SMVB 308", kind: "lecture" },
      { start: "12:05", end: "12:55", code: "LUNCH", room: "Mess", kind: "break" },
      { start: "12:55", end: "13:45", code: "OOPP", room: "SMVB 510", kind: "lecture" },
      { start: "13:45", end: "14:35", code: "PB", room: "SMVB 308", kind: "lecture" },
      { start: "14:35", end: "16:15", code: "DBMS", room: "SMVB Lab-3", kind: "lab" },
    ],
    [
      { start: "08:30", end: "09:20", code: "OOPP", room: "SMVB 510", kind: "lecture" },
      { start: "09:20", end: "10:10", code: "PB", room: "SMVB 308", kind: "lecture" },
      { start: "10:10", end: "10:25", code: "TEA", room: "Canteen", kind: "break" },
      { start: "10:25", end: "11:15", code: "WMAD", room: "SMVB 510", kind: "lecture" },
      { start: "11:15", end: "12:05", code: "DBMS", room: "SMVB 308", kind: "lecture" },
      { start: "12:05", end: "12:55", code: "LUNCH", room: "Mess", kind: "break" },
      { start: "12:55", end: "13:45", code: "DMGT", room: "SMVB 510", kind: "lecture" },
      { start: "13:45", end: "14:35", code: "DS", room: "SMVB 308", kind: "lecture" },
      { start: "14:35", end: "16:15", code: "WMAD", room: "SMVB Lab-2", kind: "lab" },
    ],
    [
      { start: "08:30", end: "09:20", code: "DS", room: "SMVB 510", kind: "lecture" },
      { start: "09:20", end: "10:10", code: "OOPP", room: "SMVB 308", kind: "lecture" },
      { start: "10:10", end: "10:25", code: "TEA", room: "Canteen", kind: "break" },
      { start: "10:25", end: "11:15", code: "PB", room: "SMVB 510", kind: "lecture" },
      { start: "11:15", end: "12:05", code: "WMAD", room: "SMVB 308", kind: "lecture" },
      { start: "12:05", end: "12:55", code: "LUNCH", room: "Mess", kind: "break" },
      { start: "12:55", end: "13:45", code: "DBMS", room: "SMVB 510", kind: "lecture" },
      { start: "13:45", end: "14:35", code: "DMGT", room: "SMVB 308", kind: "lecture" },
      { start: "14:35", end: "16:15", code: "PB", room: "SMVB Lab-1", kind: "lab" },
    ],
  ];

  week.forEach((daySlots, day) => {
    daySlots.forEach((s) => {
      const sid = s.code === "TEA" || s.code === "LUNCH" || s.code === "BREAK" ? null : S[s.code];
      push(day, s.start, s.end, sid, s.room, s.kind);
    });
  });

  const yesterday = localKey(addDays(now, -1));
  const start = addDays(now, -35);
  const logs: AttendanceLog[] = [];
  for (let d = new Date(start); localKey(d) <= yesterday; d = addDays(d, 1)) {
    const js = d.getDay();
    if (js === 0 || js === 6) continue;
    const grid = js - 1;
    const date = localKey(d);
    for (const slot of slots) {
      if (slot.day !== grid || slot.kind === "break" || !slot.subjectId) continue;
      const h = hash(`${slot.id}:${date}`);
      let status: AttendanceLog["status"] = "attended";
      if (h % 37 === 0) status = "cancelled";
      else if (slot.subjectId === "sub-dbms") status = h % 100 < 28 ? "missed" : "attended";
      else if (slot.subjectId === "sub-pb") status = h % 100 < 18 ? "missed" : "attended";
      else status = h % 100 < 12 ? "missed" : "attended";
      logs.push({ slotId: slot.id, date, status });
    }
  }

  const marks: Marks[] = [
    { subjectId: "sub-dmgt", ia1: 21, ia2: 19 },
    { subjectId: "sub-ds", ia1: 20, ia2: 18 },
    { subjectId: "sub-dbms", ia1: 17 },
    { subjectId: "sub-oopp", ia1: 22, ia2: 20 },
    { subjectId: "sub-wmad", ia1: 19, ia2: 16 },
    { subjectId: "sub-pb", ia1: 18 },
  ];

  const examDates: ExamDate[] = [
    { id: "ex-1", subjectId: "sub-ds", label: "SEE — Data Structures", date: localKey(addDays(now, 22)) },
    { id: "ex-2", subjectId: "sub-dbms", label: "SEE — DBMS", date: localKey(addDays(now, 35)) },
    { id: "ex-3", subjectId: "sub-dmgt", label: "SEE — DMGT", date: localKey(addDays(now, 42)) },
  ];

  const focusSessions: FocusSession[] = [
    { id: "fs-1", date: yesterday, minutes: 50, mode: "lofi" },
    { id: "fs-2", date: localKey(addDays(now, -2)), minutes: 25, mode: "rain" },
    { id: "fs-3", date: localKey(addDays(now, -3)), minutes: 45, mode: "cafe" },
  ];

  const settings: Settings = {
    attendanceThreshold: 75,
    targetCgpa: 9,
    gradeBands: DEFAULT_BANDS.map((b) => ({ ...b })),
    semesterStart: localKey(addDays(now, -35)),
    semesterEnd: localKey(addDays(now, 70)),
  };

  return { subjects, slots, logs, marks, examDates, focusSessions, settings };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}
