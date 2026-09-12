const dbService = require('../services/db.service');

// GET /api/visits
async function getAllVisits(req, res, next) {
  try {
    const { status } = req.query;
    const visits = await dbService.getVisits({ status });
    return res.status(200).json({
      success: true,
      data: visits,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/visits
async function createVisit(req, res, next) {
  try {
    const {
      farmerName,
      location,
      cropType,
      scheduledDate,
      notes,
      caseId,
      farmerId,
      priority,
    } = req.body;

    const newVisit = await dbService.createVisit({
      farmerName,
      location,
      cropType,
      scheduledDate,
      notes,
      caseId,
      farmerId,
      priority,
      officerId: req.user?.id || 2,
    });

    return res.status(201).json({
      success: true,
      message: `Field inspection scheduled for ${farmerName} on ${scheduledDate}.`,
      data: newVisit,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/visits/:id/status
async function updateVisitStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await dbService.updateVisitStatus(id, status || 'completed');
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Field visit ${id} not found.`,
      });
    }

    dbService.logActivity({
      userId: req.user?.id,
      action: 'FIELD_VISIT_STATUS_UPDATED',
      entity: 'field_visits',
      entityId: id,
      metadata: { status },
    });

    return res.status(200).json({
      success: true,
      message: `Field visit ${id} status updated to ${status || 'completed'}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllVisits,
  createVisit,
  updateVisitStatus,
};
