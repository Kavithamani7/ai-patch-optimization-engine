import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, FileSearch, Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import { SeverityPill } from "./SeverityPill";

type Row = {
  cveId: string;
  cvssScoreX10: number;
  severity: string;
  publishedAt: Date;
  description: string;
};

function scoreFromX10(x10: number) {
  return Math.max(0, Math.min(10, x10 / 10));
}

export function ThreatFeedRow({
  item,
  expanded,
  onToggle,
}: {
  item: Row;
  expanded: boolean;
  onToggle: () => void;
}) {
  const score = useMemo(() => scoreFromX10(item.cvssScoreX10), [item.cvssScoreX10]);

  const nvdUrl = `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(item.cveId)}`;

  return (
    <div
      data-testid={`threat-row-${item.cveId}`}
      className={cn(
        "glass rounded-2xl border border-border/70 shadow-soft overflow-hidden",
        "transition-all duration-300",
        expanded ? "shadow-lift border-border" : "hover:shadow-lift hover:border-border",
      )}
    >
      <button
        data-testid={`threat-row-toggle-${item.cveId}`}
        onClick={onToggle}
        className={cn(
          "w-full text-left p-4 focus-ring",
          "transition-all duration-300",
        )}
      >
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex items-start gap-3">
            <div
              className={cn(
                "grid place-items-center h-10 w-10 rounded-xl border",
                "bg-gradient-to-br from-primary/12 to-accent/8 border-border/70",
              )}
            >
              <Radar className="h-4 w-4 text-primary" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold tracking-tight">{item.cveId}</div>
                <SeverityPill
                  data-testid={`threat-row-severity-${item.cveId}`}
                  severity={item.severity}
                  score={score}
                />
                <span className="text-xs text-muted-foreground">
                  {item.publishedAt.toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              data-testid={`threat-row-nvd-link-${item.cveId}`}
              href={nvdUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold",
                "border border-border/70 bg-muted/20 hover:bg-muted/35 transition-colors",
                "focus-ring",
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              NVD
            </a>
            <div
              className={cn(
                "grid place-items-center h-9 w-9 rounded-xl border border-border/70 bg-muted/20",
                "transition-transform duration-300",
                expanded ? "rotate-180" : "rotate-0",
              )}
              aria-hidden
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-border/70"
          >
            <div className="p-4 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Full description
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {item.description}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-muted/22 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-chart-3" />
                    <div className="text-sm font-semibold">Triage cues</div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Use the <span className="text-foreground/90 font-semibold">Model Lab</span> to estimate exploit risk,
                    then run <span className="text-foreground/90 font-semibold">Optimization</span> for a patch plan.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold border border-border/70 bg-muted/25">
                      CVSS {score.toFixed(1)}
                    </span>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold border border-border/70 bg-muted/25">
                      {item.severity}
                    </span>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold border border-border/70 bg-muted/25">
                      Published {item.publishedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Tip: Expand rows to review context quickly—no page navigation required.
                </div>
                <a
                  data-testid={`threat-row-nvd-link-expanded-${item.cveId}`}
                  href={nvdUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
                    "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
                    "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5",
                    "active:translate-y-0 active:shadow-md transition-all duration-200 ease-out",
                  )}
                >
                  Open in NVD <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
