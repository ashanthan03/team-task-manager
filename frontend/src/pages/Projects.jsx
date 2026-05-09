import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await projectsAPI.create(newProject);
      setNewProject({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      setError(error.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Projects</h1>
            <p className="text-gray-600">Manage and collaborate on your team projects</p>
          </div>

          {/* Create Project Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? '✕ Cancel' : '+ New Project'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
              {error}
            </div>
          )}

          {/* Create Project Form */}
          {showForm && (
            <div className="card-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter project description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="card-lg p-12 text-center">
              <div className="text-5xl mb-4">📁</div>
              <p className="text-gray-600 text-lg mb-4">No projects yet. Create your first project!</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
