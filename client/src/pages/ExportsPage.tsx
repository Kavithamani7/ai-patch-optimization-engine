import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, FileDown, FileSpreadsheet, Printer } from "lucide-react";

export default function ExportsPage() {
  return (
    <AppShell>
      <div className="space-y-6 lg:space-y-8">
        <SectionHeader
          data-testid="exports-header"
          eyebrow="Reporting"
          title="Exports & Reports"
          description="Generate CSV and PDF exports for stakeholders. Hook these buttons to your existing export endpoints."
          right={
            <Button
              data-testid="exports-button-generate"
              className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              onClick={() => toast({ title: "Report generated", description: "Queued report generation (wire backend)." })}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">CSV</div>
                <div className="mt-1 text-xl font-bold tracking-tight">Export dataset</div>
                <div className="mt-1 text-sm text-muted-foreground">For analysts and BI workflows.</div>
              </div>
            </div>
            <Button
              data-testid="exports-csv"
              className="mt-5 rounded-2xl"
              onClick={() => toast({ title: "CSV export", description: "Download started (wire endpoint)." })}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </Card>

          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-2xl bg-accent/10 border border-accent/20">
                <Printer className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">PDF</div>
                <div className="mt-1 text-xl font-bold tracking-tight">Executive report</div>
                <div className="mt-1 text-sm text-muted-foreground">Business impact + plan summary.</div>
              </div>
            </div>
            <Button
              data-testid="exports-pdf"
              variant="secondary"
              className="mt-5 rounded-2xl"
              onClick={() => toast({ title: "PDF export", description: "PDF generated (wire endpoint)." })}
            >
              Export PDF
            </Button>
          </Card>

          <Card className="glass rounded-3xl border border-border/70 shadow-soft p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Automation</div>
            <div className="mt-1 text-xl font-bold tracking-tight">Scheduled delivery</div>
            <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Add scheduled exports to email or SIEM. This card is ready for a cron + endpoint integration.
            </div>
            <Button
              data-testid="exports-schedule"
              variant="outline"
              className="mt-5 rounded-2xl glass hover:bg-muted/30"
              onClick={() =>
                toast({ title: "Schedule", description: "Open scheduling UI (implement as needed)." })
              }
            >
              Configure schedule
            </Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
