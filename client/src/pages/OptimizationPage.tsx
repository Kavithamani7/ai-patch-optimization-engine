import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Boxes, CheckCircle2, Layers3, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function OptimizationPage() {
  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="optimization-header"
          eyebrow="Decisioning"
          title="Knapsack Optimization"
          description="Optimize patch selection under constrained capacity—maximize risk reduction while respecting business cost."
          right={
            <Button
              data-testid="optimization-button-run"
              className="rounded-2xl bg-gradient-to-r from-chart-3 to-chart-3/80 text-background shadow-lg shadow-chart-3/15 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              onClick={() =>
                toast({
                  title: "Optimization started",
                  description: "Compute optimal patch set (connect your endpoint).",
                })
              }
            >
              <Zap className="h-4 w-4 mr-2" />
              Run optimization
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center h-11 w-11 rounded-2xl bg-chart-3/10 border border-chart-3/20">
                  <Boxes className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Plan</div>
                  <div className="mt-1 text-xl font-bold tracking-tight">Recommended patch bundle</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Placeholder list—wire to your knapsack output.
                  </div>
                </div>
              </div>
              <Badge data-testid="optimization-badge" variant="secondary" className="rounded-full">
                Draft
              </Badge>
            </div>

            <div className="mt-5 grid gap-3">
              {["Edge gateway firmware", "OpenSSL lib upgrade", "Windows monthly rollup", "Container runtime patch"].map(
                (x) => (
                  <div
                    key={x}
                    className="rounded-2xl border border-border/70 bg-muted/15 hover:bg-muted/25 transition-colors p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{x}</div>
                      <div className="text-xs text-muted-foreground">ΔRisk: +12%</div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Capacity impact: <span className="text-foreground/90 font-semibold">medium</span> • ETA 2h
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                data-testid="optimization-button-approve"
                className="rounded-2xl"
                onClick={() => toast({ title: "Approved", description: "Patch bundle approved (wire to workflow)." })}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve plan
              </Button>
              <Button
                data-testid="optimization-button-export"
                variant="outline"
                className="rounded-2xl glass hover:bg-muted/30"
                onClick={() => toast({ title: "Export", description: "Export plan to CSV/PDF (wire endpoint)." })}
              >
                Export plan
              </Button>
            </div>
          </Card>

          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20">
                <Layers3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Constraints</div>
                <div className="mt-1 text-xl font-bold tracking-tight">Capacity</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Tune available effort and acceptable downtime.
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-border/70 bg-muted/15 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Weekly patch hours</span>
                  <span className="font-semibold tabular-nums">12h</span>
                </div>
                <Progress className="mt-3 h-2" value={60} />
                <div className="mt-2 text-xs text-muted-foreground">Using 7.2h in the current plan.</div>
              </div>

              <Button
                data-testid="optimization-button-adjust"
                variant="secondary"
                className="rounded-2xl"
                onClick={() =>
                  toast({
                    title: "Adjust constraints",
                    description: "Open a constraints editor (implement as needed).",
                  })
                }
              >
                Adjust constraints
              </Button>
            </div>
          </Card>
        </div>

        <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Impact</div>
          <div className="mt-2 text-lg font-bold tracking-tight">Business impact summary</div>
          <div className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Present the optimized plan in executive language: risk reduced, effort required, and operational tradeoffs.
            This card is a ready-made container for your existing summary output.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
