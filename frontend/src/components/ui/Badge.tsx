import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent" | "primary";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-muted text-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  accent: "bg-accent/15 text-accent-dark",
  primary: "bg-primary/10 text-primary",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", toneClasses[tone])}>
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, Tone> = {
  DRAFT: "neutral",
  PENDING_VERIFICATION: "warning",
  VERIFIED: "primary",
  REJECTED: "danger",
  LISTED: "success",
  SOLD_OUT: "neutral",
  EXPIRED: "danger",
  PENDING: "warning",
  APPROVED: "success",
  PASS: "success",
  FAIL: "danger",
  CONDITIONAL: "warning",
  CONFIRMED: "primary",
  PACKED: "primary",
  OUT_FOR_DELIVERY: "accent",
  DELIVERED: "success",
  CANCELLED: "danger",
  FULFILLED: "success",
  PAID: "success",
  ACTIVE: "success",
  VALID: "success",
  EXPIRING_SOON: "warning",
  REQUESTED: "warning",
  ASSIGNED: "primary",
  SAMPLE_COLLECTED: "primary",
  IN_PROGRESS: "primary",
  COMPLETED: "success",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? "neutral"}>{status.replace(/_/g, " ")}</Badge>;
}
