import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardOverview from "@/pages/DashboardOverview";
import ThreatFeedPage from "@/pages/ThreatFeedPage";
import ModelLabPage from "@/pages/ModelLabPage";
import ExplainabilityPage from "@/pages/ExplainabilityPage";
import OptimizationPage from "@/pages/OptimizationPage";
import SimulationPage from "@/pages/SimulationPage";
import HeatmapPage from "@/pages/HeatmapPage";
import ExportsPage from "@/pages/ExportsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardOverview} />
      <Route path="/threat-feed" component={ThreatFeedPage} />
      <Route path="/model-lab" component={ModelLabPage} />
      <Route path="/explainability" component={ExplainabilityPage} />
      <Route path="/optimization" component={OptimizationPage} />
      <Route path="/simulation" component={SimulationPage} />
      <Route path="/heatmap" component={HeatmapPage} />
      <Route path="/exports" component={ExportsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
