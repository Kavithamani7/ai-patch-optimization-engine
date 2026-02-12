import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BarChart3, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExplainabilityPage() {
  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="shap-header"
          eyebrow="Explainability"
          title="SHAP: Global + Local Insights"
          description="Understand why the model prioritizes patches: top drivers globally, then inspect individual CVEs for local attribution."
          right={
            <div className="flex items-center gap-2">
              <Button
                data-testid="shap-button-run-global"
                className="rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200"
                onClick={() =>
                  toast({
                    title: "Global SHAP started",
                    description: "Compute global feature importance (connect your endpoint).",
                  })
                }
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Run global
              </Button>
              <Button
                data-testid="shap-button-run-local"
                variant="secondary"
                className="rounded-2xl"
                onClick={() =>
                  toast({
                    title: "Local SHAP started",
                    description: "Compute local explanation for selected CVE (connect your endpoint).",
                  })
                }
              >
                <Target className="h-4 w-4 mr-2" />
                Run local
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Global</div>
                <div className="mt-2 text-xl font-bold tracking-tight">Feature importance</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  High-impact signals across the dataset.
                </div>
              </div>
              <Badge data-testid="shap-badge-global" variant="secondary" className="rounded-full">
                Ready
              </Badge>
            </div>

            <div className="mt-5 rounded-2xl border border-border/70 bg-muted/15 p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <div className="text-sm font-semibold">Placeholder chart container</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Swap this with your SHAP summary plot rendering (image or SVG). The layout is intentionally designed to
                support a full-width chart with legend, filters, and export buttons.
              </div>
              <Button
                data-testid="shap-button-export-global"
                variant="outline"
                className="mt-4 rounded-2xl glass hover:bg-muted/30"
                onClick={() =>
                  toast({
                    title: "Export queued",
                    description: "Export global SHAP plot (wire to PDF/PNG).",
                  })
                }
              >
                Export global plot
              </Button>
            </div>
          </Card>

          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Local</div>
            <div className="mt-2 text-xl font-bold tracking-tight">CVE drilldown</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Explain a single CVE with force / waterfall views.
            </div>

            <div className="mt-5 rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 to-transparent p-4">
              <div className="text-sm font-semibold">Select a CVE from Threat Feed</div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                In production, clicking a CVE row can route here with a query param. Then run local SHAP and render the
                explanation plot in this space.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  data-testid="shap-button-open-feed"
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => (window.location.href = "/threat-feed")}
                >
                  Open Threat Feed
                </Button>
                <Button
                  data-testid="shap-button-copy-link"
                  variant="outline"
                  className="rounded-2xl glass hover:bg-muted/30"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast({ title: "Link copied", description: "Shareable explainability URL copied to clipboard." });
                  }}
                >
                  Copy link
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Business impact</div>
          <div className="mt-2 text-lg font-bold tracking-tight">Make explainability actionable</div>
          <div className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            SHAP isn’t just interpretability—it’s governance. Use the global drivers to tune policy, and local drilldowns
            to justify patch decisions during change control.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
