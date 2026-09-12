/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies that the authenticated user possesses one of the allowed roles
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization check.',
      });
    }

    const userRole = req.user.role?.toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    // Admin has universal superuser access
    if (userRole === 'admin' || normalizedAllowed.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Role "${req.user.role}" does not have permission to access this resource.`,
      requiredRoles: allowedRoles,
    });
  };
}

module.exports = {
  authorize,
};
