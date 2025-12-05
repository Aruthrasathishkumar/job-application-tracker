const pool = require('../config/db');
const { convertToCSV } = require('../utils/csvExport');

/**
 * Get all applications for the authenticated user
 * Supports search, filter, and sorting
 */
const getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

    let query = 'SELECT * FROM applications WHERE user_id = $1';
    const queryParams = [userId];
    let paramCount = 1;

    // Filter by status
    if (status && status !== 'all') {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      queryParams.push(status);
    }

    // Search by company or position
    if (search) {
      paramCount++;
      query += ` AND (LOWER(company) LIKE $${paramCount} OR LOWER(position) LIKE $${paramCount})`;
      queryParams.push(`%${search.toLowerCase()}%`);
    }

    // Sorting
    const allowedSortFields = ['company', 'position', 'status', 'applied_date', 'deadline', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    query += ` ORDER BY ${sortField} ${sortDirection}`;

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get single application by ID
 */
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create new application
 */
const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company,
      position,
      status = 'applied',
      job_url,
      location,
      salary_range,
      notes,
      applied_date,
      deadline
    } = req.body;

    // Validation
    if (!company || !position) {
      return res.status(400).json({
        success: false,
        message: 'Company and position are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO applications
       (user_id, company, position, status, job_url, location, salary_range, notes, applied_date, deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [userId, company, position, status, job_url, location, salary_range, notes, applied_date, deadline]
    );

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update application
 */
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      company,
      position,
      status,
      job_url,
      location,
      salary_range,
      notes,
      applied_date,
      deadline
    } = req.body;

    // Check if application exists and belongs to user
    const existingApp = await pool.query(
      'SELECT id FROM applications WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingApp.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const result = await pool.query(
      `UPDATE applications
       SET company = COALESCE($1, company),
           position = COALESCE($2, position),
           status = COALESCE($3, status),
           job_url = COALESCE($4, job_url),
           location = COALESCE($5, location),
           salary_range = COALESCE($6, salary_range),
           notes = COALESCE($7, notes),
           applied_date = COALESCE($8, applied_date),
           deadline = COALESCE($9, deadline)
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [company, position, status, job_url, location, salary_range, notes, applied_date, deadline, id, userId]
    );

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete application
 */
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update application status (for drag-and-drop)
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Export applications to CSV
 */
const exportToCSV = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = 'SELECT * FROM applications WHERE user_id = $1';
    const queryParams = [userId];

    if (status && status !== 'all') {
      query += ' AND status = $2';
      queryParams.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, queryParams);

    const csv = convertToCSV(result.rows);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=job-applications.csv');

    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get application statistics
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'wishlist') as wishlist,
        COUNT(*) FILTER (WHERE status = 'applied') as applied,
        COUNT(*) FILTER (WHERE status = 'interview') as interview,
        COUNT(*) FILTER (WHERE status = 'offer') as offer,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
       FROM applications
       WHERE user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  exportToCSV,
  getStats
};
