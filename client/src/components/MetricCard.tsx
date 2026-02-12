import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  hint,
  icon,
  tone = "primary",
  right,
  "data-testid": dataTestId,
}: {
  title: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ReactNode;
  tone?: "primary" | "accent" | "warning" | "success";
  right?: ReactNode;
  "data-testid"?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "from-primary/18 via-primary/10 to-transparent"
      : tone === "accent"
        ? "from-accent/20 via-accent/10 to-transparent"
        : tone === "warning"
          ? "from-chart-3/22 via-chart-3/10 to-transparent"
          : "from-chart-4/20 via-chart-4/10 to-transparent";

  const ring =
    tone === "primary"
      ? "shadow-[0_0_0_1px_hsl(var(--primary)/0.18),0_16px_60px_-44px_hsl(var(--primary)/0.9)]"
      : tone === "accent"
        ? "shadow-[0_0_0_1px_hsl(var(--accent)/0.18),0_16px_60px_-44px_hsl(var(--accent)/0.9)]"
        : tone === "warning"
          ? "shadow-[0_0_0_1px_hsl(var(--chart-3)/0.18),0_16px_60px_-44px_hsl(var(--chart-3)/0.9)]"
          : "shadow-[0_0_0_1px_hsl(var(--chart-4)/0.18),0_16px_60px_-44px_hsl(var(--chart-4)/0.9)]";

  return (
    <div
      data-testid={dataTestId}
      className={cn(
        "glass rounded-3xl border border-border/70 p-5 sm:p-6 shadow-soft",
        "transition-all duration-300 hover:shadow-lift hover:border-border",
      )}
    >
      <div className={cn("rounded-2xl p-4 border border-border/70 bg-gradient-to-br", toneClass, ring)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid place-items-center h-11 w-11 rounded-2xl bg-muted/25 border border-border/70">
              {icon}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">{value}</div>
              {hint ? <div className="mt-2 text-xs text-muted-foreground leading-relaxed">{hint}</div> : null}
            </div>
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </div>
    </div>
  );
}
