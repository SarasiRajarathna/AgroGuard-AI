const express = require('express');
const router = express.Router();
const visitsController = require('../controllers/visits.controller');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createVisitValidator } = require('../validators/caseValidator');

router.use(authenticate);

// GET /api/visits - List scheduled and completed field visits
router.get('/', visitsController.getAllVisits);

// POST /api/visits - Schedule extension field inspection
router.post('/', authorize('officer', 'admin'), createVisitValidator, visitsController.createVisit);

// PATCH /api/visits/:id/status - Mark visit done/completed
router.patch('/:id/status', authorize('officer', 'admin'), visitsController.updateVisitStatus);

module.exports = router;
