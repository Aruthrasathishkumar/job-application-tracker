import { useState } from 'react';
import { applicationsAPI } from '../../services/api';

function KanbanBoard({ applications, onUpdate }) {
  const [draggedItem, setDraggedItem] = useState(null);

  const columns = [
    { id: 'wishlist', title: 'Wishlist', color: 'bg-gray-100' },
    { id: 'applied', title: 'Applied', color: 'bg-blue-100' },
    { id: 'interview', title: 'Interview', color: 'bg-purple-100' },
    { id: 'offer', title: 'Offer', color: 'bg-green-100' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-100' },
  ];

  const handleDragStart = (e, application) => {
    setDraggedItem(application);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.status === newStatus) {
      setDraggedItem(null);
      return;
    }

    try {
      await applicationsAPI.updateStatus(draggedItem.id, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    } finally {
      setDraggedItem(null);
    }
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter((app) => app.status === status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {columns.map((column) => {
        const columnApps = getApplicationsByStatus(column.id);

        return (
          <div
            key={column.id}
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                {columnApps.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {columnApps.map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow duration-200"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{app.company}</h4>
                  <p className="text-sm text-gray-600 mb-3">{app.position}</p>

                  {app.location && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {app.location}
                    </div>
                  )}

                  {app.salary_range && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {app.salary_range}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    {app.applied_date && (
                      <span className="text-xs text-gray-500">
                        Applied: {formatDate(app.applied_date)}
                      </span>
                    )}
                    {app.deadline && (
                      <span className="text-xs text-red-600 font-medium">
                        Due: {formatDate(app.deadline)}
                      </span>
                    )}
                  </div>

                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Job Posting →
                    </a>
                  )}
                </div>
              ))}

              {columnApps.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No applications
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
