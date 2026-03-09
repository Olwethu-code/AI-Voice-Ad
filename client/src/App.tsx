import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";
import GenerateTextPage from "./pages/GenerateTextPage";
import GenerateImagePage from "./pages/GenerateImagePage";
import TutorialPage from "./pages/TutorialPage";
import AppSidebar from "./components/AppSidebar";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={GenerateTextPage} />
      <Route path="/text" component={GenerateTextPage} />
      <Route path="/image" component={GenerateImagePage} />
      <Route path="/tutorial" component={TutorialPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <Router />
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
