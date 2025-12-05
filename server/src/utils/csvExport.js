/**
 * Convert applications array to CSV format
 * @param {Array} applications - Array of application objects
 * @returns {string} CSV formatted string
 */
const convertToCSV = (applications) => {
  if (!applications || applications.length === 0) {
    return 'No data available';
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Company',
    'Position',
    'Status',
    'Location',
    'Salary Range',
    'Job URL',
    'Applied Date',
    'Deadline',
    'Notes',
    'Created At'
  ];

  // Create CSV rows
  const rows = applications.map(app => [
    app.id,
    app.company,
    app.position,
    app.status,
    app.location || '',
    app.salary_range || '',
    app.job_url || '',
    app.applied_date || '',
    app.deadline || '',
    app.notes ? `"${app.notes.replace(/"/g, '""')}"` : '', // Escape quotes in notes
    app.created_at
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

module.exports = { convertToCSV };
