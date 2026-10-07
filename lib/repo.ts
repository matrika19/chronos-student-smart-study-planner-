"use client";

import { useAppStore } from "./store";
import type {
  AttendanceStatus,
  ExamDate,
  FocusSession,
  Marks,
  Settings,
  Slot,
  Subject,
} from "./types";

export function useHydrated(): boolean {
  return useAppStore((s) => s.hydrated);
}

export function useSubjects(): Subject[] {
  return useAppStore((s) => s.subjects);
}

export function useSlots(): Slot[] {
  return useAppStore((s) => s.slots);
}

export function useLogs() {
  return useAppStore((s) => s.logs);
}

export function useMarks(): Marks[] {
  return useAppStore((s) => s.marks);
}

export function useExamDates(): ExamDate[] {
  return useAppStore((s) => s.examDates);
}

export function useFocusSessions(): FocusSession[] {
  return useAppStore((s) => s.focusSessions);
}

export function useSettings(): Settings {
  return useAppStore((s) => s.settings);
}

export function useFocusLive() {
  return useAppStore((s) => s.focusLive);
}

export const repo = {
  loadDemo: () => useAppStore.getState().loadDemo(),
  resetAll: () => useAppStore.getState().resetAll(),
  addSubject: (s: Subject) => useAppStore.getState().addSubject(s),
  updateSubject: (id: string, patch: Partial<Subject>) =>
    useAppStore.getState().updateSubject(id, patch),
  addSlot: (s: Slot) => useAppStore.getState().addSlot(s),
  updateSlot: (id: string, patch: Partial<Slot>) => useAppStore.getState().updateSlot(id, patch),
  removeSlot: (id: string) => useAppStore.getState().removeSlot(id),
  replaceSchedule: (subjects: Subject[], slots: Slot[]) =>
    useAppStore.getState().replaceSchedule(subjects, slots),
  setStatus: (slotId: string, date: string, status: AttendanceStatus) =>
    useAppStore.getState().setStatus(slotId, date, status),
  setMarks: (subjectId: string, patch: Partial<Marks>) =>
    useAppStore.getState().setMarks(subjectId, patch),
  addExamDate: (e: ExamDate) => useAppStore.getState().addExamDate(e),
  updateExamDate: (id: string, patch: Partial<ExamDate>) =>
    useAppStore.getState().updateExamDate(id, patch),
  removeExamDate: (id: string) => useAppStore.getState().removeExamDate(id),
  addFocusSession: (s: FocusSession) => useAppStore.getState().addFocusSession(s),
  setSettings: (patch: Partial<Settings>) => useAppStore.getState().setSettings(patch),
  setFocusLive: (v: { mode: FocusSession["mode"]; startedAt: number } | null) =>
    useAppStore.getState().setFocusLive(v),
};
