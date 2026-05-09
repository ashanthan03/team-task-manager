import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.signup(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="card-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Get Started
            </h2>
            <p className="text-gray-600">Create your task manager account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Use at least 6 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-6 space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Create and manage projects</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Assign tasks to team members</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Track task progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
