import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BrainCircuit, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default function ModelLabPage() {
  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="model-lab-header"
          eyebrow="ML"
          title="Model Lab (RF vs GBM)"
          description="Compare model performance and select a champion for patch prioritization. (UI wired; backend metrics endpoint may be integrated later.)"
          right={
            <Button
              data-testid="model-lab-button-run"
              className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              onClick={() =>
                toast({
                  title: "Benchmark started",
                  description: "Running evaluation… (hook up to your model endpoint when ready)",
                })
              }
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Run benchmark
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {[
            { name: "Random Forest", auc: 0.91, f1: 0.84, latency: 58, tone: "from-primary/16 to-transparent" },
            { name: "Gradient Boosting", auc: 0.93, f1: 0.86, latency: 72, tone: "from-accent/16 to-transparent" },
          ].map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`grid place-items-center h-11 w-11 rounded-2xl border border-border/70 bg-gradient-to-br ${m.tone}`}>
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Model</div>
                      <div className="mt-1 text-xl font-bold tracking-tight">{m.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Stable scoring for CVE prioritization.
                      </div>
                    </div>
                  </div>
                  <Badge data-testid={`model-lab-badge-${m.name}`} variant="secondary" className="rounded-full">
                    AUC {m.auc.toFixed(2)}
                  </Badge>
                </div>

                <div className="mt-5 grid gap-3">
                  <MetricRow label="F1 score" value={m.f1.toFixed(2)} />
                  <MetricRow label="p95 latency" value={`${m.latency}ms`} />
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Confidence</span>
                      <span className="tabular-nums">{Math.round(m.auc * 100)}%</span>
                    </div>
                    <Progress value={m.auc * 100} className="mt-2 h-2" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    data-testid={`model-lab-button-select-${m.name}`}
                    className="rounded-2xl"
                    variant="secondary"
                    onClick={() =>
                      toast({
                        title: "Model selected",
                        description: `${m.name} marked as the active scorer.`,
                      })
                    }
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Select model
                  </Button>
                  <Button
                    data-testid={`model-lab-button-details-${m.name}`}
                    className="rounded-2xl"
                    variant="outline"
                    onClick={() =>
                      toast({
                        title: "Details",
                        description: "Open detailed confusion matrix + calibration (add endpoint).",
                      })
                    }
                  >
                    View details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Notes</div>
          <div className="mt-2 text-lg font-bold tracking-tight">Production wiring</div>
          <div className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            This page is designed to connect to your existing FastAPI evaluation endpoints. Wire actions to your
            model-comparison APIs and replace the placeholder metrics with live results—UI and states are already polished.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
