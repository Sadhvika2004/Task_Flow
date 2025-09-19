import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Card } from "@/components/ui/card";
import { useTaskFlow } from "@/hooks/useTaskFlow";

const Index = () => {
  const {
    projects,
    createTask,
    moveTask,
    deleteTask,
    updateTaskPriority,
    updateTask,
    getTasksByStatus,
    prefetchAllProjectTasks,
  } = useTaskFlow();

  // Load tasks for all projects so each board shows correct tasks
  useEffect(() => { prefetchAllProjectTasks(); }, [projects.length]);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {projects.map((project) => (
          <Card key={project.id} className="p-4 card-soft">
            <KanbanBoard
              activeProject={project}
              getTasksByStatus={getTasksByStatus}
              onCreateTask={createTask}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}
              onUpdatePriority={updateTaskPriority}
              onUpdateTask={updateTask}
            />
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="p-6 text-muted-foreground">No projects yet.</div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
