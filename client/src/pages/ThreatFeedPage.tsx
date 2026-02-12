import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { ThreatFeedSkeleton } from "@/components/ThreatFeed/ThreatFeedSkeleton";
import { ThreatFeedRow } from "@/components/ThreatFeed/ThreatFeedRow";
import { useLatestThreatFeed, useRefreshThreatFeed } from "@/hooks/use-threat-feed";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  AlarmClock,
  Filter,
  Flame,
  RefreshCw,
  RotateCcw,
  Settings2,
  ShieldAlert,
  Signal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const severities = ["Low", "Medium", "High", "Critical"] as const;

function scoreFromX10(x10: number) {
  return Math.max(0, Math.min(10, x10 / 10));
}

function coerceDate(d: unknown) {
  const dt = d instanceof Date ? d : new Date(String(d));
  return isNaN(dt.getTime()) ? new Date() : dt;
}

export default function ThreatFeedPage() {
  const limit = 25;

  const [source, setSource] = useState<"cache" | "nvd">("cache");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [intervalSec, setIntervalSec] = useState(60);

  const [minCvss, setMinCvss] = useState(0);
  const [selectedSev, setSelectedSev] = useState<Record<(typeof severities)[number], boolean>>({
    Low: true,
    Medium: true,
    High: true,
    Critical: true,
  });

  const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } = useLatestThreatFeed({
    limit,
    source,
  });

  const refreshMutation = useRefreshThreatFeed();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoRefresh) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      refetch();
    }, intervalSec * 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoRefresh, intervalSec, refetch]);

  const filtered = useMemo(() => {
    const items = (data ?? []).map((x) => ({
      ...x,
      publishedAt: coerceDate(x.publishedAt as any),
    }));

    const allowed = new Set(
      severities.filter((s) => selectedSev[s]).map((s) => s.toLowerCase()),
    );

    return items
      .filter((x) => allowed.has((x.severity ?? "").toLowerCase()))
      .filter((x) => scoreFromX10(x.cvssScoreX10) >= minCvss)
      .sort((a, b) => (coerceDate(b.publishedAt as any).getTime() - coerceDate(a.publishedAt as any).getTime()));
  }, [data, minCvss, selectedSev]);

  const selectedSevCount = useMemo(
    () => severities.filter((s) => selectedSev[s]).length,
    [selectedSev],
  );

  const updating = isFetching && !isLoading;

  function resetFilters() {
    setMinCvss(0);
    setSelectedSev({ Low: true, Medium: true, High: true, Critical: true });
    toast({ title: "Filters reset", description: "Showing all severities and CVSS ≥ 0.0." });
  }

  async function manualRefresh() {
    try {
      const res = await refreshMutation.mutateAsync({ limit });
      toast({
        title: "Threat feed refreshed",
        description: `Inserted ${res.inserted}, updated ${res.updated}. Total ${res.total}.`,
      });
    } catch (e) {
      toast({
        title: "Refresh failed",
        description: (e as Error)?.message ?? "Unknown error",
        variant: "destructive",
      });
    }
  }

  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="threat-feed-header"
          eyebrow="Live intelligence"
          title="Latest Threat Feed"
          description={
            <span>
              Pull recent CVEs from NVD (or cache), filter by severity + CVSS, and expand rows for a fast triage
              workflow. Auto-refresh stays non-blocking.
            </span>
          }
          right={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                data-testid="threat-feed-button-refresh"
                onClick={manualRefresh}
                disabled={refreshMutation.isPending}
                className={cn(
                  "rounded-2xl",
                  "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
                  "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5",
                  "active:translate-y-0 active:shadow-md transition-all duration-200 ease-out",
                )}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", refreshMutation.isPending ? "animate-spin" : "")} />
                {refreshMutation.isPending ? "Refreshing…" : "Manual refresh"}
              </Button>
              <Button
                data-testid="threat-feed-button-refetch"
                variant="secondary"
                className="rounded-2xl"
                onClick={() => refetch()}
              >
                <RotateCcw className={cn("h-4 w-4 mr-2", updating ? "animate-spin" : "")} />
                {updating ? "Updating…" : "Re-fetch"}
              </Button>
            </div>
          }
        />

        {/* Controls */}
        <div className="glass rounded-3xl border border-border/70 shadow-soft p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/14 to-accent/10 border border-border/70">
                <Settings2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Feed controls</div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Source, auto-refresh, and triage filters. All changes update instantly—no blocking UI.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/15 px-3 py-2">
                <Signal className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Source</div>
                <div className="flex items-center gap-2">
                  <Button
                    data-testid="threat-feed-source-cache"
                    size="sm"
                    variant={source === "cache" ? "secondary" : "ghost"}
                    className={cn("rounded-xl", source === "cache" ? "bg-muted/35" : "hover:bg-muted/30")}
                    onClick={() => setSource("cache")}
                  >
                    Cache
                  </Button>
                  <Button
                    data-testid="threat-feed-source-nvd"
                    size="sm"
                    variant={source === "nvd" ? "secondary" : "ghost"}
                    className={cn("rounded-xl", source === "nvd" ? "bg-muted/35" : "hover:bg-muted/30")}
                    onClick={() => setSource("nvd")}
                  >
                    NVD
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/15 px-3 py-2">
                <AlarmClock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Auto-refresh</div>
                  <div className="text-sm font-semibold">{autoRefresh ? "On" : "Off"}</div>
                </div>
                <Switch
                  data-testid="threat-feed-toggle-auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={(v) => setAutoRefresh(!!v)}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
            <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-muted/20 to-transparent p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-semibold">Filters</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge data-testid="threat-feed-badge-selected" variant="secondary" className="rounded-full">
                    {selectedSevCount}/4 severity • CVSS ≥ {minCvss.toFixed(1)}
                  </Badge>
                  <Button
                    data-testid="threat-feed-button-reset-filters"
                    variant="ghost"
                    size="sm"
                    className="rounded-xl hover:bg-muted/35"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Minimum CVSS</div>
                    <div className="text-xs text-muted-foreground tabular-nums">{minCvss.toFixed(1)}</div>
                  </div>
                  <Slider
                    data-testid="threat-feed-slider-min-cvss"
                    value={[minCvss]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(v) => setMinCvss(v?.[0] ?? 0)}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Severity</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {severities.map((s) => (
                      <label
                        key={s}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/15 px-3 py-2",
                          "hover:bg-muted/25 transition-colors cursor-pointer select-none",
                        )}
                      >
                        <Checkbox
                          data-testid={`threat-feed-severity-${s}`}
                          checked={selectedSev[s]}
                          onCheckedChange={(v) => setSelectedSev((prev) => ({ ...prev, [s]: !!v }))}
                        />
                        <span className="text-sm font-semibold">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  data-testid="threat-feed-button-apply-filters"
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() =>
                    toast({
                      title: "Filters applied",
                      description: `Showing ${filtered.length} CVEs.`,
                    })
                  }
                >
                  Apply (instant)
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-accent/8 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  <div className="text-sm font-semibold">Auto-refresh interval</div>
                </div>
                <Badge data-testid="threat-feed-badge-updated" variant="outline" className="rounded-full">
                  Updated{" "}
                  {dataUpdatedAt
                    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "—"}
                </Badge>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "30s", v: 30 },
                    { label: "60s", v: 60 },
                    { label: "5m", v: 300 },
                  ].map((x) => (
                    <Button
                      key={x.v}
                      data-testid={`threat-feed-interval-${x.v}`}
                      variant={intervalSec === x.v ? "secondary" : "outline"}
                      className={cn("rounded-2xl", intervalSec === x.v ? "bg-muted/35" : "glass hover:bg-muted/30")}
                      onClick={() => setIntervalSec(x.v)}
                    >
                      {x.label}
                    </Button>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed">
                  When enabled, auto-refresh refetches in the background. You’ll see a subtle “Updating…” pulse—no
                  blocking spinners.
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/15 px-4 py-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="text-sm font-semibold">
                      {autoRefresh ? `Every ${intervalSec}s` : "Manual"}
                    </div>
                  </div>
                  <div className={cn("text-xs font-semibold", updating ? "text-primary" : "text-muted-foreground")}>
                    {updating ? "Updating…" : "Idle"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-chart-3" />
              <div className="text-sm font-semibold">Results</div>
              <Badge data-testid="threat-feed-badge-count" variant="secondary" className="rounded-full">
                {filtered.length} CVEs
              </Badge>
            </div>

            <AnimatePresence>
              {updating && (
                <motion.div
                  data-testid="threat-feed-updating-indicator"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Updating…
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoading ? (
            <ThreatFeedSkeleton rows={10} />
          ) : isError ? (
            <div data-testid="threat-feed-error" className="glass rounded-3xl border border-destructive/30 bg-destructive/10 p-6 shadow-soft">
              <div className="text-lg font-bold tracking-tight">Unable to load threat feed</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {(error as Error)?.message || "Unknown error"}{" "}
                <span className="text-muted-foreground/80">
                  (If NVD is rate-limiting, switch source to Cache.)
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  data-testid="threat-feed-error-retry"
                  className="rounded-2xl"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
                <Button
                  data-testid="threat-feed-error-switch-cache"
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => setSource("cache")}
                >
                  Use cache
                </Button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div data-testid="threat-feed-empty" className="glass rounded-3xl border border-border/70 p-8 shadow-soft">
              <div className="text-lg font-bold tracking-tight">No CVEs match your filters</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Try lowering the minimum CVSS score or re-enabling severities.
              </div>
              <div className="mt-4">
                <Button data-testid="threat-feed-empty-reset" variant="secondary" className="rounded-2xl" onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {filtered.map((raw) => {
                  const item = {
                    cveId: raw.cveId,
                    cvssScoreX10: raw.cvssScoreX10,
                    severity: raw.severity,
                    publishedAt: coerceDate(raw.publishedAt as any),
                    description: raw.description,
                  };
                  const isExpanded = !!expanded[item.cveId];
                  return (
                    <motion.div
                      key={item.cveId}
                      layout
                      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ThreatFeedRow
                        item={item}
                        expanded={isExpanded}
                        onToggle={() => setExpanded((p) => ({ ...p, [item.cveId]: !p[item.cveId] }))}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
