import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  Circle, 
  Play, 
  Pause,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTaskFlow } from "@/hooks/useTaskFlow";
import { KanbanBoard } from "@/components/KanbanBoard";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    projects, 
    tasks, 
    getTasksByStatus, 
    createTask, 
    moveTask, 
    deleteTask, 
    updateTaskPriority, 
    updateTask,
    switchProject 
  } = useTaskFlow();

  const pid = isNaN(projectId) ? projectId : parseInt(projectId);
  const project = projects.find(p => String(p.id) === String(pid));
  // Ensure global context uses this project so hooks fetch its tasks
  useEffect(() => {
    if (project) {
      switchProject(project.id);
    }
  }, [project?.id]);
  
  if (!project) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Loading project...</h1>
          <p className="text-muted-foreground">Please wait or go back.</p>
          <Button className="mt-4" onClick={() => navigate('/')}> 
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const projectTasks = tasks.filter(task => task.project === project.id && task.status !== 'done');
  const completedTasks = tasks.filter(task => task.project === project.id && task.status === 'done');
  const totalTasks = projectTasks.length + completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Mock project details - in a real app, this would come from the backend
  const projectDetails = {
    description: "A comprehensive redesign of our mobile application to improve user experience and modernize the interface. This project focuses on creating a more intuitive and accessible design system.",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    team: [
      { name: "Alex Chen", role: "Lead Designer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
      { name: "Sam Wilson", role: "Frontend Developer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" },
      { name: "Jordan Kim", role: "UX Researcher", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" },
      { name: "Taylor Swift", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108755-2616b84e2b19?w=32&h=32&fit=crop&crop=face" }
    ],
    status: "active",
    priority: "high"
  };

  return (
    <Layout showAnalytics={false}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${project.color} shadow-sm`} />
                <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
                <Badge variant={projectDetails.status === 'active' ? 'default' : 'secondary'}>
                  {projectDetails.status}
                </Badge>
                <Badge variant="outline">
                  {projectDetails.priority} priority
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">{projectDetails.description}</p>
            </div>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              More
            </Button>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 card-soft">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 card-soft">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{completedTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 card-soft">
              <div className="flex items-center gap-3">
                <Circle className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{projectTasks.length}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 card-soft">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{projectDetails.team.length}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="p-4 card-soft mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Project Progress</span>
              <span className="text-sm text-muted-foreground">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Project Tasks</h2>
              <Button onClick={() => {
                const title = prompt('Task title:');
                if (!title) return;
                const description = prompt('Description (optional):') || '';
                const dueDate = prompt('Due date (YYYY-MM-DD, optional):') || '';
                // Default new tasks to To-Do column
                createTask('todo', title, description, project.id, 'task', dueDate);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            <KanbanBoard 
              activeProject={project}
              getTasksByStatus={getTasksByStatus}
              onCreateTask={createTask}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}
              onUpdatePriority={updateTaskPriority}
              onUpdateTask={updateTask}
            />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectDetails.team.map((member, index) => (
                <Card key={index} className="p-4 card-soft">
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>




        </Tabs>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
