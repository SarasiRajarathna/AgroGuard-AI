/**
 * Lightweight in-memory rate limiter (no extra dependencies).
 */
function rateLimiter({ windowMs = 15 * 60 * 1000, max = 40, message } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const key = `${req.ip || req.connection?.remoteAddress || 'unknown'}:${req.path}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { start: now, count: 1 });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests. Please try again shortly.',
      });
    }

    return next();
  };
}

module.exports = { rateLimiter };
