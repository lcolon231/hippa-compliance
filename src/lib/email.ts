import { Resend } from "resend";

const globalForResend = globalThis as unknown as { resend?: Resend };

function getResend(): Resend {
  if (!globalForResend.resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    globalForResend.resend = new Resend(apiKey);
  }
  return globalForResend.resend;
}

/**
 * Lazily-initialized Resend client. The underlying client is constructed on
 * first property access rather than at import time, so `next build` can collect
 * page data without RESEND_API_KEY being present in the build environment.
 */
export const resend = new Proxy({} as Resend, {
  get(_target, prop, receiver) {
    const client = getResend();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

const FROM = process.env.EMAIL_FROM ?? "HIPAA Tracker <noreply@example.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export interface ReminderTask {
  id: string;
  title: string;
  citation: string;
  dueDate: Date;
  overdue: boolean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendTaskReminderEmail(params: {
  to: string;
  recipientName: string | null;
  orgName: string;
  tasks: ReminderTask[];
}) {
  const { to, recipientName, orgName, tasks } = params;

  const overdue = tasks.filter((t) => t.overdue);
  const upcoming = tasks.filter((t) => !t.overdue);

  const subject = overdue.length
    ? `${overdue.length} overdue HIPAA task${overdue.length === 1 ? "" : "s"} — ${orgName}`
    : `Upcoming HIPAA task deadlines — ${orgName}`;

  const taskRow = (t: ReminderTask) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">
        <a href="${APP_URL}/tasks/${t.id}" style="color:#2563eb;text-decoration:none;font-weight:600;">
          ${escapeHtml(t.title)}
        </a>
        <div style="color:#64748b;font-size:12px;">45 CFR § ${escapeHtml(t.citation)}</div>
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;white-space:nowrap;color:${t.overdue ? "#dc2626" : "#475569"};font-size:13px;">
        ${t.overdue ? "Overdue — was due" : "Due"} ${t.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </td>
    </tr>`;

  const section = (label: string, items: ReminderTask[]) =>
    items.length
      ? `<h3 style="margin:20px 0 8px;font-size:14px;color:#0f172a;">${label}</h3>
         <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;">
           ${items.map(taskRow).join("")}
         </table>`
      : "";

  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <h2 style="font-size:18px;color:#0f172a;">HIPAA compliance task reminders</h2>
    <p style="color:#475569;font-size:14px;">
      Hi ${escapeHtml(recipientName ?? "there")}, here are your assigned compliance
      tasks for ${escapeHtml(orgName)} that need attention:
    </p>
    ${section("Overdue", overdue)}
    ${section("Due in the next 7 days", upcoming)}
    <p style="margin-top:24px;">
      <a href="${APP_URL}/tasks" style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:14px;">
        Open your task list
      </a>
    </p>
    <p style="margin-top:24px;color:#94a3b8;font-size:12px;">
      You're receiving this because tasks are assigned to you in HIPAA
      Compliance Tracker.
    </p>
  </div>`;

  return resend.emails.send({ from: FROM, to, subject, html });
}
