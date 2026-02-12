import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { MetricCard } from "@/components/MetricCard";
import { useLatestThreatFeed } from "@/hooks/use-threat-feed";
import { AlertTriangle, Boxes, BrainCircuit, Flame, Radar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SeverityPill } from "@/components/ThreatFeed/SeverityPill";
import { cn } from "@/lib/utils";

function scoreFromX10(x10: number) {
  return Math.max(0, Math.min(10, x10 / 10));
}

export default function DashboardOverview() {
  const { data, isLoading, isError, error, refetch, isFetching } = useLatestThreatFeed({
    limit: 12,
    source: "cache",
  });

  const kpis = useMemo(() => {
    const items = data ?? [];
    const critical = items.filter((x) => (x.severity ?? "").toLowerCase() === "critical").length;
    const high = items.filter((x) => (x.severity ?? "").toLowerCase() === "high").length;
    const avg = items.length ? items.reduce((a, b) => a + (b.cvssScoreX10 ?? 0), 0) / items.length / 10 : 0;
    const newest = items[0]?.publishedAt ? new Date(items[0].publishedAt as any) : null;
    return { critical, high, avg, newest, total: items.length };
  }, [data]);

  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="overview-header"
          eyebrow="Operations"
          title="AI Patch Optimization Engine"
          description={
            <span>
              A premium incident-response dashboard: NVD threat feed, model comparison, explainability, optimization, and
              exportable reporting—designed for speed under pressure.
            </span>
          }
          right={
            <div className="flex items-center gap-2">
              <Button
                data-testid="overview-button-refresh-kpis"
                variant="secondary"
                className="rounded-2xl"
                onClick={() => refetch()}
              >
                {isFetching ? "Updating…" : "Refresh"}
              </Button>
              <Link
                href="/threat-feed"
                data-testid="overview-link-to-feed"
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold",
                  "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20",
                  "hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
                  "transition-all duration-200 ease-out",
                )}
              >
                <Flame className="h-4 w-4" />
                Open Threat Feed
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            data-testid="kpi-critical"
            title="Critical CVEs"
            value={isLoading ? "—" : kpis.critical}
            hint="High urgency items observed in latest snapshot."
            icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
            tone="warning"
          />
          <MetricCard
            data-testid="kpi-high"
            title="High Severity"
            value={isLoading ? "—" : kpis.high}
            hint="Candidate set for near-term remediation."
            icon={<Radar className="h-5 w-5 text-chart-3" />}
            tone="accent"
          />
          <MetricCard
            data-testid="kpi-average"
            title="Avg CVSS"
            value={isLoading ? "—" : kpis.avg.toFixed(1)}
            hint="A coarse risk indicator—use models for depth."
            icon={<Flame className="h-5 w-5 text-primary" />}
            tone="primary"
          />
          <MetricCard
            data-testid="kpi-newest"
            title="Most Recent"
            value={isLoading ? "—" : kpis.newest ? kpis.newest.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
            hint={kpis.newest ? kpis.newest.toLocaleDateString() : "No data yet."}
            icon={<Sparkles className="h-5 w-5 text-accent" />}
            tone="success"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-4 lg:gap-6">
          <div className="glass rounded-3xl border border-border/70 shadow-soft p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Snapshot</div>
                <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">Latest CVEs (preview)</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  A compact view of the most recent threats. Expand the full feed for filters + auto-refresh.
                </div>
              </div>
              <Link
                href="/threat-feed"
                data-testid="overview-link-feed-secondary"
                className="text-sm font-semibold text-primary hover:text-primary/90 hover:underline transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="mt-4 grid gap-3">
              {isError ? (
                <div
                  data-testid="overview-feed-error"
                  className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4"
                >
                  <div className="font-semibold">Threat preview failed</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {(error as Error)?.message || "Unknown error"}
                  </div>
                  <Button
                    data-testid="overview-feed-retry"
                    className="mt-3 rounded-xl"
                    variant="secondary"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              ) : null}

              {(data ?? []).slice(0, 6).map((cve) => {
                const score = scoreFromX10(cve.cvssScoreX10);
                const date = new Date(cve.publishedAt as any);
                return (
                  <div
                    key={cve.cveId}
                    data-testid={`overview-preview-${cve.cveId}`}
                    className="rounded-2xl border border-border/70 bg-muted/15 hover:bg-muted/25 transition-colors p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="font-semibold truncate">{cve.cveId}</div>
                        <SeverityPill severity={cve.severity} score={score} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {date.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-2">{cve.description}</div>
                  </div>
                );
              })}

              {!isLoading && (data?.length ?? 0) === 0 ? (
                <div data-testid="overview-feed-empty" className="rounded-2xl border border-border/70 bg-muted/10 p-6">
                  <div className="font-semibold">No CVEs yet</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Refresh the threat feed to pull recent CVEs from NVD (or cache).
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="glass rounded-3xl border border-border/70 shadow-soft p-5 sm:p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Workflows</div>
            <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">Fast lanes</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Jump into core capabilities—built for analyst rhythm.
            </div>

            <div className="mt-4 grid gap-3">
              <Link
                href="/model-lab"
                data-testid="overview-workflow-model-lab"
                className="group rounded-2xl border border-border/70 bg-gradient-to-br from-primary/14 to-transparent p-4 hover:shadow-lift transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Model comparison</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Compare RF vs GBM, inspect performance, and pick a winner.
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/explainability"
                data-testid="overview-workflow-shap"
                className="group rounded-2xl border border-border/70 bg-gradient-to-br from-accent/14 to-transparent p-4 hover:shadow-lift transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-xl bg-accent/10 border border-accent/20">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">Explainability (SHAP)</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Global + local attributions for transparent prioritization.
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/optimization"
                data-testid="overview-workflow-optimization"
                className="group rounded-2xl border border-border/70 bg-gradient-to-br from-chart-3/14 to-transparent p-4 hover:shadow-lift transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-xl bg-chart-3/10 border border-chart-3/20">
                    <Boxes className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <div className="font-semibold">Knapsack optimization</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Maximize risk reduction under cost/time constraints.
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
