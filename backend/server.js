const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');
const partnershipRoutes = require('./routes/partnership');
const connectRoutes = require('./routes/connect');
const praiseReportRoutes = require('./routes/praise-report');

const app = express();

// Allow localhost for local dev and Netlify for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://zionhilltv.onrender.com',
  'https://zionhill.netlify.app'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Zionhilltv Backend API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partnership', partnershipRoutes);
app.use('/api/connect', connectRoutes);
app.use('/api/praise-report', praiseReportRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zionhilltv')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));