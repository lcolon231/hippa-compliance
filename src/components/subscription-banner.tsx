import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface SubscriptionBannerProps {
  status: string;
  isAdmin: boolean;
}

export function SubscriptionBanner({ status, isAdmin }: SubscriptionBannerProps) {
  if (status !== "PAST_DUE" && status !== "CANCELED") return null;

  const message =
    status === "PAST_DUE"
      ? "Your payment is past due. Update your payment method to keep full access."
      : "Your subscription has been canceled. Resubscribe to keep your compliance records active.";

  return (
    <div className="flex items-center justify-center gap-2 border-b border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-900">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
      {isAdmin && (
        <Link href="/settings" className="font-medium underline">
          Manage billing
        </Link>
      )}
    </div>
  );
}
