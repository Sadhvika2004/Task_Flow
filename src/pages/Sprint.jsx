import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Target, TrendingUp, Users } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useTaskFlow } from "@/hooks/useTaskFlow";
import { KanbanBoard } from "@/components/KanbanBoard";

export default function Sprint() {
  const {
    activeSprint,
    getTasksBySprint,
    getTasksByStatus,
    updateTask,
    deleteTask,
    updateTaskPriority,
    createTask,
    moveTask
  } = useTaskFlow();

  const sprintTasks = getTasksBySprint(activeSprint.id);
  const completedTasks = sprintTasks.filter(task => task.status === 'done');
  const inProgressTasks = sprintTasks.filter(task => task.status === 'progress');
  const todoTasks = sprintTasks.filter(task => task.status === 'todo');
  const reviewTasks = sprintTasks.filter(task => task.status === 'review');

  const totalStoryPoints = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  const completedStoryPoints = completedTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  const progressPercentage = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;

  const getTasksByStatusFiltered = (status) => {
    return sprintTasks.filter(task => task.status === status);
  };

  const getDaysRemaining = () => {
    const endDate = new Date(activeSprint.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const SprintStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 card-soft">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Story Points</p>
            <p className="text-lg font-semibold text-foreground">
              {completedStoryPoints} / {totalStoryPoints}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 card-soft">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-lg font-semibold text-foreground">
              {Math.round(progressPercentage)}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 card-soft">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Days Remaining</p>
            <p className="text-lg font-semibold text-foreground">
              {getDaysRemaining()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 card-soft">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Issues</p>
            <p className="text-lg font-semibold text-foreground">
              {completedTasks.length} / {sprintTasks.length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <Layout showAnalytics={false}>
      <div className="flex-1 p-6 overflow-hidden">
        <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{activeSprint.name}</h1>
            <p className="text-muted-foreground">{activeSprint.goal}</p>
          </div>
          <Badge 
            variant={activeSprint.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {activeSprint.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{activeSprint.startDate} - {activeSprint.endDate}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sprint Progress</span>
            <span className="text-foreground font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <Tabs defaultValue="board" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="board">Sprint Board</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-0 mt-0">
          <div className="h-full">
            <KanbanBoard
              activeProject={{ id: 1, name: activeSprint.name, color: 'bg-primary', tasks: sprintTasks.length, active: true }}
              getTasksByStatus={getTasksByStatusFiltered}
              onCreateTask={createTask}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}
              onUpdatePriority={updateTaskPriority}
              onUpdateTask={updateTask}
            />
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <SprintStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sprint Burndown would go here */}
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Sprint Burndown</h3>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Burndown chart visualization would appear here</p>
              </div>
            </Card>

            {/* Issue Breakdown */}
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Issue Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">To Do</span>
                  <Badge variant="outline">{todoTasks.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <Badge variant="outline">{inProgressTasks.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Review</span>
                  <Badge variant="outline">{reviewTasks.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Done</span>
                  <Badge variant="outline">{completedTasks.length}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}