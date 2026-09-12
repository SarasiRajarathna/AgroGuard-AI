const dbService = require('../services/db.service');

// GET /api/notifications
async function getNotifications(req, res, next) {
  try {
    const userId = req.user?.id || 1;
    const notifications = await dbService.getNotifications(userId);
    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

async function getUnread(req, res, next) {
  try {
    const userId = req.user?.id || 1;
    const notifications = await dbService.getUnreadNotifications(userId);
    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

async function markRead(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await dbService.markNotificationRead(id);
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

async function markAllRead(req, res, next) {
  try {
    await dbService.markAllNotificationsRead(req.user?.id);
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  getUnread,
  markRead,
  markAllRead,
};
