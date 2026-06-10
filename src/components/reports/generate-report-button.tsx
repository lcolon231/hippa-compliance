"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generateReport } from "@/app/actions/reports";

export function GenerateReportButton() {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const { downloadUrl, score } = await generateReport();
      toast({
        title: "Report generated",
        description: `Compliance score at export: ${score}%. Download starting...`,
      });
      window.open(downloadUrl, "_blank");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Report failed",
        description:
          err instanceof Error ? err.message : "Could not generate the report.",
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Button onClick={handleGenerate} disabled={generating}>
      {generating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      Generate Report
    </Button>
  );
}
