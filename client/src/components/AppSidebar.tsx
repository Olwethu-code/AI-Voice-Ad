import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, Sparkles, Zap, Image as ImageIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AppSidebar({ open, onOpenChange }: AppSidebarProps) {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { icon: Zap, label: "Generate Text", path: "/text" },
    { icon: ImageIcon, label: "Generate Image", path: "/image" },
    { icon: HelpCircle, label: "Tutorial", path: "/tutorial" },
  ];

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">PromoVoice</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(!open)}
          data-testid="button-sidebar-toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 lg:top-0 h-[calc(100vh-64px)] lg:h-screen w-64 bg-card border-r border-border z-40 transform transition-transform duration-300 lg:translate-x-0 lg:relative ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">PromoVoice</h1>
              <p className="text-xs text-muted-foreground">AI Voice Ads</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => {
                    setLocation(item.path);
                    onOpenChange(false);
                  }}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  data-testid={`nav-${item.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="text-xs text-muted-foreground space-y-2 pt-6 border-t border-border">
            <p className="font-medium text-foreground">Quick Tip</p>
            <p>Generate professional AI voice ads in seconds. Download and share anywhere.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
