import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

const API = 'http://127.0.0.1:8000/api';

// Dummy seed data (restored)
const DUMMY_PROJECTS = [
  {
    id: 1,
    name: "TaskFlow Web App",
    color: "bg-primary",
    tasks: 5,
    active: true
  }
];
const DUMMY_SPRINTS = [
  {
    id: 1,
    name: "Sprint 1",
    goal: "Complete core functionality",
    status: "active",
    startDate: "2024-12-01",
    endDate: "2024-12-15"
  }
];
const DUMMY_TASKS = [
  {
    id: 1,
    title: "Set up project structure",
    description: "Initialize React project with Vite and install dependencies",
    status: "done",
    priority: "high",
    project: 1,
    sprintId: 1,
    dueDate: "2024-12-05",
    type: "task",
    tags: ["setup", "frontend"],
    assignees: [],
    storyPoints: 3
  },
  {
    id: 2,
    title: "Create login page",
    description: "Design and implement user authentication page",
    status: "done",
    priority: "high",
    project: 1,
    sprintId: 1,
    dueDate: "2024-12-07",
    type: "task",
    tags: ["auth", "ui"],
    assignees: [],
    storyPoints: 5
  },
  {
    id: 3,
    title: "Implement task creation",
    description: "Add functionality to create new tasks in the system",
    status: "progress",
    priority: "medium",
    project: 1,
    sprintId: 1,
    dueDate: "2024-12-10",
    type: "feature",
    tags: ["tasks", "crud"],
    assignees: [],
    storyPoints: 8
  },
  {
    id: 4,
    title: "Add drag and drop for Kanban",
    description: "Implement drag and drop functionality for task movement",
    status: "todo",
    priority: "medium",
    project: 1,
    sprintId: 1,
    dueDate: "2024-12-12",
    type: "feature",
    tags: ["kanban", "ux"],
    assignees: [],
    storyPoints: 5
  },
  {
    id: 5,
    title: "Write unit tests",
    description: "Add comprehensive unit tests for core components",
    status: "todo",
    priority: "low",
    project: 1,
    sprintId: 1,
    dueDate: "2024-12-14",
    type: "task",
    tags: ["testing", "quality"],
    assignees: [],
    storyPoints: 3
  }
];

