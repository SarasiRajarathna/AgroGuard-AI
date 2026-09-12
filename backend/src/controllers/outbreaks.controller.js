const dbService = require('../services/db.service');
const {
  getProvincesRiskData,
  getMonthlyTrajectory,
  detectOutbreakClusters,
  confirmOutbreakAndAlertFarms,
} = require('../services/outbreak.service');

// GET /api/outbreaks
async function getAllOutbreaks(req, res, next) {
  try {
    let outbreaks = await dbService.getOutbreaks();
    // Also run dynamic cluster detection to enrich outbreaks
    try {
      const detected = await detectOutbreakClusters();
      // Merge detected if not already present
      for (const d of detected) {
        if (!outbreaks.some((o) => o.disease === d.disease && o.location === d.location)) {
          outbreaks.push(d);
        }
      }
    } catch (clusterErr) {
      console.warn('Dynamic cluster detection note:', clusterErr.message);
    }

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
    const provinces = await getProvincesRiskData();
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

// POST /api/outbreaks/:id/confirm
// Requirement 7: Confirm an outbreak and trigger automatic biosecurity warning to nearby farms within radius
async function confirmOutbreak(req, res, next) {
  try {
    const { id } = req.params;
    const { radiusKm } = req.body;

    const result = await confirmOutbreakAndAlertFarms(id, radiusKm ? parseFloat(radiusKm) : 10);

    dbService.logActivity({
      userId: req.user?.id,
      action: 'OUTBREAK_CONFIRMED_ALERTS_SENT',
      entity: 'outbreaks',
      entityId: id,
      metadata: { notifiedCount: result.notifiedCount },
    });

    return res.status(200).json({
      success: true,
      message: `Outbreak confirmed. Urgent biosecurity alerts dispatched to ${result.notifiedCount} registered farms within warning radius.`,
      data: result,
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
    const farms = await dbService.getFarms();
    const provinces = await getProvincesRiskData();

    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      institution: 'Crop Research Institute Sri Lanka',
      totalActiveOutbreaks: outbreaks.length,
      totalRegisteredFarms: farms.length,
      totalMonitoredCases: cases.length,
      outbreaks,
      casesSummary: cases.map(c => ({
        id: c.id,
        disease: c.disease,
        crop: c.cropType,
        location: c.location,
        latitude: c.latitude,
        longitude: c.longitude,
        status: c.status,
        severity: c.severity,
        spreadRisk: c.spreadRisk,
        officerVerified: c.officerVerified,
        submittedAt: c.submittedAt,
      })),
      registeredFarms: farms.map(f => ({
        id: f.id,
        name: f.name,
        location: f.location,
        latitude: f.latitude,
        longitude: f.longitude,
        crop: f.cropType,
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
  confirmOutbreak,
  exportSurveillanceData,
};
