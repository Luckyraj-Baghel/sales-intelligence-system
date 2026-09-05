const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const importRoutes = require('./routes/importRoutes');

const app = express();

// Middlewares
// Allow requests from both the production frontend (CLIENT_URL in .env) and
// localhost during development. Using a function lets us support multiple origins
// without opening CORS to everyone.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174', // Vite sometimes picks an alternate port
  process.env.CLIENT_URL,  // e.g. https://sales-intelligence-system.vercel.app
].filter(Boolean).map((o) => o.replace(/\/$/, '')); // strip any trailing slash

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Mount API Routes (Clean routes without /v1)
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/import', importRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.status(200).json({
      status: 'success',
      message: 'Server & Database are healthy!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Multer and general error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ status: 'error', message: `Upload Error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SalesIntel Enterprise Analytics API is Live & Running!',
    docs: '/api/health'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});