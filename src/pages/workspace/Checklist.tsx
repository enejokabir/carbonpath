import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Zap,
  Trash2,
  Truck,
  GraduationCap,
  Shield,
  BarChart3,
  HelpCircle,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import type { ChecklistItem, ChecklistCategory } from "@/types";
import { initializeUserChecklist } from "@/data/demoAccountData";

const categoryConfig: Record<ChecklistCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  documents: { label: "Documentation", icon: FileText, color: "text-blue-600 bg-blue-100" },
  energy: { label: "Energy Management", icon: Zap, color: "text-yellow-600 bg-yellow-100" },
  waste: { label: "Waste Management", icon: Trash2, color: "text-green-600 bg-green-100" },
  supply_chain: { label: "Supply Chain", icon: Truck, color: "text-purple-600 bg-purple-100" },
  training: { label: "Training", icon: GraduationCap, color: "text-orange-600 bg-orange-100" },
  compliance: { label: "Compliance", icon: Shield, color: "text-red-600 bg-red-100" },
  reporting: { label: "Reporting", icon: BarChart3, color: "text-indigo-600 bg-indigo-100" },
};

export default function Checklist() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadChecklist = () => {
      // Check for demo workspace
      const demoWorkspaceData = localStorage.getItem("demo_workspace");
      if (!demoWorkspaceData) {
        navigate("/onboarding");
        return;
      }

      const workspace = JSON.parse(demoWorkspaceData);

      // Load or initialize checklist
      let items = localStorage.getItem("demo_checklist_items");
      if (!items) {
        // Initialize checklist if not exists
        const newItems = initializeUserChecklist(workspace.id, workspace.industry || 'other');
        setChecklistItems(newItems);
      } else {
        setChecklistItems(JSON.parse(items));
      }

      // Expand categories with pending items by default
      const parsed = items ? JSON.parse(items) : [];
      const categoriesWithPending = [...new Set(
        parsed
          .filter((item: ChecklistItem) => item.status !== 'completed')
          .map((item: ChecklistItem) => item.category)
      )];
      setExpandedCategories(categoriesWithPending as string[]);

      setLoading(false);
    };

    loadChecklist();
  }, [navigate]);

  const handleToggleItem = (itemId: string) => {
    const updatedItems = checklistItems.map(item => {
      if (item.id === itemId) {
        const newStatus = item.status === 'completed' ? 'pending' : 'completed';
        return {
          ...item,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        };
      }
      return item;
    });

    setChecklistItems(updatedItems);
    localStorage.setItem("demo_checklist_items", JSON.stringify(updatedItems));

    // Update readiness score
    const completedCount = updatedItems.filter(i => i.status === 'completed').length;
    const totalCount = updatedItems.length;
    const scoreData = localStorage.getItem("demo_readiness_score");
    if (scoreData) {
      const score = JSON.parse(scoreData);
      score.completed_checklist_items = completedCount;
      score.total_checklist_items = totalCount;
      score.checklist_score = Math.round((completedCount / totalCount) * 100);
      score.overall_score = Math.round(
        (score.evidence_score * 0.25 + score.freshness_score * 0.25 +
         score.checklist_score * 0.30 + score.obligations_score * 0.20)
      );
      localStorage.setItem("demo_readiness_score", JSON.stringify(score));
    }

    const item = updatedItems.find(i => i.id === itemId);
    if (item?.status === 'completed') {
      toast.success(`Completed: ${item.title}`);
    }
  };

  // Group items by category
  const groupedItems = checklistItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Calculate stats
  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter(i => i.status === 'completed').length;
  const requiredItems = checklistItems.filter(i => i.is_required);
  const completedRequired = requiredItems.filter(i => i.status === 'completed').length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (loading) {
    return (
      <WorkspaceLayout title="Compliance Checklist">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      title="Compliance Checklist"
      description="Track your sustainability compliance progress"
    >
      {/* Progress Overview */}
      <Card className="mb-6 border-sage-light/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Overall Progress</h3>
                <span className="text-2xl font-bold text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3 mb-3" />
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {completedItems} completed
                </span>
                <span className="flex items-center gap-1">
                  <Circle className="w-4 h-4 text-muted-foreground" />
                  {totalItems - completedItems} remaining
                </span>
              </div>
            </div>

            {/* Required items status */}
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Required Items</span>
              </div>
              <p className="text-sm text-orange-700">
                {completedRequired} of {requiredItems.length} required items completed
              </p>
              {completedRequired < requiredItems.length && (
                <p className="text-xs text-orange-600 mt-1">
                  Complete required items first for compliance readiness
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const items = groupedItems[key] || [];
          const completed = items.filter(i => i.status === 'completed').length;
          return (
            <Badge
              key={key}
              variant="outline"
              className={`${config.color} border-current/20`}
            >
              <config.icon className="w-3 h-3 mr-1" />
              {config.label}: {completed}/{items.length}
            </Badge>
          );
        })}
      </div>

      {/* Checklist Items by Category */}
      <Accordion
        type="multiple"
        value={expandedCategories}
        onValueChange={setExpandedCategories}
        className="space-y-4"
      >
        {Object.entries(groupedItems)
          .sort(([, a], [, b]) => (a[0]?.order || 0) - (b[0]?.order || 0))
          .map(([category, items]) => {
            const config = categoryConfig[category as ChecklistCategory];
            const completedInCategory = items.filter(i => i.status === 'completed').length;
            const allComplete = completedInCategory === items.length;

            return (
              <AccordionItem
                key={category}
                value={category}
                className="border border-border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <config.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium">{config.label}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          value={(completedInCategory / items.length) * 100}
                          className="h-1.5 w-24"
                        />
                        <span className="text-xs text-muted-foreground">
                          {completedInCategory}/{items.length}
                        </span>
                      </div>
                    </div>
                    {allComplete && (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <div className="divide-y divide-border">
                    {items
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 transition-colors ${
                            item.status === 'completed' ? 'bg-green-50/50' : 'hover:bg-muted/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={item.status === 'completed'}
                              onCheckedChange={() => handleToggleItem(item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`font-medium ${
                                    item.status === 'completed'
                                      ? 'line-through text-muted-foreground'
                                      : ''
                                  }`}
                                >
                                  {item.title}
                                </span>
                                {item.is_required && (
                                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                              {item.help_text && (
                                <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                  <div className="flex items-start gap-2">
                                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-sm text-blue-800">{item.help_text}</p>
                                      {item.help_link && (
                                        <Link
                                          to={item.help_link}
                                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
                                        >
                                          Learn more
                                          <ExternalLink className="w-3 h-3" />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {item.status === 'completed' && item.completed_at && (
                                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                  Completed {new Date(item.completed_at).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>

      {/* Help Section */}
      <Card className="mt-8 border-sage-light/20 bg-gradient-to-r from-primary/5 to-sage-light/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Need help completing your checklist?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our Learn Hub has guides for each item, or connect with a consultant for hands-on support.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/learn">
                    Visit Learn Hub
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/consultants">
                    Find a Consultant
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </WorkspaceLayout>
  );
}
