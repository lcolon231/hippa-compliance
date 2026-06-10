import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-lg font-semibold"
      >
        <ShieldCheck className="h-7 w-7 text-primary" />
        HIPAA Tracker
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
