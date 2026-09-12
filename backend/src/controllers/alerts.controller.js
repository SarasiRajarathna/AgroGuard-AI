const dbService = require('../services/db.service');

// GET /api/alerts/active
async function getActiveAlerts(req, res, next) {
  try {
    const alerts = await dbService.getAlerts();
    return res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/alerts/broadcast
async function broadcastAlert(req, res, next) {
  try {
    const { province, threatLevel, cropTarget, broadcastMessage } = req.body;

    const newAlert = await dbService.createAlert({
      province,
      threatLevel,
      cropTarget,
      broadcastMessage,
      createdBy: req.user?.id || 4,
    });

    dbService.logActivity({
      userId: req.user?.id,
      action: 'BROADCAST_ALERT_DISPATCHED',
      entity: 'alerts',
      entityId: String(newAlert.id),
      metadata: { province, threatLevel, cropTarget },
    });

    return res.status(201).json({
      success: true,
      message: `Early Warning SMS & Push Broadcast successfully transmitted to farmers in ${province}!`,
      data: newAlert,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getActiveAlerts,
  broadcastAlert,
};
