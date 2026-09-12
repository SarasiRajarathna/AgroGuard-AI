const dbService = require('../services/db.service');

// GET /api/farms
async function getAllFarms(req, res, next) {
  try {
    const { farmerId } = req.query;
    const farms = await dbService.getFarms({ farmerId: farmerId || (req.user?.role === 'farmer' ? req.user.id : null) });
    return res.status(200).json({
      success: true,
      data: farms,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/farms/:id
async function getFarmById(req, res, next) {
  try {
    const { id } = req.params;
    const farm = await dbService.getFarmById(id);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: `Farm with ID ${id} not found.`,
      });
    }
    return res.status(200).json({
      success: true,
      data: farm,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/farms
async function createFarm(req, res, next) {
  try {
    const { name, ownerName, location, latitude, longitude, cropType, acreage } = req.body;
    const farmerId = req.user?.id || 1;

    const farm = await dbService.createFarm({
      name,
      ownerName: ownerName || req.user?.name || 'Farmer',
      farmerId,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      cropType,
      acreage: parseFloat(acreage) || 1.0,
    });

    return res.status(201).json({
      success: true,
      message: 'Farm registered successfully.',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllFarms,
  getFarmById,
  createFarm,
};
