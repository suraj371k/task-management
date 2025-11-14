import { useState } from "react";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/task/useTask";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreVertical,
  Calendar,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  Trash2,
  Edit,
} from "lucide-react";
import { format, parseISO, isBefore } from "date-fns";
import type { Priority, Status, Task } from "@/lib/validations/task";
import EditTaskDialog from "./EditTaskDialog";

const TaskList = () => {
  const { data } = useTasks();
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: Status, completed: boolean) => {
    if (completed) return "bg-green-100 text-green-800 border-green-200";

    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Status, completed: boolean) => {
    if (completed) return <CheckCircle2 className="h-4 w-4" />;

    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />;
      case "todo":
        return <Circle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const isOverdue = (deadline: string) => {
    return isBefore(parseISO(deadline), new Date());
  };

  return (
    <div className="space-y-4">
      {data?.tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onDelete={handleDelete}
          priorityColor={getPriorityColor(task.priority)}
          statusColor={getStatusColor(task.status, task.completed)}
          statusIcon={getStatusIcon(task.status, task.completed)}
          isOverdue={isOverdue(task.deadline)}
        />
      ))}

      {data?.tasks.length === 0 && (
        <Card className="border-2 border-dashed border-slate-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-slate-100 p-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-slate-600 text-sm text-center max-w-sm">
              You're all caught up! Create your first task to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  priorityColor: string;
  statusColor: string;
  statusIcon: React.ReactNode;
  isOverdue: boolean;
}

const TaskCard = ({
  task,
  onDelete,
  priorityColor,
  statusColor,
  statusIcon,
  isOverdue,
}: TaskCardProps) => {
  const updateTaskMutation = useUpdateTask(task._id);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleStatusChange = (newStatus: Status) => {
    setIsUpdating(true);
    updateTaskMutation.mutate(
      {
        status: newStatus,
        // When status is "done", mark as completed. Otherwise, unmark if it was done
        completed: newStatus === "done" ? true : (task.status === "done" ? false : task.completed),
      },
      {
        onSettled: () => setIsUpdating(false),
      }
    );
  };

  const handlePriorityChange = (newPriority: Priority) => {
    setIsUpdating(true);
    updateTaskMutation.mutate(
      { priority: newPriority },
      {
        onSettled: () => setIsUpdating(false),
      }
    );
  };

  const handleToggleComplete = (checked: boolean | "indeterminate") => {
    // Handle checkbox value which can be boolean or "indeterminate"
    if (checked === "indeterminate") return;
    
    const completed = checked === true;
    setIsUpdating(true);
    updateTaskMutation.mutate(
      {
        completed,
        status: completed ? "done" : "todo",
      },
      {
        onSettled: () => setIsUpdating(false),
      }
    );
  };

  const formattedDate = format(parseISO(task.deadline), "MMM dd, yyyy");

  return (
    <Card
      className={`bg-white border-slate-200 transition-all hover:shadow-md ${
        isUpdating ? "opacity-60" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3
                  className={`font-semibold text-slate-900 ${
                    task.completed ? "line-through text-slate-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {task.description && (
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Badge */}
                <Select
                  value={task.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className={`h-6 px-2 ${statusColor} border`}>
                    <div className="flex items-center space-x-1">
                      {statusIcon}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">
                      <div className="flex items-center space-x-2">
                        <Circle className="h-4 w-4" />
                        <span>To Do</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-4 w-4" />
                        <span>In Progress</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="done">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Done</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Priority Badge */}
                <Select
                  value={task.priority}
                  onValueChange={handlePriorityChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className={`h-6 px-2 ${priorityColor} border`}>
                    <div className="flex items-center space-x-1">
                      <Flag className="h-3 w-3" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                {/* Deadline */}
                <Badge
                  variant="outline"
                  className={`h-6 flex items-center space-x-1 ${
                    isOverdue && !task.completed
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDate}</span>
                  {isOverdue && !task.completed && (
                    <Clock className="h-3 w-3 ml-1" />
                  )}
                </Badge>

                {/* Created Date */}
                {task.createdAt && (
                  <Badge
                    variant="outline"
                    className="h-6 bg-slate-50 text-slate-500 border-slate-200"
                  >
                    Created: {format(parseISO(task.createdAt), "MMM dd")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="flex items-center space-x-2"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center space-x-2 text-red-600"
                onClick={() => onDelete(task._id)}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </Card>
  );
};

export default TaskList;
