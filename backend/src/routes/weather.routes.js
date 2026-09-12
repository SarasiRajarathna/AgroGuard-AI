const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// GET /api/weather/current
router.get('/current', weatherController.getCurrentWeather);

// GET /api/weather/forecast
router.get('/forecast', weatherController.getForecast);

module.exports = router;