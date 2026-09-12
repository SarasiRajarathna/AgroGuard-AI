/**
 * Epidemiological Pathogen Spread Risk Calculator
 * Calculates a dynamic risk index (0 - 100) based on micro-climatic parameters,
 * disease severity, and neighboring active cases.
 */

function calculateSpreadRisk({ severity = 'medium', humidity = 80, temp = 28, rainfall = 10, nearbyCases = 2 }) {
  let baseScore = 50;

  // Severity Weight
  switch (severity.toLowerCase()) {
    case 'critical':
      baseScore += 25;
      break;
    case 'high':
      baseScore += 18;
      break;
    case 'medium':
      baseScore += 8;
      break;
    case 'low':
      baseScore -= 10;
      break;
  }

  // Relative Humidity Factor (fungal spores thrive above 80% RH)
  if (humidity >= 88) {
    baseScore += 16;
  } else if (humidity >= 80) {
    baseScore += 10;
  } else if (humidity < 60) {
    baseScore -= 12;
  }

  // Surface Temperature (22°C - 30°C optimal for foliar fungal and bacterial proliferation)
  if (temp >= 24 && temp <= 30) {
    baseScore += 8;
  } else if (temp > 35 || temp < 15) {
    baseScore -= 8;
  }

  // Rainfall & Leaf Wetness
  if (rainfall >= 15) {
    baseScore += 10;
  } else if (rainfall >= 5) {
    baseScore += 5;
  }

  // Neighboring Outbreak / Case Proximity
  if (nearbyCases > 8) {
    baseScore += 15;
  } else if (nearbyCases > 3) {
    baseScore += 8;
  } else if (nearbyCases > 0) {
    baseScore += 4;
  }

  // Clamp score between 10 and 99
  return Math.min(99, Math.max(10, Math.round(baseScore)));
}

module.exports = {
  calculateSpreadRisk,
};
