import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, Lightbulb, Play } from "lucide-react";
import mascotImage from "@/assets/taskflow-mascot.png";

const taskCompletionData = [
  { day: 'Mon', completed: 4 },
  { day: 'Tue', completed: 6 },
  { day: 'Wed', completed: 8 },
  { day: 'Thu', completed: 5 },
  { day: 'Fri', completed: 9 },
  { day: 'Sat', completed: 3 },
  { day: 'Sun', completed: 2 },
];

const timeAllocationData = [
  { name: 'Design', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Development', value: 40, color: 'hsl(var(--secondary))' },
  { name: 'Research', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Meetings', value: 10, color: 'hsl(var(--muted))' },
];

const focusTips = [
  "Try the Pomodoro technique: 25 minutes focused work, 5 minute break!",
  "Tackle your most challenging task when your energy is highest.",
  "Break large tasks into smaller, manageable chunks.",
  "Use time-blocking to dedicate specific hours to important work.",
  "Take regular breaks to maintain productivity throughout the day."
];

export function AnalyticsPanel({ onStartFocusSession }) {
  const currentTip = focusTips[Math.floor(Math.random() * focusTips.length)];

  return (
    <div className="w-80 h-screen p-6 border-l border-border/50 overflow-y-auto gradient-warm">
      <div className="space-y-6">
        {/* Tasks Completed Chart */}
        <Card className="p-4 card-soft">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Tasks Completed</h3>
          </div>
          <div className="h-32 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={taskCompletionData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, fill: 'hsl(var(--primary-glow))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-semibold">37 tasks</span> completed this week
          </p>
        </Card>

        {/* Time Allocation Chart */}
        <Card className="p-4 card-soft">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-secondary" />
            <h3 className="font-semibold text-foreground">Time Allocation</h3>
          </div>
          <div className="h-32 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeAllocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  dataKey="value"
                >
                  {timeAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1">
            {timeAllocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-foreground">{item.name}</span>
                </div>
                <span className="text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Focus Tip */}
        <Card className="p-4 card-soft gradient-accent border-accent/30">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center shadow-soft">
              <img 
                src={mascotImage} 
                alt="TaskFlow Mascot" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-accent-foreground" />
                <h3 className="font-semibold text-accent-foreground">Focus Tip</h3>
              </div>
              <p className="text-sm text-accent-foreground/80 leading-relaxed mb-3">
                {currentTip}
              </p>
              <Button 
                size="sm" 
                className="gradient-secondary text-secondary-foreground button-glow animate-glow-pulse"
                onClick={onStartFocusSession}
              >
                <Play className="h-3 w-3 mr-2" />
                Start focus session
              </Button>
            </div>
          </div>
        </Card>

        {/* Weekly Stats */}
        <Card className="p-4 card-soft">
          <h3 className="font-semibold text-foreground mb-3">This Week</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tasks completed</span>
              <span className="font-semibold text-primary">37</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hours focused</span>
              <span className="font-semibold text-secondary">28.5h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Projects active</span>
              <span className="font-semibold text-accent-foreground">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Productivity</span>
              <span className="font-semibold text-primary">↑ 12%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}