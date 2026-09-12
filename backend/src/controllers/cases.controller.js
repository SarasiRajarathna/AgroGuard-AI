const dbService = require('../services/db.service');
const { runDiagnosisPipeline } = require('../services/diagnosis.service');

// GET /api/cases
async function getAllCases(req, res, next) {
  try {
    const { status, search, cropType } = req.query;
    const role = req.user?.role;
    const farmerId = req.user?.id;

    let cases = await dbService.getCases({
      farmerId,
      status,
      search,
      role,
    });

    if (cropType) {
      cases = cases.filter(c => c.cropType.toLowerCase().includes(cropType.toLowerCase()));
    }

    return res.status(200).json({
      success: true,
      data: cases,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/cases/:id
async function getCaseById(req, res, next) {
  try {
    const { id } = req.params;
    const found = await dbService.getCaseById(id);

    if (!found) {
      return res.status(404).json({
        success: false,
        message: `Case with ID ${id} not found.`,
      });
    }

    if (req.user?.role === 'farmer' && Number(found.farmerId) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this case.',
      });
    }

    return res.status(200).json({
      success: true,
      data: found,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/cases
async function createCase(req, res, next) {
  try {
    const {
      cropType,
      variety,
      location,
      fieldArea,
      cropStage,
      symptoms,
      imageUrl,
      imageBase64,
      farmId,
      latitude,
      longitude,
      language = 'en',
    } = req.body;

    const farmerId = req.user?.id || 1;
    const farmerName = req.user?.name || 'Ruwan Perera';
    const farmerPhone = req.user?.phone || '';

    // If farmId provided and coords missing, auto-fill from farm
    let lat = latitude;
    let lng = longitude;
    let loc = location;
    if (farmId && (!lat || !lng)) {
      const farm = await dbService.getFarmById(farmId);
      if (farm) {
        lat = farm.latitude;
        lng = farm.longitude;
        if (!loc) loc = farm.location;
      }
    }

    // Execute complete AI Diagnosis & Risk Pipeline
    const diagnosis = await runDiagnosisPipeline({
      cropType,
      variety,
      location: loc,
      fieldArea,
      cropStage,
      symptoms,
      imageUrl,
      imageBase64,
      latitude: lat,
      longitude: lng,
      language,
    });

    const newCase = await dbService.createCase({
      cropType,
      variety,
      location: loc,
      latitude: lat ? parseFloat(lat) : null,
      longitude: lng ? parseFloat(lng) : null,
      farmId: farmId ? Number(farmId) : null,
      language,
      fieldArea,
      cropStage,
      symptoms,
      imageUrl,
      farmerId,
      farmerName,
      farmerPhone,
      ...diagnosis,
    });

    return res.status(201).json({
      success: true,
      message: 'Crop specimen analyzed and diagnosis record created successfully.',
      data: newCase,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/cases/:id/escalate
async function escalateCase(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const existing = await dbService.getCaseById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Case with ID ${id} not found.`,
      });
    }

    if (req.user?.role === 'farmer' && Number(existing.farmerId) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only escalate your own cases.',
      });
    }

    const updated = await dbService.updateCase(id, {
      status: 'escalated',
      escalationReason: reason || 'Farmer requested field officer confirmation',
    });

    // Notify extension officers
    await dbService.createNotification({
      userId: 2, // Dr. Anura Bandara
      text: `Case ${id} (${updated.cropType} - ${updated.disease}) was escalated by ${updated.farmerName} for field confirmation.`,
      type: 'alert',
    });

    dbService.logActivity({
      userId: req.user?.id,
      action: 'CASE_ESCALATED',
      entity: 'cases',
      entityId: id,
      metadata: { reason },
    });

    return res.status(200).json({
      success: true,
      message: 'Case successfully escalated to Agriculture Extension Officer.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/cases/:id/review
async function reviewCase(req, res, next) {
  try {
    const { id } = req.params;
    const { decision, verifiedDisease, verifiedSeverity, recommendation, officerNotes, scheduleVisit, visitDate } = req.body;

    const existing = await dbService.getCaseById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Case with ID ${id} not found.`,
      });
    }

    const newStatus = decision === 'confirm' || decision === 'modify' ? 'confirmed' : 'rejected';
    const finalDisease = (decision === 'modify' && verifiedDisease) ? verifiedDisease : (verifiedDisease || existing.disease);

    const updated = await dbService.updateCase(id, {
      status: newStatus,
      disease: finalDisease,
      officerId: req.user?.id || 2,
      officerNotes: officerNotes || recommendation || existing.officerNotes,
      officerVerified: true,
      verifiedDisease: finalDisease,
      verifiedSeverity: verifiedSeverity || existing.severity,
      verifiedAt: new Date().toISOString(),
      verifiedBy: req.user?.name || 'Dr. Anura Bandara',
      officerRecommendation: recommendation || officerNotes || '',
    });

    let newVisit = null;
    if (scheduleVisit) {
      newVisit = await dbService.createVisit({
        caseId: id,
        farmerId: existing.farmerId,
        farmerName: existing.farmerName,
        location: existing.location,
        cropType: existing.cropType,
        scheduledDate: visitDate || new Date().toISOString().split('T')[0],
        notes: officerNotes || recommendation || 'On-site disease containment inspection',
        officerId: req.user?.id || 2,
      });
    }

    // Notify farmer
    await dbService.createNotification({
      userId: existing.farmerId,
      text: `Your case #${id} has been reviewed by officer ${req.user?.name || 'Dr. Anura Bandara'}. Verified diagnosis: ${finalDisease}. Status: ${newStatus.toUpperCase()}`,
      type: newStatus === 'confirmed' ? 'success' : 'info',
    });

    dbService.logActivity({
      userId: req.user?.id,
      action: 'CASE_REVIEWED',
      entity: 'cases',
      entityId: id,
      metadata: { decision, newStatus, scheduleVisit: !!scheduleVisit },
    });

    return res.status(200).json({
      success: true,
      message: `Case ${id} reviewed successfully. Decision recorded as ${newStatus}.`,
      data: {
        case: updated,
        visit: newVisit,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  escalateCase,
  reviewCase,
};
