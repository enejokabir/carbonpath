import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  UserPlus,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import type { WorkspaceMember, ChecklistItem, TaskAssignment } from "@/types";
import { toast } from "sonner";

interface TaskAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklistItem: ChecklistItem | null;
  members: WorkspaceMember[];
  currentUserId: string;
  onAssign: (assignment: Omit<TaskAssignment, "id" | "assigned_at" | "completed_at">) => void;
}

export function TaskAssignmentDialog({
  open,
  onOpenChange,
  checklistItem,
  members,
  currentUserId,
  onAssign,
}: TaskAssignmentDialogProps) {
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleAssign = () => {
    if (!selectedMember || !checklistItem) {
      toast.error("Please select a team member");
      return;
    }

    onAssign({
      workspace_id: checklistItem.workspace_id,
      checklist_item_id: checklistItem.id,
      assigned_to: selectedMember,
      assigned_by: currentUserId,
      due_date: dueDate || null,
      notes: notes || null,
      status: "pending",
    });

    // Reset form
    setSelectedMember("");
    setDueDate("");
    setNotes("");
    onOpenChange(false);
    toast.success("Task assigned successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Assign this checklist item to a team member
          </DialogDescription>
        </DialogHeader>

        {checklistItem && (
          <div className="space-y-4 py-4">
            {/* Task info */}
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="font-medium">{checklistItem.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {checklistItem.description}
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                {checklistItem.category}
              </Badge>
            </div>

            {/* Member selection */}
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.user_id}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                        <span>
                          {member.profiles?.full_name || member.profiles?.email}
                        </span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {member.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due date */}
            <div className="space-y-2">
              <Label>Due date (optional)</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any helpful notes or instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedMember}>
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component to show assignment status on a checklist item
interface TaskAssignmentBadgeProps {
  assignment: TaskAssignment | null;
  members: WorkspaceMember[];
  onRemove?: () => void;
  compact?: boolean;
}

export function TaskAssignmentBadge({
  assignment,
  members,
  onRemove,
  compact = false,
}: TaskAssignmentBadgeProps) {
  if (!assignment) return null;

  const assignee = members.find((m) => m.user_id === assignment.assigned_to);
  const assigneeName =
    assignee?.profiles?.full_name || assignee?.profiles?.email || "Unknown";

  const isOverdue =
    assignment.due_date && new Date(assignment.due_date) < new Date();

  return (
    <div
      className={`flex items-center gap-2 ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-100 text-purple-700">
        <User className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span className="font-medium">{assigneeName}</span>
        {assignment.due_date && (
          <>
            <span className="text-purple-400">|</span>
            <span className={isOverdue ? "text-red-600" : ""}>
              {isOverdue && <Clock className="w-3 h-3 inline mr-0.5" />}
              {new Date(assignment.due_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 hover:text-purple-900"
            title="Remove assignment"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {assignment.status === "completed" && (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      )}
    </div>
  );
}

// Helper to save task assignment to localStorage (demo mode)
export function saveTaskAssignment(assignment: TaskAssignment): void {
  const stored = localStorage.getItem("demo_task_assignments");
  const assignments: TaskAssignment[] = stored ? JSON.parse(stored) : [];

  // Remove existing assignment for this checklist item if exists
  const filtered = assignments.filter(
    (a) => a.checklist_item_id !== assignment.checklist_item_id
  );
  filtered.push(assignment);

  localStorage.setItem("demo_task_assignments", JSON.stringify(filtered));
}

// Helper to get task assignments from localStorage (demo mode)
export function getTaskAssignments(workspaceId: string): TaskAssignment[] {
  const stored = localStorage.getItem("demo_task_assignments");
  if (!stored) return [];

  const assignments: TaskAssignment[] = JSON.parse(stored);
  return assignments.filter((a) => a.workspace_id === workspaceId);
}

// Helper to remove task assignment (demo mode)
export function removeTaskAssignment(checklistItemId: string): void {
  const stored = localStorage.getItem("demo_task_assignments");
  if (!stored) return;

  const assignments: TaskAssignment[] = JSON.parse(stored);
  const filtered = assignments.filter(
    (a) => a.checklist_item_id !== checklistItemId
  );
  localStorage.setItem("demo_task_assignments", JSON.stringify(filtered));
}
