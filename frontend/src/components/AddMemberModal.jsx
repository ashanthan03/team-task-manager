import { projectsAPI } from '../services/api';
import { useState } from 'react';

export default function AddMemberModal({ projectId, currentMembers, onMemberAdded, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await projectsAPI.addMember(projectId, { userEmail: email, role });
      setEmail('');
      setRole('member');
      onMemberAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add Team Member</h3>

        <form onSubmit={handleAddMember} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
