// API Configuration
// Update this file with your production API URL when deploying

const API_CONFIG = {
    // Development (localhost)
    development: 'http://localhost:3000/api',
    
    // Production - Update this with your actual backend server URL
    // Examples:
    // - If backend is on same domain: '/api'
    // - If backend is separate: 'https://your-backend.railway.app/api'
    // - If using Vercel serverless: '/api'
    production: 'https://warli2.onrender.com/api', // Backend deployed on Render
    
    // Auto-detect based on current hostname
    getBaseUrl: function() {
        const hostname = window.location.hostname;
        
        // Localhost development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return this.development;
        }
        
        // Production - use the production URL
        // If your backend is on a different domain, update production above
        return this.production;
    }
};

// Export for use in other files
window.API_CONFIG = API_CONFIG;

