/**
 * Outbreak and Epidemiological Surveillance Service
 */

const PROVINCE_RISK_DATA = [
  { name: 'Eastern Province', cases: 84, risk: 'Critical', activeDisease: 'Paddy Blast', farmsAtRisk: 140, color: 'bg-red-500' },
  { name: 'Central Province', cases: 42, risk: 'High', activeDisease: 'Tea Blister Blight', farmsAtRisk: 75, color: 'bg-orange-500' },
  { name: 'North Central', cases: 61, risk: 'High', activeDisease: 'Sheath Blight', farmsAtRisk: 110, color: 'bg-amber-500' },
  { name: 'North Western', cases: 29, risk: 'Moderate', activeDisease: 'Bacterial Wilt', farmsAtRisk: 45, color: 'bg-yellow-500' },
  { name: 'Western Province', cases: 14, risk: 'Low', activeDisease: 'Powdery Mildew', farmsAtRisk: 20, color: 'bg-emerald-500' },
  { name: 'Southern Province', cases: 18, risk: 'Low', activeDisease: 'Cinnamon Stripe', farmsAtRisk: 28, color: 'bg-emerald-500' },
];

const MONTHLY_TRAJECTORY = [
  { month: 'Apr', blast: 40, blight: 25, sheath: 15 },
  { month: 'May', blast: 55, blight: 35, sheath: 28 },
  { month: 'Jun', blast: 70, blight: 50, sheath: 42 },
  { month: 'Jul', blast: 85, blight: 40, sheath: 60 },
  { month: 'Aug', blast: 95, blight: 65, sheath: 45 },
  { month: 'Sep (Now)', blast: 112, blight: 55, sheath: 70 },
];

function getProvincesRiskData() {
  return PROVINCE_RISK_DATA;
}

function getMonthlyTrajectory() {
  return MONTHLY_TRAJECTORY;
}

module.exports = {
  getProvincesRiskData,
  getMonthlyTrajectory,
};