export function useTaskFlow() {
  const [projects, setProjects] = useState(DUMMY_PROJECTS);
  const [tasks, setTasks] = useState(DUMMY_TASKS);
  const [activeProject, setActiveProject] = useState(DUMMY_PROJECTS[0] || null);
  const [sprints, setSprints] = useState(DUMMY_SPRINTS);
  const [activeSprint, setActiveSprint] = useState(DUMMY_SPRINTS[0] || null);
  // Map of projectId -> total tasks count (backlog + sprint)
  const [projectTaskTotals, setProjectTaskTotals] = useState({});

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeaders = token ? { Authorization: `Token ${token}` } : {};

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/projects/`, { headers: { ...authHeaders } });
      if (!res.ok) throw new Error(`Projects fetch failed: ${res.status}`);
      const apiData = await res.json();
      const normalized = apiData.map(p => ({ tasks: 0, ...p }));
      setProjects(normalized);

      // Ensure active project points at a real API project
      const apiIds = new Set(normalized.map(p => String(p.id)));
      const shouldSwitch = !activeProject || String(activeProject.id).startsWith('tmp-') || !apiIds.has(String(activeProject.id));
      if (shouldSwitch) {
        setActiveProject(normalized[0] || null);
      }
    } catch (err) {
      // Do not seed dummy projects
      setProjects([]);
      if (!activeProject) setActiveProject(null);
      console.warn('Projects fetch error:', err?.message || err);
    }
  };

  const normalizeTask = (t) => ({
    ...t,
    status: (t.status || (t.completed || t.completed_at ? 'done' : 'todo')),
    priority: t.priority || 'medium',
    dueDate: t.due_date || '',
    project: t.project,
    sprint: typeof t.sprint === 'number' ? t.sprint : (t.sprint?.id || null),
    tags: t.tags || [],
    assignees: t.assignees || [],
    type: t.type || 'task',
  });

  const fetchTasks = async (projectId) => {
    if (!projectId) return;
    try {
      const res = await fetch(`${API}/tasks/?project=${projectId}`, { headers: { ...authHeaders } });
      if (!res.ok) throw new Error(`Tasks fetch failed: ${res.status}`);
      const data = await res.json();
      const mapped = data.map(normalizeTask);
      // Merge server tasks for this project with any local tasks for other projects
      setTasks(prev => {
        const others = prev.filter(t => t.project !== projectId);
        return [...others, ...mapped];
      });
      // Update per-project totals from loaded tasks (backlog-only here). We'll enhance with stats below.
      setProjectTaskTotals(prev => ({ ...prev, [projectId]: mapped.length }));
    } catch (err) {
      console.warn('Using dummy tasks due to API error:', err?.message || err);
    }
  };

  const fetchTasksBySprint = async (sprintId) => {
    if (!sprintId) return;
    try {
      const res = await fetch(`${API}/tasks/?sprint=${sprintId}`, { headers: { ...authHeaders } });
      if (!res.ok) throw new Error(`Tasks fetch (sprint) failed: ${res.status}`);
      const data = await res.json();
      const mapped = data.map(normalizeTask);
      setTasks(prev => {
        const others = prev.filter(t => (t.sprint ?? t.sprintId) !== sprintId);
        return [...others, ...mapped];
      });
      // Also bump the owning project's total if we can infer it from any task
      const projectId = mapped[0]?.project;
      if (projectId) {
        setProjectTaskTotals(prev => ({ ...prev, [projectId]: (prev[projectId] || 0) + mapped.length }));
      }
    } catch (err) {
      console.warn('Using existing sprint tasks due to API error:', err?.message || err);
    }
  };

  useEffect(() => { fetchProjects(); }, [token]);
  useEffect(() => { if (activeProject?.id && !String(activeProject.id).startsWith('tmp-')) fetchTasks(activeProject.id); }, [activeProject, token]);
  useEffect(() => { if (activeSprint?.id && Number.isFinite(Number(activeSprint.id))) fetchTasksBySprint(activeSprint.id); }, [activeSprint, token]);
  
  // Fetch per-project totals (backlog + sprint) from backend stats; fallback to local counts
  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      if (!projects.length) { setProjectTaskTotals({}); return; }
      try {
        const entries = await Promise.all(projects.map(async (p) => {
          const res = await fetch(`${API}/tasks/stats/?project=${p.id}`, { headers: { ...authHeaders } });
          if (!res.ok) throw new Error('stats failed');
          const data = await res.json();
          return [p.id, data.total || 0];
        }));
        if (!cancelled) setProjectTaskTotals(Object.fromEntries(entries));
      } catch (_) {
        const entries = projects.map(p => [p.id, tasks.filter(t => t.project === p.id).length]);
        if (!cancelled) setProjectTaskTotals(Object.fromEntries(entries));
      }
    };
    loadStats();
    return () => { cancelled = true; };
  }, [projects, tasks, token]);

  const switchProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setActiveProject(project);
      toast({ title: 'Project switched', description: `Now viewing ${project.name}` });
    }
  };

  const createProject = async (name) => {
    const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-destructive"]; 
    const optimistic = { id: `tmp-${Date.now()}`, name, color: colors[Math.floor(Math.random() * colors.length)], tasks: 0 };
    setProjects(prev => [optimistic, ...prev]);
    setActiveProject(optimistic);

    try {
      const res = await fetch(`${API}/projects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ name, color: optimistic.color })
      });
      if (!res.ok) throw new Error('Failed');
      const proj = await res.json();
      setProjects(prev => {
        const withoutTemp = prev.filter(p => p.id !== optimistic.id);
        return [proj, ...withoutTemp];
      });
      setActiveProject(proj);
      toast({ title: 'Project created', description: `${proj.name} has been added` });
    } catch (_) {
      setProjects(prev => prev.filter(p => p.id !== optimistic.id));
      setActiveProject(prev => (prev?.id === optimistic.id ? null : prev));
      toast({ title: 'Failed to create', description: 'Please try again' });
    }
  };

  const createTask = async (columnId, title, description, projectIdOverride = null, type = 'task', dueDate = '', sprintIdOverride = null) => {
    const rawProjectId = projectIdOverride || activeProject?.id;
    if (!rawProjectId) {
      toast({ title: 'No project selected', description: 'Select or create a project first.' });
      return;
    }

    // Prevent creating tasks before project exists in DB
    if (String(rawProjectId).startsWith('tmp-') || !Number.isFinite(Number(rawProjectId))) {
      toast({ title: 'Project is being created', description: 'Please wait until the project is saved, then try again.' });
      return;
    }

    const projectId = Number(rawProjectId);
    // Only set sprint if caller explicitly provided an override; otherwise keep it project-only (null)
    const sprintId = (typeof sprintIdOverride !== 'undefined') ? sprintIdOverride : null;

    // Optimistic insert so the UI updates immediately
    const optimistic = {
      id: `tmp-task-${Date.now()}`,
      title,
      description,
      project: projectId,
      sprint: sprintId || null,
      status: columnId || 'todo',
      priority: 'medium',
      dueDate: dueDate || '',
      tags: [],
      assignees: [],
      type,
    };
    setTasks(prev => [...prev, optimistic]);

    try {
      const payload = { title, description, project: projectId, status: columnId || 'todo', due_date: dueDate || null };
      if (sprintId !== null && Number.isFinite(Number(sprintId))) payload.sprint = Number(sprintId);
      const res = await fetch(`${API}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Task creation failed');
      }
      const task = await res.json();
      const normalized = normalizeTask(task);
      setTasks(prev => prev.map(t => (t.id === optimistic.id ? normalized : t)));
      toast({ title: 'Task created', description: `${title} added` });
    } catch (err) {
      // Revert on error
      setTasks(prev => prev.filter(t => t.id !== optimistic.id));
      toast({ title: 'Failed to create task', description: err?.message || 'Please try again' });
    }
  };

  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    await fetch(`${API}/tasks/${taskId}/`, { method: 'DELETE', headers: { ...authHeaders } });
    toast({ title: 'Task deleted', description: 'Task has been removed' });
  };

  const updateTask = async (taskId, updates) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, ...updates } : t)));

    // Map camelCase updates to backend snake_case payload
    const payload = {};
    if (typeof updates.title !== 'undefined') payload.title = updates.title;
    if (typeof updates.description !== 'undefined') payload.description = updates.description;
    if (typeof updates.status !== 'undefined') payload.status = updates.status;
    if (typeof updates.priority !== 'undefined') payload.priority = updates.priority;
    if (typeof updates.dueDate !== 'undefined') payload.due_date = updates.dueDate || null;
    if (typeof updates.project !== 'undefined') payload.project = updates.project;
    if (typeof updates.sprint !== 'undefined') payload.sprint = updates.sprint;

    const res = await fetch(`${API}/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await res.json();
      // Normalize response back into state shape
      const normalized = normalizeTask(updated);
      setTasks(prev => prev.map(t => (t.id === taskId ? normalized : t)));
      toast({ title: 'Task updated', description: 'Task has been successfully updated' });
    }
  };

  const updateTaskPriority = (taskId, priority) => {
    updateTask(taskId, { priority });
  };

  const moveTask = (taskId, status) => {
    updateTask(taskId, { status });
  };

  const deleteProject = async (projectId) => {
    if (!projectId) return;
    const prevProjects = projects;
    const prevActive = activeProject;
    // Optimistically remove project from UI
    setProjects(prev => prev.filter(p => String(p.id) !== String(projectId)));
    if (String(activeProject?.id) === String(projectId)) {
      setActiveProject(null);
    }
    try {
      const res = await fetch(`${API}/projects/${projectId}/`, {
        method: 'DELETE',
        headers: { ...authHeaders }
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      // Remove tasks under this project from local state
      setTasks(prev => prev.filter(t => String(t.project) !== String(projectId)));
      toast({ title: 'Project deleted', description: 'The project has been removed.' });
    } catch (err) {
      // Rollback
      setProjects(prevProjects);
      setActiveProject(prevActive);
      toast({ title: 'Failed to delete project', description: err?.message || 'Please try again.' });
    }
  };

  const getTasksByStatus = (status, projectId = activeProject?.id) => tasks.filter(t => t.project === projectId && t.status === status && !t.sprint);
  const getTasksByType = (type, projectId = activeProject?.id) => tasks.filter(t => t.project === projectId && (t.type || 'task') === type && !t.sprint);

  // Backlog + Sprint helpers (minimal implementations)
  const getBacklogTasks = () => tasks.filter(t => t.project === activeProject?.id && !t.sprint);
  const getTasksBySprint = (sprintId) => tasks.filter(t => (t.sprint ?? t.sprintId) === sprintId);
  const addTaskToSprint = (taskId, sprintId) => updateTask(taskId, { sprint: sprintId });
  const removeTaskFromSprint = (taskId) => updateTask(taskId, { sprint: null });

  const startFocusSession = () => {
    toast({ title: 'Focus session started', description: 'Stay focused for the next 25 minutes!' });
  };

  // Prefetch tasks for all projects to support multi-project board views
  const prefetchAllProjectTasks = async () => {
    if (!projects.length) return;
    await Promise.all(projects.map(p => fetchTasks(p.id)));
  };

  // Expose raw totals for sidebar and other UI
  const getProjectTaskTotal = (projectId) => projectTaskTotals[projectId] ?? (tasks.filter(t => t.project === projectId).length);

  return {
    // state
    projects,
    tasks,
    activeProject,
    sprints,
    activeSprint,
    // actions
    switchProject,
    createProject,
    createTask,
    deleteProject,
    deleteTask,
    updateTask,
    updateTaskPriority,
    moveTask,
    startFocusSession,
    prefetchAllProjectTasks,
    // selectors
    getTasksByStatus,
    getTasksByType,
    getBacklogTasks,
    getTasksBySprint,
    addTaskToSprint,
    removeTaskFromSprint,
    getProjectTaskTotal,
  };
}
