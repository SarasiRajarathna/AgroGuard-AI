const { body, validationResult } = require('express-validator');

// Validation error handler helper
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please verify your input.',
      errors: errors.array().map(e => ({ field: e.path || e.param, message: e.msg })),
    });
  };
};

const loginValidator = validate([
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
]);

const registerValidator = validate([
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['farmer', 'officer', 'research']).withMessage('Invalid role specified'),
]);

module.exports = {
  validate,
  loginValidator,
  registerValidator,
};
