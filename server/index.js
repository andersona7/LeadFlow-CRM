require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const sequelize = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import models to register associations
require('./models/User');
require('./models/Lead');

// Import routes
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// ──── Security middleware ────
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'https://leadflow-crm.vercel.app'],
  credentials: true,
}));

// ──── Rate limiting ────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

// ──── Body parsing ────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ──── Logging ────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ──── Health check ────
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ──── API Routes ────
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ──── Error handling ────
app.use(notFound);
app.use(errorHandler);

// ──── Database sync & start ────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
