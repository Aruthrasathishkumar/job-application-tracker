const pool = require('../config/db');

/**
 * Get all reminders for authenticated user
 */
const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT r.*, a.company, a.position
       FROM reminders r
       JOIN applications a ON r.application_id = a.id
       WHERE r.user_id = $1
       ORDER BY r.reminder_date ASC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get upcoming reminders (next 7 days)
 */
const getUpcomingReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const result = await pool.query(
      `SELECT r.*, a.company, a.position, a.status
       FROM reminders r
       JOIN applications a ON r.application_id = a.id
       WHERE r.user_id = $1
         AND r.is_sent = FALSE
         AND r.reminder_date >= CURRENT_DATE
         AND r.reminder_date <= $2
       ORDER BY r.reminder_date ASC`,
      [userId, nextWeek.toISOString().split('T')[0]]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get upcoming reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create a new reminder
 */
const createReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { application_id, reminder_date, message } = req.body;

    // Validation
    if (!application_id || !reminder_date || !message) {
      return res.status(400).json({
        success: false,
        message: 'Application ID, reminder date, and message are required'
      });
    }

    // Check if application belongs to user
    const appCheck = await pool.query(
      'SELECT id FROM applications WHERE id = $1 AND user_id = $2',
      [application_id, userId]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const result = await pool.query(
      `INSERT INTO reminders (application_id, user_id, reminder_date, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [application_id, userId, reminder_date, message]
    );

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update reminder
 */
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reminder_date, message, is_sent } = req.body;

    const result = await pool.query(
      `UPDATE reminders
       SET reminder_date = COALESCE($1, reminder_date),
           message = COALESCE($2, message),
           is_sent = COALESCE($3, is_sent)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [reminder_date, message, is_sent, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete reminder
 */
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getReminders,
  getUpcomingReminders,
  createReminder,
  updateReminder,
  deleteReminder
};
