import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TaskNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-2xl font-bold">Task not found</h2>
      <p className="text-muted-foreground">
        This task doesn&apos;t exist or belongs to a different organization.
      </p>
      <Button asChild>
        <Link href="/tasks">Back to tasks</Link>
      </Button>
    </div>
  );
}
