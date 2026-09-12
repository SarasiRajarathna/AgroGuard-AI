const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { broadcastAlertValidator } = require('../validators/caseValidator');

router.use(authenticate);

// GET /api/alerts/active - Active regional alerts
router.get('/active', alertsController.getActiveAlerts);

// POST /api/alerts/broadcast - Broadcast regional outbreak warning
router.post('/broadcast', authorize('admin'), broadcastAlertValidator, alertsController.broadcastAlert);

module.exports = router;
