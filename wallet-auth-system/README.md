# Wallet Authentication System

A plug-and-play wallet authentication system with loading screen and wallet connection flow.

## Features

- 10-second customizable loading screen with video background
- Professional authentication UI with glass morphism design
- Support for Phantom, MetaMask, and Solflare wallets
- Proper wallet detection and connection handling
- Responsive design for all screen sizes
- Easy customization and theming

## Quick Setup

1. Copy the `wallet-auth-system` folder to your project
2. Include the CSS and JS files in your HTML
3. Add the HTML structure to your page
4. Customize the styling and content as needed

## File Structure

```
wallet-auth-system/
├── README.md                 # This file
├── wallet-auth.js           # Main JavaScript functionality
├── wallet-auth.css          # Styling for loading screen and auth UI
├── wallet-auth.html         # HTML structure template
├── example-integration.html # Complete working example
└── assets/
    ├── phantom-wallet-logo.png
    ├── metamask-wallet-logo.jpg
    └── solflare-wallet-logo.jpg
```

## Integration Steps

### 1. Add CSS and JS to your HTML head:

```html
<link rel="stylesheet" href="wallet-auth-system/wallet-auth.css">
<script src="wallet-auth-system/wallet-auth.js"></script>
```

### 2. Add the HTML structure to your body:

```html
<!-- Copy the structure from wallet-auth.html -->
<div class="loading-screen" id="loadingScreen">
  <!-- Loading screen content -->
</div>

<div class="auth-screen hidden" id="authScreen">
  <!-- Authentication UI -->
</div>

<div class="main-content hidden" id="mainContent">
  <!-- Your existing website content goes here -->
</div>
```

### 3. Initialize the system:

```javascript
// The system auto-initializes when the page loads
// Access the controller via: window.walletAuth
```

## Customization

### Loading Screen
- Replace `background-video.mp4` with your own video
- Modify loading text in `wallet-auth.html`
- Adjust loading duration in `wallet-auth.js` (default: 10 seconds)

### Authentication UI
- Replace wallet logos in the `assets/` folder
- Modify colors and styling in `wallet-auth.css`
- Customize text and branding in `wallet-auth.html`

### Main Content
- Wrap your existing website in `<div id="mainContent" class="main-content hidden">`
- The system will show your content after successful authentication

## Events and Callbacks

```javascript
// Listen for authentication events
window.addEventListener('walletConnected', (event) => {
  console.log('Wallet connected:', event.detail);
  // event.detail contains: { type, publicKey, address }
});

window.addEventListener('walletDisconnected', (event) => {
  console.log('Wallet disconnected');
});
```

## API Reference

```javascript
// Access the wallet auth controller
const walletAuth = window.walletAuth;

// Manual wallet detection
walletAuth.detectWallets();

// Get current connection status
console.log(walletAuth.isAuthenticated);
console.log(walletAuth.connectedWallet);

// Force re-authentication
walletAuth.forceReauth();
```

## Browser Support

- Chrome/Chromium-based browsers (recommended)
- Firefox (limited wallet support)
- Safari (limited wallet support)

## Troubleshooting

### Wallets not detected
1. Ensure wallet extensions are installed and enabled
2. Check browser console for detailed logs
3. Try refreshing the page
4. Use `walletAuth.detectWallets()` to manually trigger detection

### Connection failures
1. Check if wallet is unlocked
2. Ensure you're on HTTPS or localhost
3. Clear browser cache and cookies
4. Disable conflicting browser extensions

## License

Free to use in any project. No attribution required.
