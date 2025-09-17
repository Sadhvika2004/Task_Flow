import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, Target, Bug, CheckSquare, Users } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useTaskFlow } from "@/hooks/useTaskFlow";

const velocityData = [
  { sprint: 'Sprint 1', planned: 32, completed: 28 },
  { sprint: 'Sprint 2', planned: 35, completed: 31 },
  { sprint: 'Sprint 3', planned: 30, completed: 30 },
  { sprint: 'Sprint 4', planned: 38, completed: 35 },
  { sprint: 'Sprint 5', planned: 33, completed: 29 },
];

const burndownData = [
  { day: 1, remaining: 45 },
  { day: 2, remaining: 42 },
  { day: 3, remaining: 38 },
  { day: 4, remaining: 35 },
  { day: 5, remaining: 30 },
  { day: 6, remaining: 28 },
  { day: 7, remaining: 25 },
  { day: 8, remaining: 20 },
  { day: 9, remaining: 15 },
  { day: 10, remaining: 10 },
];

const issueTypeData = [
  { name: 'Story', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Task', value: 30, color: 'hsl(var(--secondary))' },
  { name: 'Bug', value: 15, color: 'hsl(var(--destructive))' },
  { name: 'Epic', value: 10, color: 'hsl(var(--accent))' },
];

export default function Reports() {
  const { tasks, sprints, getTasksByType } = useTaskFlow();

  const stories = getTasksByType('story');
  const bugs = getTasksByType('bug');
  const epics = getTasksByType('epic');
  const taskItems = getTasksByType('task');

  const completedTasks = tasks.filter(task => task.status === 'done');
  const averageCompletionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const ReportCard = ({ title, value, subtitle, icon: Icon, color = "text-primary" }) => (
    <Card className="p-6 card-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </Card>
  );

  return (
    <Layout showAnalytics={false}>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Track team performance and project insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ReportCard
          title="Total Issues"
          value={tasks.length}
          subtitle="Across all projects"
          icon={CheckSquare}
          color="text-blue-500"
        />
        <ReportCard
          title="Completion Rate"
          value={`${Math.round(averageCompletionRate)}%`}
          subtitle="This month"
          icon={TrendingUp}
          color="text-green-500"
        />
        <ReportCard
          title="Active Sprints"
          value={sprints.filter(s => s.status === 'active').length}
          subtitle="Currently running"
          icon={Calendar}
          color="text-orange-500"
        />
        <ReportCard
          title="Open Bugs"
          value={bugs.filter(bug => bug.status !== 'done').length}
          subtitle="Needs attention"
          icon={Bug}
          color="text-red-500"
        />
      </div>

      <Tabs defaultValue="velocity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="burndown">Burndown</TabsTrigger>
          <TabsTrigger value="breakdown">Issue Breakdown</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="velocity" className="space-y-6">
          <Card className="p-6 card-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Velocity Chart</h3>
                <p className="text-sm text-muted-foreground">Story points planned vs completed per sprint</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData}>
                  <XAxis 
                    dataKey="sprint" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="planned" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted" />
                <span className="text-sm text-muted-foreground">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="burndown" className="space-y-6">
          <Card className="p-6 card-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Sprint Burndown</h3>
                <p className="text-sm text-muted-foreground">Work remaining over time</p>
              </div>
              <Badge variant="outline">Current Sprint</Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burndownData}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="remaining" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-6">Issue Type Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {issueTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {issueTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-6">Issue Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Stories</span>
                  </div>
                  <Badge variant="outline">{stories.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Tasks</span>
                  </div>
                  <Badge variant="outline">{taskItems.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Bug className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">Bugs</span>
                  </div>
                  <Badge variant="outline">{bugs.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Epics</span>
                  </div>
                  <Badge variant="outline">{epics.length}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="p-6 card-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">Team Performance</h3>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Team performance metrics would be displayed here</p>
              <p className="text-sm">Including individual productivity, collaboration scores, and workload distribution</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}