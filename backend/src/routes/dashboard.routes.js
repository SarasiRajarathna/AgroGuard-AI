const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// GET /api/dashboard/stats - Returns aggregated metrics for the requester's role
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
