import { describe, it, expect } from "vitest";
import { isAuthorizedCronRequest } from "./cron-auth";

const SECRET = "test-secret-value";

describe("isAuthorizedCronRequest", () => {
  it("accepts the correct bearer token", () => {
    expect(isAuthorizedCronRequest(`Bearer ${SECRET}`, SECRET)).toBe(true);
  });

  it("rejects a missing header", () => {
    expect(isAuthorizedCronRequest(null, SECRET)).toBe(false);
  });

  it("rejects an incorrect token", () => {
    expect(isAuthorizedCronRequest("Bearer wrong-value", SECRET)).toBe(false);
  });

  it("rejects a token of different length without throwing", () => {
    expect(isAuthorizedCronRequest("Bearer short", SECRET)).toBe(false);
  });

  it("rejects when CRON_SECRET is unset", () => {
    expect(isAuthorizedCronRequest(`Bearer ${SECRET}`, undefined)).toBe(false);
  });

  it("is case-sensitive on the scheme", () => {
    expect(isAuthorizedCronRequest(`bearer ${SECRET}`, SECRET)).toBe(false);
  });
});
