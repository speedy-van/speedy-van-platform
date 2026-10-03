import assert from "node:assert/strict";
import test from "node:test";
import {
  VISITOR_ACTIVE_WINDOW_MS,
  activeVisitorCutoff,
  heartbeatDurationIncrementSeconds,
  recentReportingDayRanges,
  reportingDayRange,
  shouldApplyExit,
} from "./visitor-activity";

test("active visitor cutoff preserves the two minute realtime window", () => {
  const now = new Date("2026-10-03T12:00:00.000Z");
  assert.equal(activeVisitorCutoff(now).toISOString(), new Date(now.getTime() - VISITOR_ACTIVE_WINDOW_MS).toISOString());
});

test("heartbeat duration is monotonic and capped for visible 30 second polling", () => {
  const now = new Date("2026-10-03T12:00:00.000Z");
  assert.equal(heartbeatDurationIncrementSeconds(new Date("2026-10-03T11:59:35.000Z"), now), 25);
  assert.equal(heartbeatDurationIncrementSeconds(new Date("2026-10-03T11:55:00.000Z"), now), 60);
  assert.equal(heartbeatDurationIncrementSeconds(new Date("2026-10-03T12:00:10.000Z"), now), 0);
});

test("late exit requests cannot deactivate a newer heartbeat", () => {
  const lastActiveAt = new Date("2026-10-03T12:00:30.000Z");
  assert.equal(shouldApplyExit(lastActiveAt, new Date("2026-10-03T12:00:20.000Z")), false);
  assert.equal(shouldApplyExit(lastActiveAt, new Date("2026-10-03T12:00:30.000Z")), true);
});

test("Europe/London reporting days honour DST length changes", () => {
  const springForward = reportingDayRange(new Date("2026-03-29T12:00:00.000Z"));
  const fallBack = reportingDayRange(new Date("2026-10-25T12:00:00.000Z"));

  assert.equal((springForward.end.getTime() - springForward.start.getTime()) / 3_600_000, 23);
  assert.equal((fallBack.end.getTime() - fallBack.start.getTime()) / 3_600_000, 25);
});

test("weekly reporting ranges are labelled in ascending local calendar order", () => {
  const ranges = recentReportingDayRanges(7, new Date("2026-10-03T12:00:00.000Z"));
  assert.deepEqual(ranges.map((range) => range.label), [
    "2026-09-27",
    "2026-09-28",
    "2026-09-29",
    "2026-09-30",
    "2026-10-01",
    "2026-10-02",
    "2026-10-03",
  ]);
});
