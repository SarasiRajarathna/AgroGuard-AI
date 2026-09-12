/**
 * Regional Micro-Climate Weather Telemetry Service
 * Delivers live meteorological feeds and pathogen propagation indices
 */

const DISTRICT_WEATHER = {
  'ampara': {
    location: 'Ampara, Eastern Province',
    current: { temp: 28.4, humidity: 87, rainfall: 14, windSpeed: 12, condition: 'High Humidity / Overcast' },
    forecastIndex: 'Elevated (Blast & Blight Watch)',
    leafWetnessHours: 7.5,
  },
  'nuwara eliya': {
    location: 'Nuwara Eliya, Central Province',
    current: { temp: 18.2, humidity: 92, rainfall: 28, windSpeed: 16, condition: 'Misty / Continuous Drizzle' },
    forecastIndex: 'High (Blister Blight Alert)',
    leafWetnessHours: 9.0,
  },
  'kurunegala': {
    location: 'Kurunegala, North Western Province',
    current: { temp: 32.1, humidity: 75, rainfall: 0, windSpeed: 14, condition: 'Warm & Dry' },
    forecastIndex: 'Elevated (Pest/Armyworm Watch)',
    leafWetnessHours: 3.5,
  },
  'kandy': {
    location: 'Kandy, Central Province',
    current: { temp: 24.5, humidity: 84, rainfall: 8, windSpeed: 10, condition: 'Intermittent Showers' },
    forecastIndex: 'Moderate Risk',
    leafWetnessHours: 5.5,
  },
  'puttalam': {
    location: 'Puttalam, North Western Province',
    current: { temp: 30.5, humidity: 80, rainfall: 5, windSpeed: 18, condition: 'Coastal Breezes' },
    forecastIndex: 'Moderate Risk',
    leafWetnessHours: 4.0,
  },
  'badulla': {
    location: 'Badulla, Uva Province',
    current: { temp: 22.0, humidity: 90, rainfall: 18, windSpeed: 8, condition: 'Humid Valley Mist' },
    forecastIndex: 'High (Late Blight Threat)',
    leafWetnessHours: 8.0,
  },
};

function getWeatherForLocation(loc = '') {
  const normalized = loc.toLowerCase();
  for (const key of Object.keys(DISTRICT_WEATHER)) {
    if (normalized.includes(key)) {
      return DISTRICT_WEATHER[key];
    }
  }
  return DISTRICT_WEATHER['ampara'];
}

function getWeeklyForecast() {
  return [
    { day: 'Mon', temp: 29, rainfall: 5, riskLevel: 'low' },
    { day: 'Tue', temp: 27, rainfall: 18, riskLevel: 'high' },
    { day: 'Wed', temp: 26, rainfall: 22, riskLevel: 'high' },
    { day: 'Thu', temp: 28, rainfall: 10, riskLevel: 'medium' },
    { day: 'Fri', temp: 30, rainfall: 2, riskLevel: 'low' },
  ];
}

module.exports = {
  getWeatherForLocation,
  getWeeklyForecast,
  DISTRICT_WEATHER,
};
