# Micro - AI Agent Stack

> Next-generation AI agent stack for prediction markets, real-time data intelligence, and decentralized trading insights.

## Overview

Micro is a sophisticated AI agent stack designed for prediction markets and trading intelligence. Built with cutting-edge technology and real-time data integration, Micro provides unparalleled insights into token markets, social sentiment, and trading opportunities across the Solana ecosystem.

## Features

### Core Capabilities

- **Live Prediction Markets**: Real-time prediction markets for token performance with AI-powered analysis
- **Hot Tokens Dashboard**: Track trending Solana ecosystem tokens with live price data and market sentiment
- **Social Intelligence**: Advanced sentiment analysis across social media and news sources  
- **Pump.fun Integration**: Real-time feed of new token launches and trading activity
- **AI-Powered Insights**: Machine learning models for price predictions and market analysis
- **Wallet Integration**: Seamless connection with MetaMask, Phantom, and Solflare wallets

### Intelligence Features

- **Market Sentiment Analysis**: Real-time analysis of social media sentiment and market indicators
- **Price Prediction AI**: Advanced machine learning models for token price forecasting
- **Whale Activity Monitoring**: Track large transactions and whale wallet movements
- **Trading Signal Generation**: AI-generated trading signals based on multiple data sources
- **Risk Assessment**: Automated risk scoring for tokens and trading positions

### Market Types

- **Token Performance Predictions**: Will specific tokens reach target prices?
- **Market Trend Analysis**: Sector-wide trend predictions and analysis
- **Launch Success Predictions**: AI assessment of new token launch potential
- **Social Momentum Tracking**: Prediction markets based on social media momentum

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- Modern web browser with JavaScript enabled
- Solana wallet (MetaMask, Phantom, or Solflare) for trading features

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/juicegodlivin/micro-website.git
   cd micro-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Production Deployment

For production deployment, serve the static files:

```bash
npm run start
```

Or deploy to any static hosting service:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront

## Project Structure

```
micro-website/
├── index.html              # Main landing page
├── dashboard.html          # Prediction markets dashboard
├── docs.html              # Documentation page
├── styles.css             # Main styling
├── dashboard.css          # Dashboard-specific styles
├── script.js              # Core JavaScript functionality
├── pump-proxy.js          # Pump.fun API integration
├── pump-proxy-secure.js   # Secure Pump.fun proxy
├── wallet-auth-system/    # Wallet authentication components
├── package.json           # Project configuration
├── README.md              # This file
└── LICENSE                # MIT License
```

## Development

### Available Scripts

- `npm run start` - Start production server
- `npm run dev` - Start development server with live reload
- `npm run lint` - Check JavaScript code quality (ESLint v9+)
- `npm run lint:fix` - Fix JavaScript code issues automatically
- `npm run validate` - Validate HTML structure

### API Integration

Micro integrates with several real-time data sources:

- **CoinGecko API**: Live token pricing and market data
- **Pump.fun API**: New token launches and trading activity  
- **Social Media APIs**: Sentiment analysis from Twitter and Reddit
- **Solana RPC**: Blockchain data and transaction monitoring

### Recent Updates

**Latest Version Features:**
- ✅ **Fixed Hot Tokens Navigation**: Resolved sidebar navigation getting stuck
- ✅ **Real-time Data Integration**: Live pricing from CoinGecko API
- ✅ **Pump.fun Feed**: Real-time new token launch monitoring
- ✅ **Enhanced UI/UX**: Smooth animations and responsive design
- ✅ **Wallet Authentication**: Multi-wallet support with secure integration

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security & Privacy

Micro is built with security and privacy as core principles:

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Secure API Calls**: All external API calls use HTTPS
- **No Data Collection**: Privacy-focused with no tracking
- **Secure Wallet Integration**: Industry-standard wallet security
- **Rate Limiting**: API rate limiting to prevent abuse

## Performance

- **Lightweight**: Optimized for fast loading and smooth interactions
- **Real-time Updates**: Efficient WebSocket connections for live data
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Caching Strategy**: Smart caching for API data to reduce load times
- **Progressive Enhancement**: Core functionality works without JavaScript

## Customization

### Theming

Micro supports dynamic theming with CSS custom properties:

```css
:root {
  --color-accent: #00d4ff;           /* Primary accent (cyan) */
  --color-accent-glow: #4ecdc4;      /* Accent glow effect */
  --color-bg-primary: #0f1419;       /* Dark background */
  --color-text-primary: #ffffff;     /* Primary text */
}
```

### Adding New Prediction Markets

Extend the prediction markets by modifying the `sectionContent` object in `dashboard.html`:

```javascript
const newMarket = {
  title: 'New Market Type',
  subtitle: 'Description of the new market',
  action: () => loadNewMarketData()
};
```

## API Documentation

### Wallet Integration

```javascript
// Connect wallet
const wallet = await connectWallet('phantom');

// Get balance
const balance = await getWalletBalance(wallet.publicKey);

// Sign transaction
const signature = await signTransaction(transaction);
```

### Market Data

```javascript
// Get hot tokens
const hotTokens = await fetchHotTokens();

// Get market predictions
const predictions = await fetchPredictionMarkets();

// Submit prediction
await submitPrediction(marketId, prediction, amount);
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly on the dashboard
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Advanced AI prediction models
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Mobile app development
- [ ] Advanced charting and technical analysis
- [ ] Social trading features
- [ ] DAO governance integration

## Support

For support, please:
- Open an issue on the GitHub repository
- Join our Discord community
- Check the documentation at `/docs.html`

---

**Micro AI Agent Stack** - Next-generation prediction markets powered by AI intelligence.