export type SubjectColor = "sage" | "butter" | "lavender" | "peach" | "sky";

export type Subject = {
  id: string;
  code: string;
  name: string;
  faculty: string;
  credits: number;
  color: SubjectColor;
};

export type SlotKind = "lecture" | "lab" | "break";

export type Slot = {
  id: string;
  day: number;
  start: string;
  end: string;
  subjectId: string | null;
  room: string;
  kind: SlotKind;
};

export type AttendanceStatus = "attended" | "missed" | "cancelled";

export type AttendanceLog = {
  slotId: string;
  date: string;
  status: AttendanceStatus;
};

export type Marks = {
  subjectId: string;
  ia1?: number;
  ia2?: number;
  see?: number;
};

export type ExamDate = {
  id: string;
  subjectId: string;
  label: string;
  date: string;
};

export type FocusMode = "lofi" | "rain" | "cafe";

export type FocusSession = {
  id: string;
  date: string;
  minutes: number;
  mode: FocusMode;
};

export type GradeBand = {
  min: number;
  gp: number;
};

export type Settings = {
  attendanceThreshold: number;
  targetCgpa: number;
  gradeBands: GradeBand[];
  semesterStart: string;
  semesterEnd: string;
};

export type BunkStatus = "SAFE" | "EDGE" | "DANGER";

export type BunkResult = {
  attended: number;
  total: number;
  pct: number;
  safeSkips: number;
  mustAttend: number;
  status: BunkStatus;
  sentence: string;
};

export type ReverseSubject = {
  subjectId: string;
  name: string;
  targetGp: number;
  requiredTotal: number;
  requiredSee: number;
  unreachable: boolean;
  suggestedGp: number | null;
  suggestedSee: number | null;
  sentence: string;
};

export type ReverseResult = {
  subjects: ReverseSubject[];
  projectedSgpa: number;
  reachable: boolean;
};

export const DEFAULT_BANDS: GradeBand[] = [
  { min: 90, gp: 10 },
  { min: 80, gp: 9 },
  { min: 70, gp: 8 },
  { min: 60, gp: 7 },
  { min: 55, gp: 6 },
  { min: 50, gp: 5 },
  { min: 40, gp: 4 },
  { min: 0, gp: 0 },
];

export const COLOR_HEX: Record<SubjectColor, string> = {
  sage: "#CFE3C8",
  butter: "#F6E7A1",
  lavender: "#D9CCF0",
  peach: "#F7D3C1",
  sky: "#CDE4F2",
};
