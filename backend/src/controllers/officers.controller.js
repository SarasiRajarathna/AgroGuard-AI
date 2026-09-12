const dbService = require('../services/db.service');

// GET /api/officers
async function getAllOfficers(req, res, next) {
  try {
    const allUsers = await dbService.getAllUsers();
    const officers = allUsers
      .filter(u => u.role === 'officer')
      .map(o => ({
        id: o.id,
        name: o.name,
        district: o.district || 'Eastern Division',
        activeCases: o.cases || 8,
        phone: o.phone || '+94 71 987 6543',
        status: o.status || 'active',
      }));

    return res.status(200).json({
      success: true,
      data: officers,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllOfficers,
};
