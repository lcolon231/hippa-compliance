"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { inviteTeamMember, removeTeamMember } from "@/app/actions/settings";

interface Member {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface TeamSectionProps {
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
}

export function TeamSection({
  members,
  currentUserId,
  isAdmin,
}: TeamSectionProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [, startTransition] = useTransition();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await inviteTeamMember(email);
      toast({
        title: "Invite sent",
        description: `${email} will receive an email invitation.`,
      });
      setEmail("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Invite failed",
        description:
          err instanceof Error ? err.message : "Could not send the invite.",
      });
    } finally {
      setInviting(false);
    }
  }

  function handleRemove(memberId: string, memberEmail: string) {
    startTransition(async () => {
      try {
        await removeTeamMember(memberId);
        toast({
          title: "Member removed",
          description: `${memberEmail} no longer has access.`,
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Remove failed",
          description:
            err instanceof Error ? err.message : "Could not remove the member.",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <form onSubmit={handleInvite} className="flex gap-2">
          <Input
            type="email"
            placeholder="colleague@yourpractice.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={inviting || !email.trim()}>
            {inviting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Invite
          </Button>
        </form>
      )}

      <ul className="divide-y rounded-xl border">
        {members.map((member) => {
          const initials = (member.name || member.email)
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <li
              key={member.id}
              className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/40"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {member.name ?? member.email}
                  {member.id === currentUserId && (
                    <span className="text-muted-foreground"> (you)</span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.email}
                </p>
              </div>
              <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                {member.role === "ADMIN" ? "Admin" : "Member"}
              </Badge>
              {isAdmin && member.id !== currentUserId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove team member?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {member.email} will immediately lose access to this
                        organization&apos;s compliance data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemove(member.id, member.email)}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
