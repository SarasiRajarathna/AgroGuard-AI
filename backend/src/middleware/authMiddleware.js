const jwt = require('jsonwebtoken');
const dbService = require('../services/db.service');
const { mapUser } = require('../utils/mappers');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'agroguard_super_secret_jwt_key_2026_lk_ai_crop_surveillance';

/**
 * JWT Authentication Middleware
 * Validates the Authorization: Bearer <token> header and attaches the user to req.user
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing or malformed Authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dbService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User account not found.',
      });
    }

    if (user.status === 'suspended' || user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated or suspended. Contact administrator.',
      });
    }

    req.user = mapUser(user);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or tampered authentication token.',
    });
  }
}

module.exports = {
  authenticate,
  JWT_SECRET,
};
