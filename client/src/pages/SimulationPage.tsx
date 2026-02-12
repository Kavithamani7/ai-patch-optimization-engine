import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Gauge, SlidersHorizontal } from "lucide-react";

export default function SimulationPage() {
  const [budget, setBudget] = useState("100");
  const [downtime, setDowntime] = useState("2");
  const [riskTolerance, setRiskTolerance] = useState("0.35");

  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="simulation-header"
          eyebrow="Scenario planning"
          title="What‑if Simulation"
          description="Test constraints and see how optimization output shifts. Use this modal-driven workflow in incident response."
          right={
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  data-testid="simulation-open-modal"
                  className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Open simulator
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[720px] glass border-border/70">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight">What‑if simulator</DialogTitle>
                </DialogHeader>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget ($k)</Label>
                    <Input
                      id="budget"
                      data-testid="simulation-input-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="rounded-2xl"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="downtime">Downtime (hours)</Label>
                    <Input
                      id="downtime"
                      data-testid="simulation-input-downtime"
                      value={downtime}
                      onChange={(e) => setDowntime(e.target.value)}
                      className="rounded-2xl"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="riskTolerance">Risk tolerance</Label>
                    <Input
                      id="riskTolerance"
                      data-testid="simulation-input-risk-tolerance"
                      value={riskTolerance}
                      onChange={(e) => setRiskTolerance(e.target.value)}
                      className="rounded-2xl"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-border/70 bg-muted/15 p-4">
                  <div className="text-sm font-semibold">Preview</div>
                  <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Budget: <span className="text-foreground/90 font-semibold">{budget}</span>k • Downtime:{" "}
                    <span className="text-foreground/90 font-semibold">{downtime}</span>h • Tolerance:{" "}
                    <span className="text-foreground/90 font-semibold">{riskTolerance}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Wire this form to your simulation endpoint to recompute optimization + impact summary.
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 justify-end">
                  <Button
                    data-testid="simulation-run"
                    className="rounded-2xl"
                    onClick={() =>
                      toast({
                        title: "Simulation queued",
                        description: "Recompute optimization with these constraints (wire endpoint).",
                      })
                    }
                  >
                    Run simulation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Scenario</div>
                <div className="mt-1 text-xl font-bold tracking-tight">Operational constraints</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Use the simulator to adjust budget and downtime caps.
                </div>
              </div>
            </div>
            <Button
              data-testid="simulation-quick-open"
              variant="secondary"
              className="mt-5 rounded-2xl"
              onClick={() => toast({ title: "Tip", description: "Use the Open simulator button in the header." })}
            >
              Quick tip
            </Button>
          </Card>

          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Output</div>
            <div className="mt-1 text-xl font-bold tracking-tight">Delta vs baseline</div>
            <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Render simulated patch plan + risk reduction deltas here. The card supports charts, tables, and export CTAs.
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                data-testid="simulation-export"
                variant="outline"
                className="rounded-2xl glass hover:bg-muted/30"
                onClick={() => toast({ title: "Export", description: "Export simulation report (wire endpoint)." })}
              >
                Export report
              </Button>
              <Button
                data-testid="simulation-apply"
                className="rounded-2xl"
                onClick={() => toast({ title: "Applied", description: "Apply simulated plan to optimization workspace." })}
              >
                Apply to optimization
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
