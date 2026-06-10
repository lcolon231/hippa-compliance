"use client";

import { useRef, useState, useTransition } from "react";
import {
  Download,
  FileText,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getUploadUrl,
  recordEvidence,
  getEvidenceDownloadUrl,
  deleteEvidence,
} from "@/app/actions/evidence";
import { formatDate, formatFileSize } from "@/lib/utils";

const ACCEPT = ".pdf,.png,.jpg,.jpeg,.docx";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface EvidenceItem {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
  uploadedBy: { name: string | null; email: string };
}

interface EvidenceSectionProps {
  taskId: string;
  evidence: EvidenceItem[];
  isAdmin: boolean;
}

export function EvidenceSection({
  taskId,
  evidence,
  isAdmin,
}: EvidenceSectionProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Evidence files must be 10MB or smaller.",
      });
      return;
    }

    setUploading(true);
    try {
      const { signedUrl, storagePath } = await getUploadUrl({
        taskId,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      const res = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");

      await recordEvidence({
        taskId,
        fileName: file.name,
        storagePath,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      toast({ title: "Uploaded", description: `${file.name} attached.` });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          err instanceof Error ? err.message : "Could not upload the file.",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(evidenceId: string) {
    try {
      const url = await getEvidenceDownloadUrl(evidenceId);
      window.open(url, "_blank");
    } catch {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not generate a download link.",
      });
    }
  }

  function handleDelete(evidenceId: string) {
    startTransition(async () => {
      try {
        await deleteEvidence(evidenceId);
        toast({ title: "Deleted", description: "Evidence file removed." });
      } catch {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Could not delete the evidence file.",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          PDF, PNG, JPG, or DOCX up to 10MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload evidence
        </Button>
      </div>

      {evidence.length === 0 ? (
        <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          No evidence attached yet. Upload your policy, signed BAA, training
          record, or screenshot.
        </div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {evidence.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-3">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.sizeBytes)} ·{" "}
                  {item.uploadedBy.name ?? item.uploadedBy.email} ·{" "}
                  {formatDate(item.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                title="Download"
                onClick={() => handleDownload(item.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
              {isAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete this evidence file?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {item.fileName} will be permanently removed from the
                        evidence vault. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
