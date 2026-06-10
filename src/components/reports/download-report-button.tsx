"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getReportDownloadUrl } from "@/app/actions/reports";

export function DownloadReportButton({ reportId }: { reportId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const url = await getReportDownloadUrl(reportId);
      window.open(url, "_blank");
    } catch {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not generate a download link.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download
    </Button>
  );
}
