// QUICK MIGRATION GUIDE: Using React Query Hooks
// Copy this file as reference when updating your React components

// ============================================
// EXAMPLE 1: Dashboard Component
// ============================================

// OLD CODE (before optimization):
/*
import { useEffect, useState } from 'react';
import { tasksAPI } from '../services/api';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksAPI.getDashboard()
      .then(res => setDashboard(res.data.dashboard))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{dashboard.totalTasks} tasks</div>;
}
*/

// NEW CODE (with React Query):
import { useGetDashboard } from '../hooks/useQueries';

function Dashboard() {
  const { data, isLoading, error } = useGetDashboard();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  const dashboard = data?.dashboard;
  return <div>{dashboard.totalTasks} tasks</div>;
}

// ============================================
// EXAMPLE 2: Projects List Component
// ============================================

// OLD CODE:
/*
function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll()
      .then(res => setProjects(res.data.projects))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await projectsAPI.delete(id);
    setProjects(projects.filter(p => p._id !== id));
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {projects.map(p => (
        <div key={p._id}>
          {p.name}
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
*/

// NEW CODE:
import { useGetProjects, useDeleteProject } from '../hooks/useQueries';

function Projects() {
  const { data, isLoading, error } = useGetProjects();
  const deleteProject = useDeleteProject();

  const handleDelete = (id) => {
    deleteProject.mutate(id, {
      onSuccess: () => console.log('Project deleted'),
      onError: (error) => console.error('Delete failed:', error)
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const projects = data?.projects || [];
  return (
    <div>
      {projects.map(p => (
        <div key={p._id}>
          {p.name}
          <button 
            onClick={() => handleDelete(p._id)}
            disabled={deleteProject.isLoading}
          >
            {deleteProject.isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 3: Create Project Form
// ============================================

// NEW CODE:
import { useState } from 'react';
import { useCreateProject } from '../hooks/useQueries';

function CreateProjectForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createProject = useCreateProject();

  const handleSubmit = (e) => {
    e.preventDefault();
    createProject.mutate(
      { name, description },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          alert('Project created successfully!');
          // Projects list automatically updates due to cache invalidation
        },
        onError: (error) => {
          alert('Error creating project: ' + error.message);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit" disabled={createProject.isLoading}>
        {createProject.isLoading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}

// ============================================
// EXAMPLE 4: Tasks List with Filtering
// ============================================

// NEW CODE:
import { useState } from 'react';
import { useGetTasks, useDeleteTask } from '../hooks/useQueries';

function TasksList() {
  const [status, setStatus] = useState('');
  const [projectId, setProjectId] = useState('');
  
  // Passes filter params - automatically refetches when params change
  const { data, isLoading, error } = useGetTasks(
    { projectId, status },
    { enabled: !!projectId } // Only fetch if projectId is provided
  );
  
  const deleteTask = useDeleteTask();

  const handleDelete = (id) => {
    deleteTask.mutate(id);
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const tasks = data?.tasks || [];
  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {tasks.map(task => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
          <button 
            onClick={() => handleDelete(task._id)}
            disabled={deleteTask.isLoading}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 5: Update Task with Optimistic Update
// ============================================

// NEW CODE:
import { useUpdateTask } from '../hooks/useQueries';

function TaskDetailForm({ taskId }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const updateTask = useUpdateTask();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask.mutate(
      { 
        id: taskId, 
        data: { title, status } 
      },
      {
        onSuccess: (data) => {
          console.log('Task updated:', data.task);
          // Cache automatically invalidated
        },
        onError: (error) => {
          alert('Error updating task: ' + error.message);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit" disabled={updateTask.isLoading}>
        {updateTask.isLoading ? 'Saving...' : 'Save Task'}
      </button>
    </form>
  );
}

// ============================================
// HELPER PATTERNS
// ============================================

// Pattern 1: Handle loading and error states consistently
function useQueryHandler(query) {
  const { data, isLoading, error } = query;
  
  return {
    isLoading,
    error: error?.response?.data?.message || error?.message,
    data: data || null,
    isEmpty: data && Object.keys(data).length === 0
  };
}

// Pattern 2: Combine multiple queries
import { useGetProjects, useGetTasks } from '../hooks/useQueries';

function ProjectWithTasks({ projectId }) {
  const project = useGetProjectById(projectId);
  const tasks = useGetTasks({ projectId });

  if (project.isLoading || tasks.isLoading) return <div>Loading...</div>;
  if (project.error || tasks.error) return <div>Error loading data</div>;

  return (
    <div>
      <h1>{project.data?.project?.name}</h1>
      <p>Tasks: {tasks.data?.tasks?.length}</p>
    </div>
  );
}

// Pattern 3: Refetch on demand
import { useGetProjects } from '../hooks/useQueries';

function Projects() {
  const { data, refetch } = useGetProjects();

  return (
    <div>
      <button onClick={() => refetch()}>
        Refresh Projects
      </button>
      {/* ... */}
    </div>
  );
}

// ============================================
// TESTING YOUR IMPLEMENTATION
// ============================================

// Install devtools to debug (optional):
// npm install @tanstack/react-query-devtools

// In App.jsx:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Now you can see:
// - Cache state
// - Query timing
// - Data updates
// - Stale/fresh status
