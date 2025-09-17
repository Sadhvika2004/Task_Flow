import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

const API = 'http://127.0.0.1:8000/api';

// Dummy seed data (restored)
const DUMMY_PROJECTS = [
  { id: 101, name: 'Website Redesign', color: 'bg-primary', active: true, tasks: 0 },
  { id: 102, name: 'Mobile App', color: 'bg-secondary', active: false, tasks: 0 },
  { id: 103, name: 'Marketing Campaign', color: 'bg-accent', active: false, tasks: 0 },
];
const DUMMY_SPRINTS = [
  { id: 201, name: 'Sprint 1', status: 'active', goal: 'MVP delivery', startDate: '2024-11-01', endDate: '2024-11-14' },
];
const DUMMY_TASKS = [
  { id: 301, title: 'Create wireframes', description: 'Initial homepage wireframes', project: 101, status: 'todo', priority: 'medium', dueDate: 'No due date', tags: [], assignees: [], storyPoints: 3, type: 'story' },
  { id: 302, title: 'Build navbar', description: 'Responsive nav bar', project: 101, status: 'progress', priority: 'high', dueDate: 'No due date', tags: [], assignees: [], storyPoints: 2, type: 'task' },
  { id: 303, title: 'API integration', description: 'Connect endpoints', project: 102, status: 'review', priority: 'highest', dueDate: 'No due date', tags: [], assignees: [], storyPoints: 5, type: 'bug' },
  { id: 304, title: 'Write copy', description: 'Landing page content', project: 103, status: 'done', priority: 'low', dueDate: 'No due date', tags: [], assignees: [], storyPoints: 1, type: 'epic' },
];

export function useTaskFlow() {
  const [projects, setProjects] = useState(DUMMY_PROJECTS);
  const [tasks, setTasks] = useState(DUMMY_TASKS);
  const [activeProject, setActiveProject] = useState(DUMMY_PROJECTS[0]);
  const [sprints, setSprints] = useState(DUMMY_SPRINTS);
  const [activeSprint, setActiveSprint] = useState(DUMMY_SPRINTS[0]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeaders = token ? { Authorization: `Token ${token}` } : {};

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/projects/`, { headers: { ...authHeaders } });
      if (!res.ok) throw new Error(`Projects fetch failed: ${res.status}`);
      const apiData = await res.json();
      const normalized = apiData.map(p => ({ tasks: 0, ...p }));
      setProjects(prev => {
        const merged = new Map(prev.map(p => [String(p.id), p]));
        // preserve temporary optimistic projects
        prev.filter(p => String(p.id).startsWith('tmp-')).forEach(p => merged.set(String(p.id), p));
        // merge API data (overrides any existing real entries)
        normalized.forEach(p => {
          const key = String(p.id);
          const existing = merged.get(key);
          merged.set(key, existing ? { ...existing, ...p } : p);
        });
        return Array.from(merged.values());
      });

      // Ensure active project is a real API project
      const apiIds = new Set(normalized.map(p => String(p.id)));
      const shouldSwitch = !activeProject || String(activeProject.id).startsWith('tmp-') || !apiIds.has(String(activeProject.id));
      if (shouldSwitch && normalized.length) {
        setActiveProject(normalized[0]);
      }
    } catch (err) {
      console.warn('Using dummy projects due to API error:', err?.message || err);
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
        status: t.completed ? 'done' : (t.status || 'todo'),
        priority: t.priority || 'medium',
        dueDate: t.dueDate || 'No due date',
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

  const createTask = async (columnId, title, description, projectIdOverride = null, type = 'task') => {
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
      dueDate: 'No due date',
      tags: [],
      assignees: [],
      type,
    };
    setTasks(prev => [...prev, optimistic]);

    try {
      const res = await fetch(`${API}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ title, description, project: projectId })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Task creation failed');
      }
      const task = await res.json();
      setTasks(prev => prev.map(t => (t.id === optimistic.id ? task : t)));
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
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, ...updates } : t)));
    const res = await fetch(`${API}/tasks/${taskId}/`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders }, body: JSON.stringify(updates) });
    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
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
