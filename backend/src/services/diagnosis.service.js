const { classifyCropDisease } = require('./gemini.service');
const { getWeatherForLocation } = require('./weather.service');
const { calculateSpreadRisk } = require('../utils/risk');

/**
 * End-to-end AI crop diagnosis pipeline:
 * Integrates Computer Vision classification with micro-climate telemetry and epidemiological spread modeling.
 */
async function runDiagnosisPipeline({
  cropType,
  variety,
  location,
  fieldArea,
  cropStage,
  symptoms,
  imageUrl,
}) {
  // 1. Get Micro-Climate Weather Context
  const weather = getWeatherForLocation(location || 'Ampara');
  const weatherContext = {
    humidity: weather.current.humidity,
    temp: Math.round(weather.current.temp),
    rainfall: weather.current.rainfall,
    condition: weather.current.condition,
    forecast: weather.forecastIndex,
  };

  // 2. Classify foliar pathology using Vision & Symptom Knowledge Base
  const visionResult = await classifyCropDisease({
    cropType,
    symptoms,
    imageUrl,
  });

  // 3. Epidemiological Risk Calculation
  const nearbyCases = location && location.toLowerCase().includes('ampara') ? 3 : 2;
  const spreadRisk = calculateSpreadRisk({
    severity: visionResult.severity,
    humidity: weatherContext.humidity,
    temp: weatherContext.temp,
    rainfall: weatherContext.rainfall,
    nearbyCases,
  });

  // 4. Determine initial triage status
  // High confidence (>90%) and low/moderate severity => confirmed; critical severity => escalated; else pending
  let status = 'pending';
  if (visionResult.confidence >= 92 && visionResult.severity !== 'critical') {
    status = 'confirmed';
  } else if (visionResult.severity === 'critical' || visionResult.confidence < 75) {
    status = 'escalated';
  }

  return {
    disease: visionResult.disease,
    scientificName: visionResult.scientificName,
    confidence: visionResult.confidence,
    severity: visionResult.severity,
    status,
    spreadRisk,
    weatherContext,
    nearbyAlerts: nearbyCases,
    treatmentSteps: visionResult.treatmentSteps,
    affectedArea: fieldArea || '1.0 acre',
    estimatedLoss: visionResult.estimatedLoss,
  };
}

module.exports = {
  runDiagnosisPipeline,
};
