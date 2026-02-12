import { cn } from "@/lib/utils";

export function SeverityPill({
  severity,
  score,
  className,
  "data-testid": dataTestId,
}: {
  severity: string;
  score?: number;
  className?: string;
  "data-testid"?: string;
}) {
  const sev = severity?.toLowerCase?.() ?? "unknown";
  const tone =
    sev === "critical"
      ? "bg-destructive/15 text-destructive border-destructive/25"
      : sev === "high"
        ? "bg-chart-3/15 text-chart-3 border-chart-3/25"
        : sev === "medium"
          ? "bg-accent/12 text-accent border-accent/25"
          : sev === "low"
            ? "bg-chart-4/12 text-chart-4 border-chart-4/25"
            : "bg-muted/35 text-muted-foreground border-border/70";

  return (
    <span
      data-testid={dataTestId}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
        "transition-colors duration-300",
        tone,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      <span>{severity || "Unknown"}</span>
      {typeof score === "number" ? (
        <span className="font-bold text-foreground/90 tabular-nums">{score.toFixed(1)}</span>
      ) : null}
    </span>
  );
}
