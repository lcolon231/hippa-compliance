import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "HIPAA Compliance Tracker",
    template: "%s | HIPAA Compliance Tracker",
  },
  description:
    "Track HIPAA Security Rule compliance for your medical office. Checklist, evidence vault, and audit-ready reports.",
};

// Mobile viewport: fit device width, allow user zoom (no maximum-scale) for a11y.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
