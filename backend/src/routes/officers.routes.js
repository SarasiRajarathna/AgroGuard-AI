const express = require('express');
const router = express.Router();
const officersController = require('../controllers/officers.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// GET /api/officers - Extension officers list
router.get('/', officersController.getAllOfficers);

module.exports = router;