import { describe, it, expect } from "vitest";
import { calculateComplianceScore, formatFileSize, formatDate } from "./utils";

describe("calculateComplianceScore", () => {
  it("returns 0 for an empty task list", () => {
    expect(calculateComplianceScore([])).toBe(0);
  });

  it("returns 0 when every task is NOT_APPLICABLE", () => {
    expect(
      calculateComplianceScore([
        { status: "NOT_APPLICABLE" },
        { status: "NOT_APPLICABLE" },
      ])
    ).toBe(0);
  });

  it("excludes NOT_APPLICABLE tasks from the denominator", () => {
    // 1 of 2 applicable tasks complete = 50%, regardless of the N/A task.
    expect(
      calculateComplianceScore([
        { status: "COMPLETE" },
        { status: "NOT_STARTED" },
        { status: "NOT_APPLICABLE" },
      ])
    ).toBe(50);
  });

  it("rounds to the nearest integer", () => {
    // 1 of 3 = 33.33...% -> rounds to 33.
    expect(
      calculateComplianceScore([
        { status: "COMPLETE" },
        { status: "NOT_STARTED" },
        { status: "IN_PROGRESS" },
      ])
    ).toBe(33);
  });

  it("returns 100 when all applicable tasks are complete", () => {
    expect(
      calculateComplianceScore([{ status: "COMPLETE" }, { status: "COMPLETE" }])
    ).toBe(100);
  });
});

describe("formatFileSize", () => {
  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});

describe("formatDate", () => {
  it("returns an em dash for null/undefined", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });

  it("formats a date string", () => {
    expect(formatDate("2026-01-15")).toBe("Jan 15, 2026");
  });
});
