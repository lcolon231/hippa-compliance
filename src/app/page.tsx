import Link from "next/link";
import {
  ShieldCheck,
  ClipboardCheck,
  FolderLock,
  FileText,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Compliance Checklist",
    description:
      "50 plain-English tasks mapped to the HIPAA Security Rule — Administrative, Physical, and Technical safeguards, BAAs, and documentation. Assign owners, set due dates, track progress.",
  },
  {
    icon: FolderLock,
    title: "Evidence Vault",
    description:
      "Attach policies, signed BAAs, training records, and screenshots to each task. Everything an auditor asks for, organized by citation, in one private vault.",
  },
  {
    icon: FileText,
    title: "Instant Reports",
    description:
      "Generate an audit-ready PDF compliance status report in one click: overall score, category breakdown, and the full task list with completion dates.",
  },
];

const PRICING_FEATURES = [
  "Full 50-task HIPAA Security Rule checklist",
  "Unlimited team members",
  "Evidence vault with secure file storage",
  "Unlimited PDF compliance reports",
  "Task assignment and due-date tracking",
  "Email support",
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span>HIPAA Tracker</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="#pricing"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
            >
              Pricing
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container flex flex-col items-center gap-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Built for small medical offices
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            HIPAA Compliance Made Simple
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Stop guessing whether your office is compliant. Track every HIPAA
            Security Rule requirement with a plain-English checklist, store
            your evidence in one place, and export an audit-ready report any
            time.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-muted/40 py-24">
          <div className="container">
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
              Everything you need to stay audit-ready
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              The Security Rule has dozens of requirements scattered across
              §164.308–316. We turned them into a checklist your office
              manager can actually use.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <feature.icon className="mb-2 h-10 w-10 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="container py-24">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            Simple, flat pricing
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            One plan, everything included. A fraction of the cost of a single
            compliance consultant visit — or a single penalty.
          </p>
          <Card className="mx-auto max-w-md border-primary shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-medium text-muted-foreground">
                Per office
              </CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$79</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {PRICING_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/signup">Start Free</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Trust */}
        <section className="border-t bg-muted/40 py-16">
          <div className="container text-center">
            <h3 className="mb-3 text-xl font-semibold">
              We practice what we preach
            </h3>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
              Your compliance data is encrypted in transit (TLS 1.2+) and at
              rest on infrastructure from Vercel and Neon. Evidence files live
              in a private storage bucket and are only ever served through
              short-lived signed URLs. Admin-only actions are enforced
              server-side, and every query is scoped to your organization.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            HIPAA Compliance Tracker
          </div>
          <p className="text-xs text-muted-foreground">
            Not legal advice. Consult a qualified professional for compliance
            guidance specific to your practice.
          </p>
        </div>
      </footer>
    </div>
  );
}
