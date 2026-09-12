const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbService = require('../services/db.service');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { mapUser } = require('../utils/mappers');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate signed JWT
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const user = await dbService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    // Verify password with bcrypt
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.',
      });
    }

    if (user.status === 'inactive' || user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact administration.',
      });
    }

    const token = generateToken(user);
    const safeUser = mapUser(user);

    dbService.logActivity({
      userId: user.id,
      action: 'USER_LOGIN',
      entity: 'users',
      entityId: String(user.id),
      metadata: { role: user.role },
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, role, ...extra } = req.body;

    const existing = await dbService.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const createdUser = await dbService.createUser({
      name,
      email,
      password,
      role: role || 'farmer',
      ...extra,
    });

    const token = generateToken(createdUser);
    const safeUser = mapUser(createdUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/logout
async function logout(req, res, next) {
  try {
    if (req.user) {
      dbService.logActivity({
        userId: req.user.id,
        action: 'USER_LOGOUT',
        entity: 'users',
        entityId: String(req.user.id),
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register,
  getMe,
  logout,
};
