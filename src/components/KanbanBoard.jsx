import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreHorizontal, Calendar, Flag } from "lucide-react";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskDetailDialog } from "./TaskDetailDialog";

import { useState } from "react";

const columns = [
  { id: 'todo', title: 'To Do', className: 'column-todo' },
  { id: 'progress', title: 'In Progress', className: 'column-progress' },
  { id: 'review', title: 'Review', className: 'column-review' },
  { id: 'done', title: 'Done', className: 'column-done' },
];

export function KanbanBoard({ 
  activeProject, 
  getTasksByStatus, 
  onCreateTask, 
  onMoveTask, 
  onDeleteTask, 
  onUpdatePriority,
  onUpdateTask
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  const TaskCard = ({ task }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'highest': return 'bg-destructive text-destructive-foreground';
        case 'high': return 'bg-destructive/80 text-destructive-foreground';
        case 'medium': return 'bg-accent text-accent-foreground';
        case 'low': return 'bg-secondary text-secondary-foreground';
        case 'lowest': return 'bg-muted text-muted-foreground';
        default: return 'bg-muted text-muted-foreground';
      }
    };

    const handleTaskClick = () => {
      setSelectedTask(task);
      setTaskDetailOpen(true);
    };

    const handlePriorityChange = (priority) => {
      onUpdatePriority(task.id, priority);
    };

    return (
      <Card className="p-4 mb-3 card-soft hover:shadow-card transition-all duration-200 cursor-pointer group">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-sm text-foreground leading-tight" onClick={handleTaskClick}>
            {task.title}
          </h4>
          <Select value={task.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent hover:bg-accent">
              <MoreHorizontal className="h-3 w-3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest">Highest Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="lowest">Lowest Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed" onClick={handleTaskClick}>
          {task.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <Badge 
            className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}
            variant="secondary"
          >
            <Flag className="h-2.5 w-2.5 mr-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {task.dueDate}
          </div>
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {task.assignees.length > 0 && (
          <div className="flex -space-x-1">
            {task.assignees.slice(0, 3).map((assignee, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-xs">{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            ))}
            {task.assignees.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+{task.assignees.length - 3}</span>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{activeProject?.name || 'Project'}</h1>
        <p className="text-muted-foreground">Track progress across your project workflow</p>
      </div>
      
      <div className="grid grid-cols-4 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id, activeProject?.id);
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`p-4 mb-4 ${column.className} bg-muted/30 rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
                <CreateTaskDialog 
                  columnId={column.id}
                  columnTitle={column.title}
                  onCreateTask={onCreateTask}
                />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {columnTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Dialog */}
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