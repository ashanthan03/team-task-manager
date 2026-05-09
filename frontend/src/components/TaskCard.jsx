import { useState } from 'react';
import { tasksAPI } from '../services/api';

export default function TaskCard({ task, projectMembers, onTaskUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(task.assignedTo?._id || '');
  const [updatedStatus, setUpdatedStatus] = useState(task.status);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800'
  };

  const handleAssignTask = async (memberId) => {
    try {
      await tasksAPI.update(task._id, { assignedTo: memberId || null });
      setSelectedMember(memberId);
      setIsEditing(false);
      onTaskUpdate?.();
    } catch (err) {
      console.error('Error assigning task:', err);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await tasksAPI.update(task._id, { status });
      setUpdatedStatus(status);
      onTaskUpdate?.();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="card p-4 mb-3 hover:shadow-md transition-all">
      <div className="flex flex-col gap-3">
        {/* Title and Priority */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
            {task.description && (
              <p className="text-gray-600 text-xs mt-1">{task.description}</p>
            )}
          </div>
          <span className={`badge text-xs whitespace-nowrap ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {/* Status and Assignment Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Selector */}
          <select
            value={updatedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-3 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusColors[updatedStatus]} bg-opacity-20`}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Assignee Section */}
          <div className="flex-1 relative">
            {isEditing ? (
              <div className="flex gap-2">
                <select
                  value={selectedMember}
                  onChange={(e) => handleAssignTask(e.target.value)}
                  className="input-field text-xs py-1"
                  autoFocus
                >
                  <option value="">Unassigned</option>
                  {projectMembers?.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary btn-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                {task.assignedTo ? `👤 ${task.assignedTo.name}` : '+ Assign'}
              </button>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              📅 {new Date(task.dueDate).toLocaleDateString()}
              {task.isOverdue && <span className="badge-danger ml-1 text-xs">Overdue</span>}
            </div>
          )}
        </div>

        {/* Created By */}
        <div className="text-xs text-gray-500 border-t pt-2">
          Created by {task.createdBy?.name}
        </div>
      </div>
    </div>
  );
}
