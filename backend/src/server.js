const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const { rateLimiter } = require('./middleware/rateLimiter');

// Import route modules
const authRoutes = require('./routes/auth.routes');
const casesRoutes = require('./routes/cases.routes');
const visitsRoutes = require('./routes/visits.routes');
const outbreaksRoutes = require('./routes/outbreaks.routes');
const weatherRoutes = require('./routes/weather.routes');
const alertsRoutes = require('./routes/alerts.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const officersRoutes = require('./routes/officers.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const farmsRoutes = require('./routes/farms.routes');

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'AgroGuard-AI Backend API',
    version: '2.4-ai',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AgroGuard API is operating normally',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', rateLimiter({ windowMs: 15 * 60 * 1000, max: 50 }), authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/outbreaks', outbreaksRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/officers', officersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/farms', farmsRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[AgroGuard-AI Server] Running on http://localhost:${PORT}`);
    console.log(`[AgroGuard-AI Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;