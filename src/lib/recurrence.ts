/** Recurrence cadences offered for compliance tasks, in months. */
export const RECURRENCE_OPTIONS = [
  { value: 0, label: "One-time (no recurrence)" },
  { value: 1, label: "Monthly" },
  { value: 3, label: "Quarterly" },
  { value: 6, label: "Every 6 months" },
  { value: 12, label: "Annually" },
] as const;

export function recurrenceLabel(months: number | null | undefined): string {
  if (!months) return "One-time";
  const match = RECURRENCE_OPTIONS.find((o) => o.value === months);
  return match && months > 0 ? match.label : `Every ${months} months`;
}

/**
 * Adds `months` to a date, clamping the day so month-length differences don't
 * overflow (e.g. Jan 31 + 1mo → Feb 28, not Mar 3).
 */
export function addMonths(from: Date, months: number): Date {
  const d = new Date(from);
  const targetMonth = d.getMonth() + months;
  const result = new Date(d);
  result.setDate(1);
  result.setMonth(targetMonth);
  const daysInTarget = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();
  result.setDate(Math.min(d.getDate(), daysInTarget));
  return result;
}

/**
 * The next due date for a recurring task, measured from when it was completed.
 * Returns null for one-time tasks.
 */
export function nextDueDate(
  completedAt: Date,
  recurrenceMonths: number | null | undefined
): Date | null {
  if (!recurrenceMonths || recurrenceMonths <= 0) return null;
  return addMonths(completedAt, recurrenceMonths);
}
