import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  Settings,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  HelpCircle,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import type { ReadinessScore, ChecklistItem } from "@/types";

interface WorkspaceSidebarProps {
  readinessScore: ReadinessScore | null;
  checklistItems?: ChecklistItem[];
  memberCount?: number;
  onClose?: () => void;
  isMobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function WorkspaceSidebar({
  readinessScore,
  checklistItems = [],
  memberCount = 1,
  onClose,
  isMobile = false,
  collapsed = false,
  onToggleCollapse,
}: WorkspaceSidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: "/workspace/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/workspace/checklist", label: "Checklist", icon: CheckCircle2 },
    { path: "/workspace/evidence", label: "Evidence Locker", icon: FolderOpen },
    { path: "/workspace/calendar", label: "Compliance Calendar", icon: Calendar },
    { path: "/workspace/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Calculate checklist progress
  const completedItems = checklistItems.filter((item) => item.status === "completed").length;
  const totalItems = checklistItems.length || 17; // Default to standard checklist size
  const checklistProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Get pending required items
  const pendingRequired = checklistItems.filter(
    (item) => item.is_required && item.status !== "completed"
  );

  // Calculate readiness color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Progressing";
    return "Getting Started";
  };

  // Wrapper for nav items when collapsed (shows tooltip)
  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const linkContent = (
      <Link
        to={item.path}
        onClick={isMobile ? onClose : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          collapsed && !isMobile && "justify-center px-2",
          isActive(item.path)
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {(!collapsed || isMobile) && <span>{item.label}</span>}
      </Link>
    );

    if (collapsed && !isMobile) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col h-full transition-all duration-300",
        isMobile ? "w-full" : collapsed ? "w-16" : "w-72"
      )}
    >
      {/* Mobile close button */}
      {isMobile && onClose && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold">Workspace Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Collapse toggle button (desktop only) */}
      {!isMobile && onToggleCollapse && (
        <div className={cn("p-2 border-b border-border", collapsed ? "flex justify-center" : "flex justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Readiness Score */}
      <div className={cn("border-b border-border", collapsed && !isMobile ? "p-2" : "p-4")}>
        {collapsed && !isMobile ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/workspace/dashboard"
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted",
                  getScoreColor(readinessScore?.overall_score || 0)
                )}
              >
                <span className="text-xl font-bold">{readinessScore?.overall_score || 0}%</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              <div className="text-sm">
                <p className="font-medium">Readiness Score</p>
                <p className="text-muted-foreground">{getScoreLabel(readinessScore?.overall_score || 0)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Readiness Score</span>
              <Link
                to="/workspace/dashboard"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View Details
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "text-3xl font-bold",
                  getScoreColor(readinessScore?.overall_score || 0)
                )}
              >
                {readinessScore?.overall_score || 0}%
              </div>
              <div className="flex-1">
                <Progress
                  value={readinessScore?.overall_score || 0}
                  className="h-2"
                />
                <p
                  className={cn(
                    "text-xs mt-1",
                    getScoreColor(readinessScore?.overall_score || 0)
                  )}
                >
                  {getScoreLabel(readinessScore?.overall_score || 0)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </nav>

      {/* Checklist Progress - hide when collapsed */}
      {(!collapsed || isMobile) && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Checklist Progress</span>
            <Badge variant="secondary" className="text-xs">
              {completedItems}/{totalItems}
            </Badge>
          </div>
          <Progress value={checklistProgress} className="h-2 mb-3" />

          {/* Quick status indicators */}
          <div className="space-y-2 text-xs">
            {pendingRequired.length > 0 && (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-3 h-3" />
                <span>{pendingRequired.length} required items pending</span>
              </div>
            )}
            {readinessScore && readinessScore.expiring_evidence_items > 0 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock className="w-3 h-3" />
                <span>{readinessScore.expiring_evidence_items} documents expiring soon</span>
              </div>
            )}
            {readinessScore && readinessScore.overdue_obligations > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-3 h-3" />
                <span>{readinessScore.overdue_obligations} overdue obligations</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats - show compact version when collapsed */}
      {collapsed && !isMobile ? (
        <div className="p-2 border-t border-border space-y-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <FolderOpen className="w-4 h-4 text-primary mb-1" />
                <span className="text-sm font-bold text-primary">
                  {readinessScore?.total_evidence_items || 0}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Evidence Items</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                <Users className="w-4 h-4 text-primary mb-1" />
                <span className="text-sm font-bold text-primary">{memberCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Team Members</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-lg font-bold text-primary">
                {readinessScore?.total_evidence_items || 0}
              </div>
              <div className="text-xs text-muted-foreground">Evidence Items</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-lg font-bold text-primary">{memberCount}</div>
              <div className="text-xs text-muted-foreground">Team Members</div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className={cn("mt-auto border-t border-border", collapsed && !isMobile ? "p-2" : "p-4")}>
        {collapsed && !isMobile ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/learn"
                className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Need help? Visit Learn Hub</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            to="/learn"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Need help? Visit Learn Hub
          </Link>
        )}
      </div>
    </aside>
  );
}
