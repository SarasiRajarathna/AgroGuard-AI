const express = require('express');
const router = express.Router();
const farmsController = require('../controllers/farms.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// GET /api/farms - List farms
router.get('/', farmsController.getAllFarms);

// GET /api/farms/:id - Get single farm
router.get('/:id', farmsController.getFarmById);

// POST /api/farms - Register new farm
router.post('/', farmsController.createFarm);

module.exports = router;
