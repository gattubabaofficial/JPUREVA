import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "accent";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-foreground/50">{label}</div>
          <div className="mt-1 font-heading text-2xl text-foreground">{value}</div>
        </div>
        <div className={tone === "primary" ? "rounded-xl bg-primary/10 p-3 text-primary" : "rounded-xl bg-accent/10 p-3 text-accent-dark"}>
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
