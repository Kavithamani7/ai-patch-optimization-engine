import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Activity, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

const levels = [
  { label: "Low", cls: "bg-chart-4/25 border-chart-4/25" },
  { label: "Med", cls: "bg-accent/18 border-accent/25" },
  { label: "High", cls: "bg-chart-3/22 border-chart-3/25" },
  { label: "Crit", cls: "bg-destructive/20 border-destructive/25" },
];

export default function HeatmapPage() {
  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="heatmap-header"
          eyebrow="Visualization"
          title="Risk Heatmap"
          description="A fast visual matrix for severity vs exposure. Replace the grid with your existing heatmap component if needed."
          right={
            <Button
              data-testid="heatmap-button-recompute"
              variant="secondary"
              className="rounded-2xl"
              onClick={() => toast({ title: "Recompute", description: "Recompute heatmap (wire to endpoint)." })}
            >
              <Activity className="h-4 w-4 mr-2" />
              Recompute
            </Button>
          }
        />

        <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-primary" />
            <div className="text-sm font-semibold">Matrix</div>
          </div>

          <div className="mt-5 grid grid-cols-6 gap-2">
            {Array.from({ length: 36 }).map((_, i) => {
              const lvl = levels[(i + (i % 5)) % levels.length];
              return (
                <button
                  key={i}
                  data-testid={`heatmap-cell-${i}`}
                  onClick={() => toast({ title: "Cell selected", description: `Clicked bucket: ${lvl.label}` })}
                  className={cn(
                    "aspect-square rounded-2xl border transition-all duration-300",
                    "hover:-translate-y-0.5 hover:shadow-lift focus-ring",
                    lvl.cls,
                  )}
                  aria-label={`Heatmap cell ${i}`}
                />
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {levels.map((l) => (
              <div key={l.label} className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/15 px-3 py-1.5">
                <div className={cn("h-3 w-3 rounded-full border", l.cls)} />
                <div className="text-xs text-muted-foreground">{l.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
