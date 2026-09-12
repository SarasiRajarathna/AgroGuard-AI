const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/authMiddleware');
const { loginValidator, registerValidator } = require('../validators/authValidator');

// Public routes
router.post('/login', loginValidator, authController.login);
router.post('/register', registerValidator, authController.register);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
