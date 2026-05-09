import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const memberCount = project.members?.length || 0;

  return (
    <Link to={`/projects/${project._id}`}>
      <div className="card-lg p-6 h-full cursor-pointer transform hover:scale-105 transition-transform duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 truncate">{project.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{project.description}</p>
          </div>
          <span className={`badge text-xs whitespace-nowrap ml-2 ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        {/* Owner */}
        <div className="mb-4 pb-4 border-b">
          <p className="text-xs text-gray-600">
            👤 Owner: <span className="font-medium text-gray-800">{project.owner?.name}</span>
          </p>
        </div>

        {/* Members */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Team Members ({memberCount})</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {project.members?.slice(0, 4).map((member) => (
              <div
                key={member.user._id}
                className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs"
              >
                <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center text-xs leading-5">
                  {member.user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-gray-700 truncate">{member.user.name}</span>
              </div>
            ))}
            {memberCount > 4 && (
              <span className="text-xs text-gray-600 px-2 py-1">+{memberCount - 4} more</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t">
          <button className="btn-primary btn-sm w-full">
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
}
