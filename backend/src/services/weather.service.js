/**
 * Regional Micro-Climate Weather Telemetry Service
 * Delivers live meteorological feeds and pathogen propagation indices
 * via Open-Meteo Free API and OpenWeatherMap (if configured).
 */

const { REGION_COORDINATES } = require('../utils/distance');

// WMO Weather code interpreter
function decodeWmoCode(code) {
  if (code === 0) return 'Clear Skies';
  if (code === 1 || code === 2) return 'Mainly Clear / Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy / Dew Deposit';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 80 && code <= 82) return 'Heavy Torrential Rain';
  if (code >= 95) return 'Thunderstorm';
  return 'Humid / Variable';
}

// Fallback baseline for Sri Lankan agricultural districts (offline safety)
const REGIONAL_BASELINES = {
  'ampara': { temp: 28.4, humidity: 87, rainfall: 14, windSpeed: 12, condition: 'High Humidity / Overcast' },
  'nuwara eliya': { temp: 18.2, humidity: 92, rainfall: 28, windSpeed: 16, condition: 'Misty / Continuous Drizzle' },
  'kurunegala': { temp: 32.1, humidity: 75, rainfall: 0, windSpeed: 14, condition: 'Warm & Dry' },
  'kandy': { temp: 24.5, humidity: 84, rainfall: 8, windSpeed: 10, condition: 'Intermittent Showers' },
  'puttalam': { temp: 30.5, humidity: 80, rainfall: 5, windSpeed: 18, condition: 'Coastal Breezes' },
  'badulla': { temp: 22.0, humidity: 90, rainfall: 18, windSpeed: 8, condition: 'Humid Valley Mist' },
  'anuradhapura': { temp: 31.0, humidity: 72, rainfall: 2, windSpeed: 11, condition: 'Dry Zone Breeze' },
  'polonnaruwa': { temp: 30.0, humidity: 78, rainfall: 6, windSpeed: 12, condition: 'Partly Cloudy' },
};

function resolveCoordinates(location = '', lat = null, lng = null) {
  if (lat !== null && lng !== null && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return { lat: Number(lat), lng: Number(lng), name: location || 'Custom Location' };
  }

  const clean = location.toLowerCase();
  for (const [district, coords] of Object.entries(REGION_COORDINATES)) {
    if (clean.includes(district.toLowerCase())) {
      return { lat: coords.lat, lng: coords.lng, name: `${district}, ${coords.province}` };
    }
  }

  // Default to Ampara Rice Belt
  const def = REGION_COORDINATES['Ampara'];
  return { lat: def.lat, lng: def.lng, name: location || 'Ampara, Eastern Province' };
}

/**
 * Fetches real-time weather from Open-Meteo for given coordinates
 * @param {number} latitude
 * @param {number} longitude
 */
async function getWeather(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const temp = Math.round((current.temperature_2m ?? 28) * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m ?? 80);
    const rainfall = Math.round((current.precipitation ?? 0) * 10) / 10;
    const windSpeed = Math.round((current.wind_speed_10m ?? 10) * 10) / 10;
    const condition = decodeWmoCode(current.weather_code);

    // Compute empirical leaf wetness duration
    let leafWetnessHours = 3.0;
    if (humidity >= 90 || rainfall > 10) {
      leafWetnessHours = 8.5;
    } else if (humidity >= 80 || rainfall > 0) {
      leafWetnessHours = 6.0;
    } else if (humidity >= 70) {
      leafWetnessHours = 4.0;
    }

    // Pathogen forecast index
    let forecastIndex = 'Low Risk';
    if (humidity >= 85 && (temp >= 22 && temp <= 30)) {
      forecastIndex = 'Elevated (Blast & Blight Watch)';
    } else if (humidity >= 78) {
      forecastIndex = 'Moderate Risk';
    } else if (temp > 32 && humidity < 60) {
      forecastIndex = 'Pest/Armyworm Watch';
    }

    // Weekly forecast entries
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecast = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const d = new Date(daily.time[i]);
        const dayTemp = Math.round((daily.temperature_2m_max[i] ?? temp));
        const dayRain = Math.round((daily.precipitation_sum[i] ?? 0));
        forecast.push({
          day: days[d.getDay()],
          date: daily.time[i],
          temp: dayTemp,
          rainfall: dayRain,
          riskLevel: dayRain > 15 ? 'high' : dayRain > 5 ? 'medium' : 'low',
        });
      }
    }

    return {
      source: 'Open-Meteo Live API',
      latitude: lat,
      longitude: lng,
      current: {
        temp,
        humidity,
        rainfall,
        windSpeed,
        condition,
      },
      forecastIndex,
      leafWetnessHours,
      forecast: forecast.length > 0 ? forecast : getWeeklyForecast(),
    };
  } catch (error) {
    console.warn(`[WeatherService] Live API request failed (${error.message}). Using resilient regional baseline.`);
    return getFallbackWeather(lat, lng);
  }
}

function getFallbackWeather(lat, lng) {
  // Find closest district baseline
  let closestKey = 'ampara';
  let minDiff = Infinity;
  for (const [key, coords] of Object.entries(REGION_COORDINATES)) {
    const diff = Math.abs(coords.lat - lat) + Math.abs(coords.lng - lng);
    if (diff < minDiff) {
      minDiff = diff;
      closestKey = key.toLowerCase();
    }
  }

  const base = REGIONAL_BASELINES[closestKey] || REGIONAL_BASELINES['ampara'];
  return {
    source: 'Regional Agronomic Baseline (Fallback)',
    latitude: lat,
    longitude: lng,
    current: {
      temp: base.temp,
      humidity: base.humidity,
      rainfall: base.rainfall,
      windSpeed: base.windSpeed,
      condition: base.condition,
    },
    forecastIndex: base.humidity >= 85 ? 'Elevated (Blast & Blight Watch)' : 'Moderate Risk',
    leafWetnessHours: base.humidity >= 85 ? 7.5 : 4.5,
    forecast: getWeeklyForecast(),
  };
}

/**
 * Abstraction for location name or coordinates
 */
async function getWeatherForLocation(loc = '', lat = null, lng = null) {
  const coords = resolveCoordinates(loc, lat, lng);
  const weather = await getWeather(coords.lat, coords.lng);
  return {
    location: coords.name,
    ...weather,
  };
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
  getWeather,
  getWeatherForLocation,
  getWeeklyForecast,
  resolveCoordinates,
};

