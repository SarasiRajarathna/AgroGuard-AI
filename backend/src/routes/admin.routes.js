const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(authenticate);

// Stakeholder user directory - Admin only
router.get('/users', authorize('admin'), adminController.getAllUsers);
router.patch('/users/:id/status', authorize('admin'), adminController.updateUserStatus);

// System health probe - Admin only
router.get('/system-health', authorize('admin'), adminController.getSystemHealth);

module.exports = router;