import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <AppShell>
      <div className="glass rounded-3xl border border-border/70 shadow-soft p-8 sm:p-10 text-center">
        <div className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/25">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          The route you requested doesn’t exist. Use the navigation rail to get back on track.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/"
            data-testid="notfound-home"
            className="inline-flex"
          >
            <Button className="rounded-2xl">Go to overview</Button>
          </Link>
          <Link href="/threat-feed" data-testid="notfound-feed" className="inline-flex">
            <Button variant="secondary" className="rounded-2xl">Threat feed</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
