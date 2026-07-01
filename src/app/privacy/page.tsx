import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            HIPAA Compliance Tracker
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Back home
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl space-y-6 py-12 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">Last updated: July 1, 2026</p>
        </div>

        <p className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-yellow-900">
          This is a template and has not been reviewed by a lawyer. Replace it
          with counsel-reviewed policy language, and confirm it accurately
          describes your subprocessors and data flows, before accepting
          paying customers.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">1. What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Account information: name, email, and organization name you
              provide at signup.
            </li>
            <li>
              Compliance data: checklist status, notes, due dates, and
              assignments you enter.
            </li>
            <li>
              Evidence files: documents you upload to the evidence vault
              (e.g. policies, BAAs, training records). We do not intend for
              this vault to hold patient health information (PHI) — do not
              upload PHI.
            </li>
            <li>
              Billing information: handled directly by Stripe; we store only
              your Stripe customer and subscription identifiers, not card
              numbers.
            </li>
            <li>Usage data: basic request logs for security and debugging.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">2. How we use it</h2>
          <p>
            We use collected data to operate the Service: authenticate you,
            scope your organization&apos;s data, generate reports, send
            due-date reminder emails, and process billing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">3. Subprocessors</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Supabase</strong> — authentication and encrypted file
              storage.
            </li>
            <li>
              <strong>Neon</strong> — Postgres database hosting.
            </li>
            <li>
              <strong>Vercel</strong> — application hosting.
            </li>
            <li>
              <strong>Stripe</strong> — payment processing.
            </li>
            <li>
              <strong>Resend</strong> — transactional and reminder email
              delivery.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">4. Data retention and deletion</h2>
          <p>
            We retain your data for as long as your account is active. You
            may request deletion of your organization&apos;s account and
            associated data by contacting support; some data may be retained
            longer where required for legal, billing, or security purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Security</h2>
          <p>
            Data is encrypted in transit (TLS) and at rest via our
            infrastructure providers. Evidence files are stored in private
            buckets and served only via short-lived signed URLs. Access to
            your organization&apos;s data is scoped server-side and
            admin-only actions are enforced server-side.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">6. Your choices</h2>
          <p>
            You can access, update, or delete most of your data directly in
            the app. For anything else, contact us using the support address
            in your account settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">7. Changes to this policy</h2>
          <p>
            We may update this policy from time to time; material changes
            will be communicated in-app or by email.
          </p>
        </section>
      </main>
    </div>
  );
}
