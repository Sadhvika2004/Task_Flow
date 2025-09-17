import { Layout } from "@/components/Layout";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useTaskFlow } from "@/hooks/useTaskFlow";

const Index = () => {
  const {
    activeProject,
    createTask,
    moveTask,
    deleteTask,
    updateTaskPriority,
    updateTask,
    getTasksByStatus
  } = useTaskFlow();

  return (
    <Layout>
      <KanbanBoard 
        activeProject={activeProject}
        getTasksByStatus={getTasksByStatus}
        onCreateTask={createTask}
        onMoveTask={moveTask}
        onDeleteTask={deleteTask}
        onUpdatePriority={updateTaskPriority}
        onUpdateTask={updateTask}
      />
    </Layout>
  );
};

export default Index;
