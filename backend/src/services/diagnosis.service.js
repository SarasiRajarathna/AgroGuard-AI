const { diagnosePlantImage } = require('./ai.service');
const { getWeatherForLocation } = require('./weather.service');
const { calculateSpreadRisk } = require('../utils/risk');
const dbService = require('./db.service');

/**
 * End-to-end AI crop diagnosis pipeline:
 * Integrates Dual-Engine ML Classifier + Gemini Vision Multimodal Diagnosis
 * with real Open-Meteo micro-climate telemetry and epidemiological risk calculation.
 */
async function runDiagnosisPipeline({
  cropType,
  variety,
  location,
  fieldArea,
  cropStage,
  symptoms,
  imageUrl,
  imageBase64,
  latitude,
  longitude,
  language = 'en',
}) {
  // 1. Resolve geographic coordinates if provided or lookup fallback
  let lat = latitude ? parseFloat(latitude) : null;
  let lng = longitude ? parseFloat(longitude) : null;

  // 2. Micro-Climate Weather Telemetry (Open-Meteo live API with fallback)
  const weather = await getWeatherForLocation(location || 'Ampara', lat, lng);
  const weatherContext = {
    humidity: weather.current.humidity,
    temp: Math.round(weather.current.temp),
    rainfall: weather.current.rainfall,
    condition: weather.current.condition,
    forecast: weather.forecastIndex,
    windSpeed: weather.current.windSpeed,
    leafWetnessHours: weather.current.leafWetnessHours,
    pathogenRiskIndex: weather.current.pathogenRiskIndex,
    isLive: weather.current.isLive || false,
  };

  // 3. Classify foliar pathology using Dual-Engine (MobileNetV3 + Gemini Multimodal Vision)
  const visionResult = await diagnosePlantImage({
    imageBase64,
    imageUrl,
    cropType,
    symptoms,
    language,
  });

  // 4. Query nearby active cases from database or in-memory store
  let nearbyCases = 0;
  try {
    const allCases = await dbService.getCases();
    if (lat && lng) {
      // Haversine distance < 10 km
      const toRad = (v) => (v * Math.PI) / 180;
      nearbyCases = allCases.filter((c) => {
        if (!c.latitude || !c.longitude) return false;
        const dLat = toRad(c.latitude - lat);
        const dLon = toRad(c.longitude - lng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat)) * Math.cos(toRad(c.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const d = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return d <= 10;
      }).length;
    } else {
      nearbyCases = allCases.filter(
        (c) => c.location && location && c.location.toLowerCase().includes(location.toLowerCase())
      ).length;
    }
  } catch (err) {
    nearbyCases = location && location.toLowerCase().includes('ampara') ? 3 : 1;
  }

  // 5. Epidemiological Risk Calculation (Deterministic - explainable disease spread index)
  const spreadRisk = calculateSpreadRisk({
    severity: visionResult.severity,
    humidity: weatherContext.humidity,
    temp: weatherContext.temp,
    rainfall: weatherContext.rainfall,
    nearbyCases,
  });

  // 6. Strict Triage Rules & Human-in-the-Loop Consensus Verification
  // Rule 1: Diagnostic disagreement between ML and Gemini => escalated for officer inspection.
  // Rule 2: Low AI diagnostic confidence (< 75%) => escalated to extension officer.
  // Rule 3: Critical foliar severity => escalated for emergency containment.
  // Rule 4: High consensus agreement and confidence (>= 88%) => confirmed.
  // Rule 5: Moderate confidence (75-87%) => pending validation.
  let status = 'pending';
  let escalationReason = null;

  const trace = visionResult.diagnosticTrace || {};

  if (trace.agreement === false) {
    status = 'escalated';
    escalationReason = `Divergent AI diagnoses between MobileNetV3 ML Model (${trace.ml_prediction?.disease || 'Unknown'}) and Gemini Vision (${trace.gemini_prediction?.disease || 'Unknown'}). Escalated to Agricultural Extension Officer for manual field inspection.`;
  } else if (visionResult.isLowConfidence || visionResult.confidence < 75) {
    status = 'escalated';
    escalationReason =
      `Low AI diagnostic confidence (${visionResult.confidence}%). Automatically escalated to Agricultural Extension Officer for physical verification.`;
  } else if (visionResult.severity === 'critical') {
    status = 'escalated';
    escalationReason = 'Critical foliar severity detected. Escalated for urgent containment inspection.';
  } else if (visionResult.confidence >= 88) {
    status = 'confirmed';
  } else {
    status = 'pending';
  }

  return {
    disease: visionResult.disease,
    scientificName: visionResult.scientificName,
    confidence: visionResult.confidence,
    severity: visionResult.severity,
    status,
    escalationReason,
    spreadRisk,
    weatherContext,
    nearbyAlerts: nearbyCases,
    treatmentSteps: visionResult.treatmentSteps || visionResult.treatment || [],
    preventionSteps: visionResult.preventionSteps || visionResult.prevention || [],
    affectedArea: fieldArea || '1.0 acre',
    estimatedLoss: visionResult.estimatedLoss,
    isLowConfidence: visionResult.isLowConfidence,
    language: visionResult.language,
    aiSource: visionResult.aiSource,
    diagnosticTrace: visionResult.diagnosticTrace,
    mlPrediction: trace.ml_prediction,
    geminiPrediction: trace.gemini_prediction,
    agreement: trace.agreement,
  };
}

module.exports = {
  runDiagnosisPipeline,
};
