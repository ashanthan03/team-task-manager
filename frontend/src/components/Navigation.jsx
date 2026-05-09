import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-2xl font-bold hover:text-blue-200 transition duration-200 flex items-center gap-2"
            >
              ✓ Task Manager
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link 
                to="/dashboard" 
                className="px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/projects" 
                className="px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                📁 Projects
              </Link>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
