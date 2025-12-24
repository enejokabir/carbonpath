import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  CheckCircle2,
  UserPlus,
  FileEdit,
  Trash2,
  UserCheck,
  MessageSquare,
  FolderOpen,
  Calendar,
  Users,
} from "lucide-react";
import type { ActivityItem, ActivityAction, ActivityTargetType } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showHeader?: boolean;
  compact?: boolean;
}

const actionIcons: Record<ActivityAction, React.ComponentType<{ className?: string }>> = {
  uploaded: Upload,
  updated: FileEdit,
  deleted: Trash2,
  completed: CheckCircle2,
  assigned: UserCheck,
  unassigned: UserCheck,
  commented: MessageSquare,
  invited: UserPlus,
  joined: Users,
  created: FolderOpen,
};

const targetIcons: Record<ActivityTargetType, React.ComponentType<{ className?: string }>> = {
  evidence: FolderOpen,
  checklist: CheckCircle2,
  obligation: Calendar,
  member: Users,
  workspace: FolderOpen,
};

const actionColors: Record<ActivityAction, string> = {
  uploaded: "bg-green-100 text-green-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
  assigned: "bg-purple-100 text-purple-700",
  unassigned: "bg-gray-100 text-gray-700",
  commented: "bg-blue-100 text-blue-700",
  invited: "bg-purple-100 text-purple-700",
  joined: "bg-green-100 text-green-700",
  created: "bg-blue-100 text-blue-700",
};

const actionLabels: Record<ActivityAction, string> = {
  uploaded: "uploaded",
  updated: "updated",
  deleted: "deleted",
  completed: "completed",
  assigned: "assigned",
  unassigned: "unassigned",
  commented: "commented on",
  invited: "invited",
  joined: "joined",
  created: "created",
};

export function ActivityFeed({
  activities,
  maxItems = 10,
  showHeader = true,
  compact = false,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <Card>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Team Activity</CardTitle>
          </CardHeader>
        )}
        <CardContent className={compact ? "py-4" : ""}>
          <div className="text-center text-muted-foreground py-6">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">
              Activity will appear here as your team works
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            Team Activity
            <Badge variant="secondary" className="text-xs">
              {activities.length} recent
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "py-2" : ""}>
        <div className="space-y-4">
          {displayActivities.map((activity) => {
            const ActionIcon = actionIcons[activity.action];
            const TargetIcon = targetIcons[activity.target_type];

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 text-sm"
              >
                {/* Avatar/Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    actionColors[activity.action]
                  }`}
                >
                  <ActionIcon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="leading-snug">
                    <span className="font-medium">{activity.user_name}</span>{" "}
                    <span className="text-muted-foreground">
                      {actionLabels[activity.action]}
                    </span>{" "}
                    <span className="font-medium">{activity.target_title}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs py-0 px-1.5">
                      <TargetIcon className="w-3 h-3 mr-1" />
                      {activity.target_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length > maxItems && (
          <div className="mt-4 pt-3 border-t border-border text-center">
            <button className="text-sm text-primary hover:underline">
              View all {activities.length} activities
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper to create demo activity items
export function createDemoActivity(
  action: ActivityAction,
  targetType: ActivityTargetType,
  targetTitle: string,
  userName: string = "Demo User"
): ActivityItem {
  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workspace_id: "demo-workspace",
    user_id: "demo-user",
    user_name: userName,
    action,
    target_type: targetType,
    target_id: `${targetType}-${Date.now()}`,
    target_title: targetTitle,
    created_at: new Date().toISOString(),
  };
}

// Helper to log activity to localStorage (demo mode)
export function logActivity(activity: ActivityItem): void {
  const stored = localStorage.getItem("demo_activities");
  const activities: ActivityItem[] = stored ? JSON.parse(stored) : [];
  activities.unshift(activity);
  // Keep only last 50 activities
  localStorage.setItem(
    "demo_activities",
    JSON.stringify(activities.slice(0, 50))
  );
}

// Helper to get activities from localStorage (demo mode)
export function getStoredActivities(): ActivityItem[] {
  const stored = localStorage.getItem("demo_activities");
  return stored ? JSON.parse(stored) : [];
}
