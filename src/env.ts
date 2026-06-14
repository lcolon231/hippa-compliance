import { z } from "zod";

/**
 * Centralized, validated environment access.
 *
 * Imported from next.config.ts so the critical infrastructure variables are
 * checked at build/boot time — a misconfigured deploy fails fast with a clear
 * message instead of crashing later at runtime (e.g. the cron silently failing
 * at 1am because RESEND_API_KEY was never set).
 *
 * Runtime-only secrets (Stripe, Resend, cron, service-role key) are marked
 * optional here because they are intentionally absent from the build
 * environment; the lazily initialized clients in src/lib enforce them at their
 * point of use.
 */
const envSchema = z.object({
  // Always required — present at build and runtime.
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Validated at point of use by the lazily initialized clients.
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_PRICE_ID: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  // Escape hatch for tooling (e.g. Docker builds) that runs without a full env.
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as Env;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return parsed.data;
}

export const env = validateEnv();
