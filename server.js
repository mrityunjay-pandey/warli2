const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/warli';

// Store connection state
let isConnected = false;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    isConnected = true;
    console.log('✅ Connected to MongoDB');
})
.catch((error) => {
    isConnected = false;
    console.error('❌ MongoDB connection error:', error);
    console.error('Please check your MongoDB connection string in .env file');
});

// Export connection state for use in routes
app.locals.isConnected = () => isConnected;

// Import routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({ 
        status: dbStatus === 1 ? 'ok' : 'warning',
        message: 'Warli API is running',
        database: {
            status: dbStates[dbStatus] || 'unknown',
            readyState: dbStatus,
            connected: dbStatus === 1
        },
        mongodbUri: MONGODB_URI ? 'configured' : 'not configured'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

