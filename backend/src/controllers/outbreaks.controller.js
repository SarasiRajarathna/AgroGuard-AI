const dbService = require('../services/db.service');
const { getProvincesRiskData, getMonthlyTrajectory } = require('../services/outbreak.service');

// GET /api/outbreaks
async function getAllOutbreaks(req, res, next) {
  try {
    const outbreaks = await dbService.getOutbreaks();
    return res.status(200).json({
      success: true,
      data: outbreaks,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/outbreaks/provinces
async function getProvincesRisk(req, res, next) {
  try {
    const provinces = getProvincesRiskData();
    return res.status(200).json({
      success: true,
      data: provinces,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/outbreaks/trends
async function getMonthlyTrends(req, res, next) {
  try {
    const trends = getMonthlyTrajectory();
    return res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/outbreaks/export
async function exportSurveillanceData(req, res, next) {
  try {
    const outbreaks = await dbService.getOutbreaks();
    const cases = await dbService.getCases();
    const provinces = getProvincesRiskData();

    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      institution: 'Crop Research Institute Sri Lanka',
      totalActiveOutbreaks: outbreaks.length,
      outbreaks,
      casesSummary: cases.map(c => ({
        id: c.id,
        disease: c.disease,
        crop: c.cropType,
        location: c.location,
        status: c.status,
        severity: c.severity,
        spreadRisk: c.spreadRisk,
        submittedAt: c.submittedAt,
      })),
      provincialClusters: provinces,
    };

    return res.status(200).json({
      success: true,
      message: 'Surveillance dataset exported successfully',
      data: exportPayload,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllOutbreaks,
  getProvincesRisk,
  getMonthlyTrends,
  exportSurveillanceData,
};
