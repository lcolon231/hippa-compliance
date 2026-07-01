import { describe, it, expect } from "vitest";
import { trainingExpiryStatus } from "./utils";

const NOW = new Date("2026-07-01T00:00:00Z");

describe("trainingExpiryStatus", () => {
  it("returns 'none' when there is no expiry", () => {
    expect(trainingExpiryStatus(null, NOW)).toBe("none");
    expect(trainingExpiryStatus(undefined, NOW)).toBe("none");
  });

  it("returns 'expired' for a past date", () => {
    expect(trainingExpiryStatus(new Date("2026-06-30"), NOW)).toBe("expired");
  });

  it("returns 'expiring' within 30 days", () => {
    expect(trainingExpiryStatus(new Date("2026-07-20"), NOW)).toBe("expiring");
  });

  it("returns 'valid' beyond 30 days", () => {
    expect(trainingExpiryStatus(new Date("2026-09-01"), NOW)).toBe("valid");
  });

  it("treats the 30-day boundary as expiring", () => {
    expect(trainingExpiryStatus(new Date("2026-07-31T00:00:00Z"), NOW)).toBe(
      "expiring"
    );
  });
});
