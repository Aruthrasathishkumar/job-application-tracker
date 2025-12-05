const express = require('express');
const router = express.Router();
const remindersController = require('../controllers/remindersController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get upcoming reminders (for widget)
router.get('/upcoming', remindersController.getUpcomingReminders);

// CRUD operations
router.get('/', remindersController.getReminders);
router.post('/', remindersController.createReminder);
router.put('/:id', remindersController.updateReminder);
router.delete('/:id', remindersController.deleteReminder);

module.exports = router;
