import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskDetailDialog } from "./TaskDetailDialog";

// Column definitions for the board
const columns = [
  { id: "todo", title: "To Do", className: "column-todo" },
  { id: "progress", title: "In Progress", className: "column-progress" },
  { id: "review", title: "Review", className: "column-review" },
  { id: "done", title: "Done", className: "column-done" },
];

export function KanbanBoard({
  activeProject,
  getTasksByStatus,
  onCreateTask,
  onMoveTask, // kept for future drag-and-drop support
  onDeleteTask,
  onUpdatePriority, // kept for future priority controls
  onUpdateTask,
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  // Simple task card showing title, priority and due date
  const TaskCard = ({ task }) => {
    const handleTaskClick = () => {
      setSelectedTask(task);
      setTaskDetailOpen(true);
    };

    return (
      <Card
        className="p-4 mb-3 card-soft hover:shadow-card transition-all duration-200 cursor-pointer group"
        onClick={handleTaskClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-sm text-foreground leading-tight">
            {task.title}
          </h4>
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{task?.dueDate ? task.dueDate : "No due date"}</span>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {activeProject?.name || "Project"}
        </h1>
        <p className="text-muted-foreground">
          Track progress across your project workflow
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 h-full">
        {columns.map((column) => {
          // If activeProject provided, use its tasks; otherwise, show for all projects
          const baseTasks = activeProject?.id
            ? getTasksByStatus?.(column.id, activeProject.id) || []
            : [];

          return (
            <div key={column.id} className="flex flex-col">
              <div className={`p-4 mb-4 ${column.className} bg-muted/30 rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {baseTasks.length}
                  </Badge>
                </div>
                <CreateTaskDialog
                  columnId={column.id}
                  columnTitle={column.title}
                  onCreateTask={(colId, title, desc, _projOverride, type, dueDate) =>
                    onCreateTask(colId, title, desc, activeProject?.id, type, dueDate)
                  }
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {baseTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TaskDetailDialog
        task={selectedTask}
        open={taskDetailOpen}
        onOpenChange={setTaskDetailOpen}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}
