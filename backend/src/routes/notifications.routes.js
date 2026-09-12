const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// GET /api/notifications - User notification feed
router.get('/', notificationsController.getNotifications);
router.get('/unread', notificationsController.getUnread);
router.patch('/read-all', notificationsController.markAllRead);
router.patch('/:id/read', notificationsController.markRead);

module.exports = router;
