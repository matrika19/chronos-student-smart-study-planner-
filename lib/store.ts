"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoBundle } from "./seed";
import type {
  AttendanceLog,
  AttendanceStatus,
  ExamDate,
  FocusMode,
  FocusSession,
  Marks,
  Settings,
  Slot,
  Subject,
} from "./types";
import { DEFAULT_BANDS } from "./types";
import { todayKey } from "./dates";

export type AppState = {
  hydrated: boolean;
  initialized: boolean;
  subjects: Subject[];
  slots: Slot[];
  logs: AttendanceLog[];
  marks: Marks[];
  examDates: ExamDate[];
  focusSessions: FocusSession[];
  settings: Settings;
  focusLive: { mode: FocusMode; startedAt: number } | null;
  setHydrated: () => void;
  loadDemo: () => void;
  resetAll: () => void;
  addSubject: (s: Subject) => void;
  updateSubject: (id: string, patch: Partial<Subject>) => void;
  addSlot: (s: Slot) => void;
  updateSlot: (id: string, patch: Partial<Slot>) => void;
  removeSlot: (id: string) => void;
  replaceSchedule: (subjects: Subject[], slots: Slot[]) => void;
  setStatus: (slotId: string, date: string, status: AttendanceStatus) => void;
  setMarks: (subjectId: string, patch: Partial<Marks>) => void;
  addExamDate: (e: ExamDate) => void;
  updateExamDate: (id: string, patch: Partial<ExamDate>) => void;
  removeExamDate: (id: string) => void;
  addFocusSession: (s: FocusSession) => void;
  setSettings: (patch: Partial<Settings>) => void;
  setFocusLive: (v: { mode: FocusMode; startedAt: number } | null) => void;
};

const emptySettings = (): Settings => ({
  attendanceThreshold: 75,
  targetCgpa: 9,
  gradeBands: DEFAULT_BANDS.map((b) => ({ ...b })),
  semesterStart: todayKey(),
  semesterEnd: todayKey(),
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      initialized: false,
      subjects: [],
      slots: [],
      logs: [],
      marks: [],
      examDates: [],
      focusSessions: [],
      settings: emptySettings(),
      focusLive: null,
      setHydrated: () => {
        const s = get();
        if (!s.initialized) {
          const demo = demoBundle();
          set({ ...demo, hydrated: true, initialized: true });
          return;
        }
        set({ hydrated: true });
      },
      loadDemo: () => set({ ...demoBundle(), initialized: true, hydrated: true }),
      resetAll: () =>
        set({
          subjects: [],
          slots: [],
          logs: [],
          marks: [],
          examDates: [],
          focusSessions: [],
          settings: emptySettings(),
          initialized: true,
          hydrated: true,
          focusLive: null,
        }),
      addSubject: (sub) => set({ subjects: [...get().subjects, sub] }),
      updateSubject: (id, patch) =>
        set({
          subjects: get().subjects.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }),
      addSlot: (slot) => set({ slots: [...get().slots, slot] }),
      updateSlot: (id, patch) =>
        set({ slots: get().slots.map((s) => (s.id === id ? { ...s, ...patch } : s)) }),
      removeSlot: (id) => set({ slots: get().slots.filter((s) => s.id !== id) }),
      replaceSchedule: (subjects, slots) => set({ subjects, slots }),
      setStatus: (slotId, date, status) => {
        const logs = get().logs.filter((l) => !(l.slotId === slotId && l.date === date));
        logs.push({ slotId, date, status });
        set({ logs });
      },
      setMarks: (subjectId, patch) => {
        const existing = get().marks.find((m) => m.subjectId === subjectId);
        if (!existing) {
          set({ marks: [...get().marks, { subjectId, ...patch }] });
          return;
        }
        set({
          marks: get().marks.map((m) => (m.subjectId === subjectId ? { ...m, ...patch } : m)),
        });
      },
      addExamDate: (e) => set({ examDates: [...get().examDates, e] }),
      updateExamDate: (id, patch) =>
        set({
          examDates: get().examDates.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }),
      removeExamDate: (id) => set({ examDates: get().examDates.filter((e) => e.id !== id) }),
      addFocusSession: (s) =>
        set({ focusSessions: [...get().focusSessions.filter((x) => x.minutes > 0), s] }),
      setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      setFocusLive: (v) => set({ focusLive: v }),
    }),
    {
      name: "chronos-canvas",
      partialize: (s) => ({
        initialized: s.initialized,
        subjects: s.subjects,
        slots: s.slots,
        logs: s.logs,
        marks: s.marks,
        examDates: s.examDates,
        focusSessions: s.focusSessions,
        settings: s.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
