const { body } = require('express-validator');
const { validate } = require('./authValidator');

const createCaseValidator = validate([
  body('cropType').trim().notEmpty().withMessage('Target crop type is required'),
  body('location').trim().notEmpty().withMessage('Field / farm location is required'),
]);

const reviewCaseValidator = validate([
  body('decision').isIn(['confirm', 'modify', 'reject']).withMessage('Decision must be confirm, modify, or reject'),
]);

const createVisitValidator = validate([
  body('farmerName').trim().notEmpty().withMessage('Farmer name is required'),
  body('location').trim().notEmpty().withMessage('Visit location is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date required (YYYY-MM-DD)'),
]);

const broadcastAlertValidator = validate([
  body('province').trim().notEmpty().withMessage('Target province is required'),
  body('threatLevel').isIn(['Critical', 'Elevated', 'Advisory', 'High', 'Moderate', 'Low']).withMessage('Invalid threat level'),
  body('broadcastMessage').trim().notEmpty().withMessage('Broadcast message text cannot be empty'),
]);

module.exports = {
  createCaseValidator,
  reviewCaseValidator,
  createVisitValidator,
  broadcastAlertValidator,
};
