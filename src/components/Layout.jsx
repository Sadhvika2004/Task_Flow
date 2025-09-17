
import { Sidebar } from "@/components/Sidebar";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { Navigation } from "@/components/Navigation";
import { useTaskFlow } from "@/hooks/useTaskFlow";

export function Layout({ children, showAnalytics = true }) {
  const {
    projects,
    activeProject,
    switchProject,
    createProject,
    startFocusSession
  } = useTaskFlow();

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <div className="flex flex-1">
        <Sidebar 
          projects={projects}
          activeProject={activeProject}
          onSwitchProject={switchProject}
          onCreateProject={createProject}
        />
        <div className="flex-1 flex flex-col">
          <Navigation />
          <div className="flex flex-1">
            <main className="flex-1">
              {children}
            </main>
            {showAnalytics && (
              <AnalyticsPanel 
                onStartFocusSession={startFocusSession}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}