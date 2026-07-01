import { timingSafeEqual } from "crypto";

/**
 * Constant-time comparison of the cron Authorization header against
 * CRON_SECRET, to avoid leaking the secret via response-timing side
 * channels.
 */
export function isAuthorizedCronRequest(
  authHeader: string | null,
  secret: string | undefined = process.env.CRON_SECRET
): boolean {
  if (!secret || !authHeader) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(authHeader);
  if (expected.length !== actual.length) return false;

  return timingSafeEqual(expected, actual);
}
