import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import Navigation from '../components/Navigation';
import TaskCard from '../components/TaskCard';
import AddMemberModal from '../components/AddMemberModal';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium',
    dueDate: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projectsAPI.getById(id);
      setProject(response.data.project);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAll({ projectId: id });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.create({
        ...newTask,
        project: id
      });
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="card-lg p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gradient mb-2">{project?.name}</h1>
                <p className="text-gray-600 text-lg">{project?.description}</p>
              </div>
              <span className="badge-info text-sm px-4 py-2">
                {project?.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Project Owner</p>
                <p className="text-lg font-semibold text-gray-800">👤 {project?.owner?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Team Members</p>
                <p className="text-lg font-semibold text-gray-800">{project?.members?.length || 0} members</p>
              </div>
              <div>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="btn-primary w-full"
                >
                  + Add Team Member
                </button>
              </div>
            </div>

            {/* Team Members List */}
            {project?.members && project.members.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Team Members</p>
                <div className="flex flex-wrap gap-3">
                  {project.members.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{member.user.name}</p>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tasks ({tasks.length})</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary"
              >
                {showForm ? '✕ Cancel' : '+ Add Task'}
              </button>
            </div>

            {/* Add Task Form */}
            {showForm && (
              <div className="card-lg p-6 mb-6">
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="input-field"
                      rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="input-field"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
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
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tasks List */}
            {tasks.length === 0 ? (
              <div className="card-lg p-12 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-600 text-lg">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    projectMembers={project?.members}
                    onTaskUpdate={fetchTasks}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <AddMemberModal
          projectId={id}
          currentMembers={project?.members}
          onMemberAdded={() => {
            setShowMemberModal(false);
            fetchProjectDetails();
          }}
          onClose={() => setShowMemberModal(false)}
        />
      )}
    </>
  );
}
