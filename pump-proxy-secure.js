/**
 * Secure Node.js proxy server for Pump.fun API access
 * Enhanced with security best practices
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3001;

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Security: Restricted CORS - only allow localhost origins
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'file://' // For local HTML files
    ],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: false
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(limiter);

// Security: Whitelist of allowed endpoints
const ALLOWED_ENDPOINTS = [
    'https://frontend-api.pump.fun/coins/trending',
    'https://frontend-api.pump.fun/coins'
];

// Security: Input validation middleware
const validateRequest = (req, res, next) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Basic security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
};

app.use(validateRequest);

// Secure proxy endpoint
app.get('/api/pump/tokens', async (req, res) => {
    try {
        console.log(`🔒 [${new Date().toISOString()}] Secure proxy request from ${req.ip}`);
        
        for (const endpoint of ALLOWED_ENDPOINTS) {
            try {
                console.log(`🔍 Trying endpoint: ${endpoint}`);
                
                // Security: Timeout and controlled headers
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
                
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'PumpFeed-Proxy/1.0'
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Successfully fetched data from ${endpoint}`);
                    
                    // Data validation and sanitization
                    const filteredTokens = Array.isArray(data) ? data : (data.coins || data.data || []);
                    
                    if (!Array.isArray(filteredTokens)) {
                        throw new Error('Invalid data format received from API');
                    }
                    
                    // Filter and sanitize data
                    const relevantTokens = filteredTokens
                        .filter(token => {
                            const progress = token.bondingCurveProgress || token.bonding_curve_progress || 0;
                            return token.complete === true || token.graduated === true || progress >= 85;
                        })
                        .map(token => ({
                            // Only return safe, necessary fields
                            mint: String(token.mint || '').substring(0, 100),
                            name: String(token.name || '').substring(0, 100),
                            symbol: String(token.symbol || '').substring(0, 20),
                            description: String(token.description || '').substring(0, 500),
                            image: String(token.image || '').substring(0, 500),
                            creator: String(token.creator || '').substring(0, 100),
                            market_cap: Number(token.market_cap || 0),
                            price: Number(token.price || 0),
                            change_24h: Number(token.change_24h || 0),
                            volume_24h: Number(token.volume_24h || 0),
                            holders: Number(token.holder_count || token.holders || 0),
                            status: token.complete === true || token.graduated === true ? 'graduated' : 'bonding',
                            graduation_time: token.graduation_timestamp || token.completedAt || null,
                            bonding_curve_progress: Math.min(Number(token.bondingCurveProgress || token.bonding_curve_progress || 0), 100),
                            created_timestamp: token.created_timestamp || token.createdAt || new Date().toISOString()
                        }))
                        .slice(0, 50); // Limit results
                    
                    return res.json({
                        success: true,
                        source: endpoint.replace(/https?:\/\//, ''), // Don't expose full URLs
                        count: relevantTokens.length,
                        tokens: relevantTokens,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (endpointError) {
                console.warn(`⚠️ Failed to fetch from endpoint:`, endpointError.message);
                continue;
            }
        }
        
        // If all endpoints fail
        res.status(502).json({
            success: false,
            error: 'Service temporarily unavailable',
            message: 'Unable to fetch token data at this time',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('🚨 Proxy error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Security: Catch-all for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});

// Security: Error handling
app.use((error, req, res, next) => {
    console.error('🚨 Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🔄 Received SIGINT, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`🔒 Secure Pump.fun API proxy running on http://127.0.0.1:${PORT}`);
    console.log(`📡 Endpoint: http://127.0.0.1:${PORT}/api/pump/tokens`);
    console.log(`💡 Health check: http://127.0.0.1:${PORT}/health`);
    console.log(`🛡️ Security features enabled: Rate limiting, CORS restrictions, Input validation`);
});
