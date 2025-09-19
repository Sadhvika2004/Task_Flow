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

  const fetchTasks = async (projectId) => {
    if (!projectId) return;
    try {
      const res = await fetch(`${API}/tasks/?project=${projectId}`, { headers: { ...authHeaders } });
      if (!res.ok) throw new Error(`Tasks fetch failed: ${res.status}`);
      const data = await res.json();
      const mapped = data.map(t => ({
        ...t,
        // Consider both legacy completed flag and new completed_at or status field
        status: (t.status || (t.completed || t.completed_at ? 'done' : 'todo')),
        priority: t.priority || 'medium',
        // Normalize snake_case to camelCase for UI. Keep empty string if none for clean input control.
        dueDate: t.due_date || '',
        project: t.project,
        tags: t.tags || [],
        assignees: t.assignees || [],
        type: t.type || 'task',
      }));
      // Merge server tasks for this project with any local tasks for other projects
      setTasks(prev => {
        const others = prev.filter(t => t.project !== projectId);
        return [...others, ...mapped];
      });
    } catch (err) {
      console.warn('Using dummy tasks due to API error:', err?.message || err);
    }
  };

  useEffect(() => { fetchProjects(); }, [token]);
  useEffect(() => { if (activeProject?.id && !String(activeProject.id).startsWith('tmp-')) fetchTasks(activeProject.id); }, [activeProject, token]);

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

  const createTask = async (columnId, title, description, projectIdOverride = null, type = 'task', dueDate = '') => {
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

    // Optimistic insert so the UI updates immediately
    const optimistic = {
      id: `tmp-task-${Date.now()}`,
      title,
      description,
      project: projectId,
      status: columnId || 'todo',
      priority: 'medium',
      dueDate: dueDate || '',
      tags: [],
      assignees: [],
      type,
    };
    setTasks(prev => [...prev, optimistic]);

    try {
      const res = await fetch(`${API}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ title, description, project: projectId, status: columnId || 'todo', due_date: dueDate || null })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Task creation failed');
      }
      const task = await res.json();
      setTasks(prev => prev.map(t => (t.id === optimistic.id ? {
        ...task,
        // ensure normalization matches our state shape
        status: (task.status || (task.completed || task.completed_at ? 'done' : 'todo')),
        priority: task.priority || 'medium',
        dueDate: task.due_date || '',
        project: task.project,
        tags: task.tags || [],
        assignees: task.assignees || [],
        type: task.type || 'task',
      } : t)));
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

    const res = await fetch(`${API}/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await res.json();
      // Normalize response back into state shape
      const normalized = {
        ...updated,
        status: (updated.status || (updated.completed || updated.completed_at ? 'done' : 'todo')),
        priority: updated.priority || 'medium',
        dueDate: updated.due_date || '',
        project: updated.project,
        tags: updated.tags || [],
        assignees: updated.assignees || [],
        type: updated.type || 'task',
      };
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

  const getTasksByStatus = (status, projectId = activeProject?.id) => tasks.filter(t => t.project === projectId && t.status === status);
  const getTasksByType = (type, projectId = activeProject?.id) => tasks.filter(t => t.project === projectId && (t.type || 'task') === type);

  // Backlog + Sprint helpers (minimal implementations)
  const getBacklogTasks = () => tasks.filter(t => t.project === activeProject?.id);
  const getTasksBySprint = (sprintId) => tasks.filter(t => t.sprintId === sprintId);
  const addTaskToSprint = (taskId, sprintId) => updateTask(taskId, { sprintId });
  const removeTaskFromSprint = (taskId) => updateTask(taskId, { sprintId: undefined });

  const startFocusSession = () => {
    toast({ title: 'Focus session started', description: 'Stay focused for the next 25 minutes!' });
  };

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
    deleteTask,
    updateTask,
    updateTaskPriority,
    moveTask,
    startFocusSession,
    // selectors
    getTasksByStatus,
    getTasksByType,
    getBacklogTasks,
    getTasksBySprint,
    addTaskToSprint,
    removeTaskFromSprint,
  };
}
