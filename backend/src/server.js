const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const aiRoutes = require('./routes/aiRoutes');
const marketRoutes = require('./routes/marketRoutes');
const forumRoutes = require('./routes/forumRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/posts', forumRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const states = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING'
  };
  const dbState = mongoose.connection.readyState;
  res.json({ 
    status: 'OK', 
    message: 'API is running successfully',
    database: states[dbState] || 'UNKNOWN',
    dbCode: dbState
  });
});

// Home route
app.get('/', (req, res) => {
  res.send('Smart Crop & Agriculture Intelligence Platform API');
});

// Custom Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
