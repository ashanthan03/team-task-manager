import React, { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../services/api';
import Navigation from '../components/Navigation';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await tasksAPI.getDashboard();
        setDashboard(response.data.dashboard);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your project overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Projects Card */}
            <div className="card-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                  <div className="text-2xl">📊</div>
                </div>
                <p className="text-4xl font-bold text-gray-900">{dashboard?.totalProjects || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Active projects</p>
              </div>
            </div>

            {/* Total Tasks Card */}
            <div className="card-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                  <div className="text-2xl">✓</div>
                </div>
                <p className="text-4xl font-bold text-gray-900">{dashboard?.totalTasks || 0}</p>
                <p className="text-xs text-gray-500 mt-2">All tasks</p>
              </div>
            </div>

            {/* Completion Rate Card */}
            <div className="card-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 text-sm font-medium">Completion Rate</p>
                  <div className="text-2xl">🎯</div>
                </div>
                <p className="text-4xl font-bold text-green-600">{dashboard?.completionPercentage || 0}%</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dashboard?.completionPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Overdue Tasks Card */}
            <div className="card-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 text-sm font-medium">Overdue Tasks</p>
                  <div className="text-2xl">⚠️</div>
                </div>
                <p className="text-4xl font-bold text-red-600">{dashboard?.overdueCount || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Need attention</p>
              </div>
            </div>
          </div>

          {/* Recent Tasks and My Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <div className="card-lg">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Recent Tasks
                </h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dashboard?.recentTasks?.slice(0, 5).map(task => (
                  <div key={task._id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-900 flex-1 pr-2">{task.title}</p>
                      <span className={`badge text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">📁 {task.project?.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`badge text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
                {(!dashboard?.recentTasks || dashboard.recentTasks.length === 0) && (
                  <p className="text-center text-gray-500 py-8">No recent tasks</p>
                )}
              </div>
            </div>

            {/* My Tasks */}
            <div className="card-lg">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  My Tasks
                </h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dashboard?.myTasks?.slice(0, 5).map(task => (
                  <div key={task._id} className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-900 flex-1 pr-2">{task.title}</p>
                      <span className={`badge text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">📁 {task.project?.name}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        📅 Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                ))}
                {(!dashboard?.myTasks || dashboard.myTasks.length === 0) && (
                  <p className="text-center text-gray-500 py-8">No tasks assigned to you</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
