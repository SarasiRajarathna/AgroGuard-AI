const { getWeatherForLocation, getWeeklyForecast } = require('../services/weather.service');

// GET /api/weather/current
async function getCurrentWeather(req, res, next) {
  try {
    const { location } = req.query;
    const weather = getWeatherForLocation(location || 'Ampara');
    return res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/weather/forecast
async function getForecast(req, res, next) {
  try {
    const forecast = getWeeklyForecast();
    return res.status(200).json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
};
