import { describe, it, expect } from "vitest";
import { addMonths, nextDueDate, recurrenceLabel } from "./recurrence";

describe("addMonths", () => {
  it("adds whole months", () => {
    expect(addMonths(new Date("2026-01-15"), 3)).toEqual(
      new Date("2026-04-15")
    );
  });

  it("clamps to end of a shorter target month", () => {
    // Jan 31 + 1 month has no Feb 31 → clamps to Feb 28 (2026 is not a leap year).
    expect(addMonths(new Date("2026-01-31"), 1)).toEqual(
      new Date("2026-02-28")
    );
  });

  it("rolls across a year boundary", () => {
    expect(addMonths(new Date("2026-11-10"), 3)).toEqual(
      new Date("2027-02-10")
    );
  });
});

describe("nextDueDate", () => {
  it("returns null for one-time tasks", () => {
    expect(nextDueDate(new Date("2026-01-01"), null)).toBeNull();
    expect(nextDueDate(new Date("2026-01-01"), 0)).toBeNull();
  });

  it("computes the next annual due date from completion", () => {
    expect(nextDueDate(new Date("2026-03-01"), 12)).toEqual(
      new Date("2027-03-01")
    );
  });
});

describe("recurrenceLabel", () => {
  it("labels one-time for null/zero", () => {
    expect(recurrenceLabel(null)).toBe("One-time");
    expect(recurrenceLabel(0)).toBe("One-time");
  });

  it("labels known cadences", () => {
    expect(recurrenceLabel(3)).toBe("Quarterly");
    expect(recurrenceLabel(12)).toBe("Annually");
  });

  it("falls back for uncommon intervals", () => {
    expect(recurrenceLabel(5)).toBe("Every 5 months");
  });
});
