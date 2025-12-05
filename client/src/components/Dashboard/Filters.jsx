import { useState } from 'react';

function Filters({ onFilterChange, onSearch, onExport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statuses = [
    { value: 'all', label: 'All Applications' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onFilterChange({ status: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search by company or position..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-field"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="input-field"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onExport}
          className="btn-outline whitespace-nowrap w-full md:w-auto"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default Filters;
