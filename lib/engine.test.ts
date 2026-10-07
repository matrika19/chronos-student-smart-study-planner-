import assert from "node:assert/strict";
import {
  attendancePct,
  bunkBank,
  computeStreak,
  daysUntil,
  gradePoint,
  reverseSolver,
  subjectTotal,
} from "./engine";
import { DEFAULT_BANDS } from "./types";

assert.equal(attendancePct(0, 0), 100);
assert.equal(attendancePct(8, 10), 80);

const bank = bunkBank(18, 20, 0.75, "DBMS");
assert.equal(bank.status, "SAFE");
assert.ok(bank.safeSkips >= 3);

const danger = bunkBank(14, 20, 0.75, "DBMS");
assert.equal(danger.status, "DANGER");
assert.ok(danger.mustAttend >= 1);
assert.match(danger.sentence, /Attend the next/);

assert.equal(gradePoint(91, DEFAULT_BANDS), 10);
assert.equal(gradePoint(72, DEFAULT_BANDS), 8);
assert.equal(subjectTotal({ subjectId: "x", ia1: 20, ia2: 18, see: 40 }), 78);

const rev = reverseSolver(
  9,
  [{ id: "ds", code: "DS", name: "Data Structures", faculty: "A", credits: 4, color: "butter" }],
  [{ subjectId: "ds", ia1: 20, ia2: 18 }],
  DEFAULT_BANDS
);
assert.equal(rev.subjects[0].requiredSee, 42);
assert.match(rev.subjects[0].sentence, /42\/50/);

assert.equal(computeStreak([{ slotId: "a", date: "2026-10-07", status: "attended" }], [], "2026-10-07"), 1);
assert.equal(daysUntil("2026-10-10", "2026-10-07"), 3);

console.log("engine tests passed");
