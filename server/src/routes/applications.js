const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Statistics
router.get('/stats', applicationsController.getStats);

// CSV Export
router.get('/export', applicationsController.exportToCSV);

// CRUD operations
router.get('/', applicationsController.getApplications);
router.get('/:id', applicationsController.getApplicationById);
router.post('/', applicationsController.createApplication);
router.put('/:id', applicationsController.updateApplication);
router.delete('/:id', applicationsController.deleteApplication);

// Status update (for drag-and-drop)
router.patch('/:id/status', applicationsController.updateStatus);

module.exports = router;
