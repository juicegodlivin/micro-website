/**
 * Simple Node.js proxy server to bypass CORS restrictions for Pump.fun API
 * 
 * Usage:
 * 1. Install dependencies: npm install express cors node-fetch
 * 2. Run: node pump-proxy.js
 * 3. Update dashboard.html to use: http://localhost:3001/api/pump/tokens
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for Pump.fun tokens
app.get('/api/pump/tokens', async (req, res) => {
    try {
        console.log('🚀 Proxying request to Pump.fun API...');
        
        // Try multiple endpoints
        const endpoints = [
            'https://frontend-api.pump.fun/coins/trending',
            'https://frontend-api.pump.fun/coins'
        ];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`Trying endpoint: ${endpoint}`);
                
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Successfully fetched data from ${endpoint}`);
                    
                    // Filter for graduated or nearly graduated tokens
                    const filteredTokens = Array.isArray(data) ? data : (data.coins || data.data || []);
                    const relevantTokens = filteredTokens.filter(token => {
                        const progress = token.bondingCurveProgress || token.bonding_curve_progress || 0;
                        return token.complete === true || token.graduated === true || progress >= 85;
                    });
                    
                    return res.json({
                        success: true,
                        source: endpoint,
                        count: relevantTokens.length,
                        tokens: relevantTokens
                    });
                }
            } catch (endpointError) {
                console.warn(`Failed to fetch from ${endpoint}:`, endpointError.message);
                continue;
            }
        }
        
        // If all endpoints fail
        res.status(502).json({
            success: false,
            error: 'All Pump.fun API endpoints failed',
            message: 'Unable to fetch real token data'
        });
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Internal proxy server error'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🔄 Pump.fun API proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Test endpoint: http://localhost:${PORT}/api/pump/tokens`);
    console.log(`💡 Health check: http://localhost:${PORT}/health`);
});
