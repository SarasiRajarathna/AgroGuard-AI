/**
 * Centralized Error Handling Middlewares
 */

// 404 Route Not Found Handler
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: [${req.method}] ${req.originalUrl}`,
  });
}

// Global Exception & Error Handler
function errorHandler(err, req, res, next) {
  console.error('[API Error]:', err.stack || err.message);

  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.toString() : undefined,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
