import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, Search, Filter, Bug, CheckSquare, Zap, Circle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useTaskFlow } from "@/hooks/useTaskFlow";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { TaskDetailDialog } from "@/components/TaskDetailDialog";

const getIssueTypeIcon = (type) => {
  switch (type) {
    case 'epic': return <Circle className="h-4 w-4 text-purple-500" />;
    case 'story': return <CheckSquare className="h-4 w-4 text-green-500" />;
    case 'task': return <CheckSquare className="h-4 w-4 text-blue-500" />;
    case 'bug': return <Bug className="h-4 w-4 text-red-500" />;
    case 'subtask': return <Zap className="h-4 w-4 text-orange-500" />;
    default: return <CheckSquare className="h-4 w-4 text-blue-500" />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'highest': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    case 'lowest': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export default function Backlog() {
  const {
    tasks,
    sprints,
    activeSprint,
    getBacklogTasks,
    getTasksBySprint,
    addTaskToSprint,
    removeTaskFromSprint,
    updateTask,
    deleteTask,
    createTask
  } = useTaskFlow();

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedSprints, setExpandedSprints] = useState({});

  const backlogTasks = getBacklogTasks();
  const filteredBacklogTasks = backlogTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || task.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleSprintExpansion = (sprintId) => {
    setExpandedSprints(prev => ({
      ...prev,
      [sprintId]: !prev[sprintId]
    }));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const TaskRow = ({ task }) => (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border/50 transition-all"
      onClick={() => handleTaskClick(task)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {getIssueTypeIcon(task.type)}
        <span className="text-sm font-medium text-foreground truncate">
          {task.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs">
          {task.type.toUpperCase()}
        </Badge>
        
        {task.storyPoints && (
          <Badge variant="secondary" className="text-xs">
            {task.storyPoints} SP
          </Badge>
        )}
        
        <div className={`w-3 h-3 rounded ${getPriorityColor(task.priority)}`} />
        
        {task.assignees.length > 0 && (
          <div className="flex -space-x-1">
            {task.assignees.slice(0, 2).map((assignee, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-xs">{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            ))}
            {task.assignees.length > 2 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+{task.assignees.length - 2}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout showAnalytics={false}>
      <div className="flex-1 p-6 overflow-hidden">
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Backlog</h1>
        <p className="text-muted-foreground">Plan and prioritize your work</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
  <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="subtask">Subtask</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {/* Active Sprints */}
        {sprints.map((sprint) => {
          const sprintTasks = getTasksBySprint(sprint.id);
          const isExpanded = expandedSprints[sprint.id] ?? true;
          
          return (
            <Card key={sprint.id} className="card-soft">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer border-b border-border/50"
                onClick={() => toggleSprintExpansion(sprint.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <div>
                    <h3 className="font-semibold text-foreground">{sprint.name}</h3>
                    <p className="text-sm text-muted-foreground">{sprint.goal}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={sprint.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {sprint.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {sprintTasks.length} issues
                  </span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 space-y-2">
                  {sprintTasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                  {sprintTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No issues in this sprint</p>
                      <CreateTaskDialog 
                        columnId="todo"
                        columnTitle="Sprint"
                        onCreateTask={(columnId, title, description) => createTask(columnId, title, description)}
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}

        {/* Backlog */}
        <Card className="card-soft">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Backlog</h3>
              <span className="text-sm text-muted-foreground">
                {filteredBacklogTasks.length} issues
              </span>
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            {filteredBacklogTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
            {filteredBacklogTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No backlog issues found</p>
                <CreateTaskDialog 
                  columnId="todo"
                  columnTitle="Backlog"
                  onCreateTask={(columnId, title, description) => createTask(columnId, title, description)}
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        open={taskDetailOpen}
        onOpenChange={setTaskDetailOpen}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
      </div>
    </Layout>
  );
}