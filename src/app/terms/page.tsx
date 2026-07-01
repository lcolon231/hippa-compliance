import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">Last updated: July 1, 2026</p>
        </div>

        <p className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-yellow-900">
          This is a template and has not been reviewed by a lawyer. Replace it
          with counsel-reviewed terms before accepting paying customers.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">1. Agreement to terms</h2>
          <p>
            By creating an account or using HIPAA Compliance Tracker
            (&quot;the Service&quot;), you agree to be bound by these Terms of
            Service. If you are using the Service on behalf of an
            organization, you represent that you have authority to bind that
            organization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">2. The Service</h2>
          <p>
            The Service provides a compliance checklist, evidence vault, and
            report generator to help track adherence to the HIPAA Security
            Rule and other frameworks you enable. The Service is a tracking
            tool, not legal advice, and does not guarantee regulatory
            compliance or certify compliance to any third party.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">3. Accounts and security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activity under your account.
            Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">4. Subscriptions and billing</h2>
          <p>
            Paid plans are billed in advance on a recurring basis through our
            payment processor (Stripe) and are subject to the pricing
            displayed at signup. You may cancel at any time through the
            billing portal; cancellation takes effect at the end of the
            current billing period. Fees are non-refundable except as
            required by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Acceptable use</h2>
          <p>
            You agree not to misuse the Service, including attempting to
            access other organizations&apos; data, uploading unlawful
            content, or interfering with the Service&apos;s operation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">6. Data ownership</h2>
          <p>
            You retain ownership of the compliance data and evidence files
            you upload. You grant us a license to store and process that data
            solely to provide the Service to you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">7. Disclaimers and liability</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of
            any kind. To the maximum extent permitted by law, we are not
            liable for indirect, incidental, or consequential damages arising
            from your use of the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">8. Termination</h2>
          <p>
            We may suspend or terminate access for violation of these terms.
            You may stop using the Service and delete your account at any
            time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">9. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            Service after changes constitutes acceptance of the revised
            terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">10. Contact</h2>
          <p>
            Questions about these terms can be sent to the support address
            listed in your account settings.
          </p>
        </section>
      </main>
    </div>
  );
}
