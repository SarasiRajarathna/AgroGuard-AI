const express = require('express');
const router = express.Router();
const outbreaksController = require('../controllers/outbreaks.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// GET /api/outbreaks - List active outbreak clusters
router.get('/', outbreaksController.getAllOutbreaks);

// GET /api/outbreaks/provinces - Get provincial risk matrix
router.get('/provinces', outbreaksController.getProvincesRisk);

// GET /api/outbreaks/trends - Pathogen incidence monthly trajectory
router.get('/trends', outbreaksController.getMonthlyTrends);

// POST /api/outbreaks/:id/confirm - Confirm outbreak and dispatch warnings to nearby farms
router.post('/:id/confirm', outbreaksController.confirmOutbreak);

// GET /api/outbreaks/export - Export epidemiological surveillance dataset
router.get('/export', outbreaksController.exportSurveillanceData);

module.exports = router;