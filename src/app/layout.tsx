import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body className={`${manrope.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
