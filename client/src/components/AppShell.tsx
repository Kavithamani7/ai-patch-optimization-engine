import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  Boxes,
  BrainCircuit,
  Download,
  Flame,
  Gauge,
  LayoutGrid,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const nav = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/threat-feed", label: "Threat Feed", icon: Flame },
  { href: "/model-lab", label: "Model Lab", icon: BrainCircuit },
  { href: "/explainability", label: "SHAP", icon: Sparkles },
  { href: "/optimization", label: "Optimization", icon: Boxes },
  { href: "/simulation", label: "What‑if", icon: Gauge },
  { href: "/heatmap", label: "Heatmap", icon: Activity },
  { href: "/exports", label: "Exports", icon: Download },
];

function useActivePath() {
  const [loc] = useLocation();
  return loc;
}

function ThemePill() {
  return (
    <div className="glass shadow-soft rounded-2xl px-3 py-2 border border-border/70">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_6px_hsl(var(--primary)/0.12)]" />
        <span className="text-xs text-muted-foreground">Dark Ops</span>
        <span className="text-xs font-semibold text-foreground">Active</span>
      </div>
    </div>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const active = useActivePath();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [active]);

  const activeLabel = useMemo(() => nav.find((n) => n.href === active)?.label ?? "Dashboard", [active]);

  return (
    <div className="min-h-screen bg-aurora grain">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/35 via-accent/20 to-chart-3/25 blur-xl" />
              <div className="relative glass rounded-2xl px-4 py-3 shadow-lift">
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/22 to-accent/18 border border-border/70">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] text-muted-foreground">AI Patch Optimization Engine</div>
                    <div className="text-lg sm:text-xl font-bold tracking-tight">
                      Sentinel PatchOps
                      <span className="ml-2 text-xs font-semibold text-primary/90 align-middle">NVD‑Aware</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center gap-2 ml-2">
              <ThemePill />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <div className="glass rounded-2xl border border-border/70 px-3 py-2 shadow-soft">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Telemetry</span>
                  <span className="text-xs font-semibold text-foreground">Operational</span>
                </div>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    data-testid="button-open-threat-feed"
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={() => (window.location.href = "/threat-feed")}
                  >
                    <Flame className="h-4 w-4 mr-2" />
                    Threat Feed
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Live NVD-sourced CVEs with filters, auto-refresh, and expand/collapse drilldown.
                </TooltipContent>
              </Tooltip>
            </div>

            <Button
              data-testid="button-mobile-menu"
              variant="outline"
              className="md:hidden rounded-2xl glass hover:bg-muted/40"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="sr-only">Open menu</span>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 lg:gap-8">
          <aside className="hidden lg:block">
            <nav className="glass rounded-3xl border border-border/70 shadow-soft p-3">
              <div className="px-3 py-3">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Command Deck</div>
                <div className="mt-1 text-sm text-foreground/90">
                  <span className="font-semibold">{activeLabel}</span>
                  <span className="text-muted-foreground"> — hardened workflows</span>
                </div>
              </div>

              <div className="mt-2 grid gap-1">
                {nav.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = active === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-testid={`nav-${item.href}`}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-300 ease-out",
                        "hover:bg-muted/40 hover:shadow-[0_12px_40px_-30px_rgba(0,0,0,0.9)]",
                        isActive
                          ? "bg-gradient-to-r from-primary/16 via-primary/10 to-accent/10 border border-primary/20 glow-ring"
                          : "border border-transparent",
                      )}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      <div
                        className={cn(
                          "grid place-items-center h-9 w-9 rounded-xl border transition-all duration-300",
                          isActive
                            ? "bg-primary/12 border-primary/25"
                            : "bg-muted/25 border-border/70 group-hover:border-border",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div className="flex-1">
                        <div className={cn("font-semibold", isActive ? "text-foreground" : "text-foreground/90")}>
                          {item.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.href === "/"
                            ? "KPI + impact snapshot"
                            : item.href === "/threat-feed"
                              ? "Latest CVEs"
                              : item.href === "/model-lab"
                                ? "RF vs GBM"
                                : item.href === "/explainability"
                                  ? "Global + local"
                                  : item.href === "/optimization"
                                    ? "Knapsack plan"
                                    : item.href === "/simulation"
                                      ? "What‑if controls"
                                      : item.href === "/heatmap"
                                        ? "Risk matrix"
                                        : "CSV + PDF reports"}
                        </div>
                      </div>
                      <div className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                        →
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 px-3 py-3 rounded-2xl border border-border/70 bg-gradient-to-br from-muted/25 to-transparent">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-chart-3/15 to-primary/10 border border-border/70">
                    <Sparkles className="h-4 w-4 text-chart-3" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Pro tip</div>
                    <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Use <span className="text-foreground/90 font-semibold">auto-refresh</span> in Threat Feed during
                      incident response—new CVEs arrive fast.
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          <main className="min-w-0">
            {/* Mobile nav */}
            {mobileOpen && (
              <div className="lg:hidden mb-4">
                <div className="glass rounded-3xl border border-border/70 shadow-soft p-3">
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Menu</div>
                    <Button
                      data-testid="button-close-mobile-menu"
                      size="sm"
                      variant="ghost"
                      className="rounded-xl hover:bg-muted/40"
                      onClick={() => setMobileOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="mt-2 grid gap-1">
                    {nav.map((item) => {
                      const Icon = item.icon;
                      const isActive = active === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm border transition-all duration-300",
                            isActive
                              ? "bg-primary/12 border-primary/20"
                              : "bg-transparent border-border/0 hover:border-border/70 hover:bg-muted/35",
                          )}
                        >
                          <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className="font-semibold">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="animate-float-in"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
