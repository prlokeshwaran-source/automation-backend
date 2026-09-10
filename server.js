const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Create app first
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route - before DB connection
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRM Server is running',
    version: process.env.CRM_VERSION || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Info route
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Automation CRM API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      organizations: '/api/v1/organizations',
      roles: '/api/v1/roles',
      facebook: '/api/v1/facebook',
      campaigns: '/api/v1/campaigns',
      leads: '/api/v1/leads',
      documents: '/api/v1/documents',
      notifications: '/api/v1/notifications',
      settings: '/api/v1/settings',
      analytics: '/api/v1/analytics',
      audit: '/api/v1/audit',
    },
  });
});

// Routes
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const organizations = require('./routes/organizationRoutes');
const roles = require('./routes/roleRoutes');
const facebook = require('./routes/facebookRoutes');
const campaigns = require('./routes/campaignRoutes');
const leads = require('./routes/leadRoutes');
const documents = require('./routes/documentRoutes');
const notifications = require('./routes/notificationRoutes');
const settings = require('./routes/settingsRoutes');
const analytics = require('./routes/analyticsRoutes');
const audit = require('./routes/auditRoutes');

// API version prefix
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/auth`, auth);
app.use(`${API_VERSION}/users`, users);
app.use(`${API_VERSION}/organizations`, organizations);
app.use(`${API_VERSION}/roles`, roles);
app.use(`${API_VERSION}/facebook`, facebook);
app.use(`${API_VERSION}/campaigns`, campaigns);
app.use(`${API_VERSION}/leads`, leads);
app.use(`${API_VERSION}/documents`, documents);
app.use(`${API_VERSION}/notifications`, notifications);
app.use(`${API_VERSION}/settings`, settings);
app.use(`${API_VERSION}/analytics`, analytics);
app.use(`${API_VERSION}/audit`, audit);

// Connect to database after routes are defined
// This ensures routes are available even if DB connection fails
connectDB().catch(err => {
  console.error(`Database connection error: ${err.message}`.red);
});

// Error handler middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `CRM Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});