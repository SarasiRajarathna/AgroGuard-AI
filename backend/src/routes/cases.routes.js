const express = require('express');
const router = express.Router();
const casesController = require('../controllers/cases.controller');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createCaseValidator, reviewCaseValidator } = require('../validators/caseValidator');

// All case routes require authentication
router.use(authenticate);

// GET /api/cases - List cases (filterable by role, status, search)
router.get('/', casesController.getAllCases);

// GET /api/cases/:id - Get case details
router.get('/:id', casesController.getCaseById);

// POST /api/cases - Submit new case & initiate AI diagnosis
router.post('/', createCaseValidator, casesController.createCase);

// PATCH /api/cases/:id/escalate - Escalate to agricultural extension officer
router.patch('/:id/escalate', casesController.escalateCase);

// PATCH /api/cases/:id/review - Officer review (confirm/modify/reject + schedule visit)
router.patch('/:id/review', authorize('officer', 'admin'), reviewCaseValidator, casesController.reviewCase);

module.exports = router;