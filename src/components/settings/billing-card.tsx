"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  createCheckoutSession,
  createBillingPortalSession,
} from "@/app/actions/billing";
import { formatDate } from "@/lib/utils";

const STATUS_META: Record<string, { label: string; className: string }> = {
  TRIALING: { label: "Trial", className: "bg-blue-100 text-blue-800" },
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
  PAST_DUE: { label: "Past due", className: "bg-yellow-100 text-yellow-800" },
  CANCELED: { label: "Canceled", className: "bg-red-100 text-red-800" },
};

interface BillingCardProps {
  subscriptionStatus: string;
  currentPeriodEnd: Date | null;
  hasCustomer: boolean;
  isAdmin: boolean;
}

export function BillingCard({
  subscriptionStatus,
  currentPeriodEnd,
  hasCustomer,
  isAdmin,
}: BillingCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const meta = STATUS_META[subscriptionStatus] ?? STATUS_META.TRIALING;
  const subscribed = subscriptionStatus === "ACTIVE" && hasCustomer;

  async function handleAction() {
    setLoading(true);
    try {
      const { url } = hasCustomer
        ? await createBillingPortalSession()
        : await createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Billing error",
        description:
          err instanceof Error ? err.message : "Could not open billing.",
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Office plan — $79/month
            </p>
            <p className="text-xs text-muted-foreground">
              {currentPeriodEnd
                ? `Renews ${formatDate(currentPeriodEnd)}`
                : "Unlimited team members, evidence storage, and reports"}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className={meta.className}>
          {meta.label}
        </Badge>
      </div>

      {isAdmin ? (
        <Button onClick={handleAction} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
          {subscribed || hasCustomer ? "Manage billing" : "Subscribe"}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Only admins can manage billing.
        </p>
      )}
    </div>
  );
}
