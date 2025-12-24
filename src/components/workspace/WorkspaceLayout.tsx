import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { ChecklistItem } from "@/types";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function WorkspaceLayout({ children, title, description }: WorkspaceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved === "true";
  });
  const [isMobile, setIsMobile] = useState(false);
  const { workspace, readinessScore, members } = useWorkspace();

  // Demo checklist items - in production, fetch from database
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Save collapsed state to localStorage
  const toggleSidebarCollapsed = () => {
    const newValue = !sidebarCollapsed;
    setSidebarCollapsed(newValue);
    localStorage.setItem("sidebar_collapsed", String(newValue));
  };

  useEffect(() => {
    // Check for mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Load checklist items from localStorage (demo mode)
    const storedChecklist = localStorage.getItem("demo_checklist_items");
    if (storedChecklist) {
      setChecklistItems(JSON.parse(storedChecklist));
    }
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      const handleClickOutside = (e: MouseEvent) => {
        const sidebar = document.getElementById("workspace-sidebar");
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setSidebarOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sidebarOpen, isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20 flex flex-col">
      <Header />

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <WorkspaceSidebar
              readinessScore={readinessScore}
              checklistItems={checklistItems}
              memberCount={members?.length || 1}
              collapsed={sidebarCollapsed}
              onToggleCollapse={toggleSidebarCollapsed}
            />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && isMobile && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div
              id="workspace-sidebar"
              className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-xl"
            >
              <WorkspaceSidebar
                readinessScore={readinessScore}
                checklistItems={checklistItems}
                memberCount={members?.length || 1}
                onClose={() => setSidebarOpen(false)}
                isMobile
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile header with menu button */}
          <div className="lg:hidden sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 py-3 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="shrink-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
              {title && (
                <div className="min-w-0">
                  <h1 className="font-semibold truncate">{title}</h1>
                  {description && (
                    <p className="text-xs text-muted-foreground truncate">{description}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Page content */}
          <div className="container mx-auto px-4 py-6 lg:py-8">
            {/* Desktop page header */}
            {title && (
              <div className="hidden lg:block mb-8">
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && (
                  <p className="text-muted-foreground mt-1">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
