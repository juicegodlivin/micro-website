/*
 * Wallet Authentication System
 * Reusable wallet connection flow with loading screen
 * Supports Phantom, MetaMask, and Solflare wallets
 */

'use strict';

/**
 * Wallet Authentication Controller
 * Handles loading screen, wallet authentication, and app flow
 */
class WalletAuthController {
  constructor(options = {}) {
    this.loadingProgress = 0;
    this.loadingDuration = options.loadingDuration || 2000; // 2 seconds default
    this.isAuthenticated = false;
    this.connectedWallet = null;
    this.options = {
      autoInit: true,
      enableDebugLogs: true,
      videoBackground: true,
      ...options
    };
    
    if (this.options.autoInit) {
      this.init();
    }
  }

  async init() {
    this.log('Initializing Wallet Authentication System...');
    
    // Check for existing wallet connection first
    const hasExistingConnection = await this.checkExistingConnection();
    if (hasExistingConnection) {
      this.log('Existing wallet connection found, skipping auth flow');
      this.skipToMainContent();
    } else {
      this.log('No existing connection, starting auth flow');
      this.startLoadingSequence();
    }
    
    this.setupWalletButtons();
    this.setupWalletDetection();
  }

  log(message, ...args) {
    if (this.options.enableDebugLogs) {
      console.log(`[WalletAuth] ${message}`, ...args);
    }
  }

  /**
   * Setup proper wallet detection using event-driven approach
   */
  setupWalletDetection() {
    this.log('Setting up wallet detection...');
    
    // Listen for Ethereum provider injection (MetaMask, etc.)
    if (window.ethereum) {
      this.log('Ethereum provider already available');
      this.detectWallets();
    } else {
      this.log('Waiting for ethereum provider...');
      window.addEventListener('ethereum#initialized', () => {
        this.log('Ethereum provider initialized');
        this.detectWallets();
      });
      
      setTimeout(() => {
        if (window.ethereum) {
          this.log('Ethereum provider found via timeout');
          this.detectWallets();
        }
      }, 3000);
    }

    // Listen for Solana provider injection (Phantom, Solflare)
    if (window.solana) {
      this.log('Solana provider already available');
      this.detectWallets();
    } else {
      this.log('Waiting for solana provider...');
      
      window.addEventListener('phantom#initialized', () => {
        this.log('Phantom provider initialized');
        this.detectWallets();
      });
      
      const checkSolanaProvider = () => {
        if (window.solana) {
          this.log('Solana provider found');
          this.detectWallets();
        } else {
          setTimeout(checkSolanaProvider, 1000);
        }
      };
      
      setTimeout(checkSolanaProvider, 1000);
    }

    window.addEventListener('load', () => {
      this.log('Page fully loaded, running wallet detection');
      setTimeout(() => {
        this.detectWallets();
      }, 2000);
    });
  }

  /**
   * Detect available wallets
   */
  detectWallets() {
    const timestamp = new Date().toLocaleTimeString();
    this.log(`Wallet detection [${timestamp}]`);
    
    // Phantom detection
    if (window.solana && window.solana.isPhantom) {
      this.log('✅ Phantom wallet detected');
    } else {
      this.log('❌ Phantom wallet not detected');
    }

    // MetaMask detection
    if (window.ethereum && window.ethereum.isMetaMask) {
      this.log('✅ MetaMask wallet detected');
    } else {
      this.log('❌ MetaMask wallet not detected');
    }

    // Solflare detection
    if (window.solflare) {
      this.log('✅ Solflare wallet detected');
    } else {
      this.log('❌ Solflare wallet not detected');
    }
  }

  /**
   * Start the loading sequence
   */
  startLoadingSequence() {
    const progressBar = document.getElementById('progressBar');
    const percentageDisplay = document.getElementById('loadingPercentage');
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');

    if (!progressBar || !percentageDisplay || !loadingScreen || !authScreen) {
      console.error('[WalletAuth] Required elements not found');
      return;
    }

    const startTime = Date.now();
    const updateInterval = 50;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / this.loadingDuration) * 100, 100);
      
      progressBar.style.width = `${progress}%`;
      percentageDisplay.textContent = `${Math.floor(progress)}%`;
      
      if (progress < 100) {
        setTimeout(updateProgress, updateInterval);
      } else {
        setTimeout(() => {
          this.transitionToAuth();
        }, 500);
      }
    };

    updateProgress();
  }

  /**
   * Transition from loading to authentication screen
   */
  transitionToAuth() {
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');

    this.log('Transitioning from loading to auth screen');

    if (loadingScreen && authScreen) {
      loadingScreen.classList.add('fade-out');
      
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        authScreen.style.display = 'flex';
        authScreen.classList.remove('hidden');
        
        // Debug all screen states
        this.debugScreenStates();
        
        this.checkForExistingConnections();
      }, 1000);
    } else {
      this.log('Error: Could not find loading screen or auth screen elements');
    }
  }

  /**
   * Check for existing wallet connection in localStorage and browser
   */
  async checkExistingConnection() {
    try {
      const storedConnection = localStorage.getItem('micro_wallet_connection');
      if (!storedConnection) {
        return false;
      }

      const connectionData = JSON.parse(storedConnection);
      const now = Date.now();
      
      // Check if connection is expired (24 hours)
      if (now - connectionData.timestamp > 24 * 60 * 60 * 1000) {
        this.log('Stored connection expired, clearing');
        localStorage.removeItem('micro_wallet_connection');
        return false;
      }

      // Verify the wallet is still actually connected
      return await this.verifyWalletConnection(connectionData.walletType);
    } catch (error) {
      this.log('Error checking existing connection:', error);
      localStorage.removeItem('micro_wallet_connection');
      return false;
    }
  }

  /**
   * Verify that the wallet is still connected in the browser
   */
  async verifyWalletConnection(walletType) {
    try {
      switch (walletType) {
        case 'phantom':
          if (window.solana && window.solana.isPhantom) {
            // Try to connect silently (won't show popup if already connected)
            try {
              const response = await window.solana.connect({ onlyIfTrusted: true });
              if (response && response.publicKey) {
                this.connectedWallet = {
                  type: 'phantom',
                  publicKey: response.publicKey.toString(),
                  address: response.publicKey.toString()
                };
                this.isAuthenticated = true;
                return true;
              }
            } catch (err) {
              this.log('Phantom silent connection failed:', err);
            }
          }
          break;
          
        case 'metamask':
          if (window.ethereum && window.ethereum.isMetaMask) {
            try {
              const accounts = await window.ethereum.request({ method: 'eth_accounts' });
              if (accounts && accounts.length > 0) {
                this.connectedWallet = {
                  type: 'metamask',
                  publicKey: accounts[0],
                  address: accounts[0]
                };
                this.isAuthenticated = true;
                return true;
              }
            } catch (err) {
              this.log('MetaMask account check failed:', err);
            }
          }
          break;
          
        case 'solflare':
          if (window.solflare && window.solflare.isConnected) {
            try {
              const publicKey = window.solflare.publicKey;
              if (publicKey) {
                this.connectedWallet = {
                  type: 'solflare',
                  publicKey: publicKey.toString(),
                  address: publicKey.toString()
                };
                this.isAuthenticated = true;
                return true;
              }
            } catch (err) {
              this.log('Solflare connection check failed:', err);
            }
          }
          break;
      }
      
      return false;
    } catch (error) {
      this.log('Error verifying wallet connection:', error);
      return false;
    }
  }

  /**
   * Skip directly to main content without loading/auth screens
   */
  skipToMainContent() {
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');

    if (loadingScreen && authScreen && mainContent) {
      this.log('Skipping to main content with existing connection');
      
      // Hide loading and auth screens immediately
      loadingScreen.style.display = 'none';
      loadingScreen.classList.remove('fade-out');
      authScreen.style.display = 'none';
      authScreen.classList.add('hidden');
      
      // Show main content
      mainContent.style.display = '';  // Reset to default
      mainContent.classList.remove('hidden');
      
      this.log('Main content shown via skip method');
      this.debugScreenStates();
      
      // Dispatch wallet connected event for UI updates
      if (this.connectedWallet) {
        window.dispatchEvent(new CustomEvent('walletConnected', { 
          detail: this.connectedWallet 
        }));
      }
    }
  }

  /**
   * Check for existing wallet connections (passive check)
   */
  async checkForExistingConnections() {
    try {
      // This method is now used after the auth screen is shown
      // for wallets that might connect automatically
      if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
        this.log('Phantom is already connected, but user must still authenticate');
      }

      if (window.ethereum && window.ethereum.isMetaMask && window.ethereum.selectedAddress) {
        this.log('MetaMask is already connected, but user must still authenticate');
      }
      
      this.log('Auth screen displayed - user must manually select wallet');
    } catch (error) {
      this.log('Error checking existing connections:', error);
    }
  }

  /**
   * Setup wallet connection buttons
   */
  setupWalletButtons() {
    const walletButtons = document.querySelectorAll('.wallet-card');
    
    walletButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const walletType = e.currentTarget.getAttribute('data-wallet');
        this.connectWallet(walletType);
      });
    });
  }

  /**
   * Connect to specified wallet
   */
  async connectWallet(walletType) {
    const button = document.querySelector(`[data-wallet="${walletType}"]`);
    if (!button) return;

    const walletName = button.querySelector('.wallet-name');
    const connectText = button.querySelector('.connect-text');
    const originalName = walletName.textContent;
    const originalConnect = connectText.textContent;
    
    // Add loading state
    walletName.textContent = 'CONNECTING...';
    connectText.textContent = 'WAIT...';
    button.disabled = true;
    button.style.pointerEvents = 'none';
    button.style.opacity = '0.7';

    try {
      let wallet = null;
      
      switch (walletType) {
        case 'phantom':
          wallet = await this.connectPhantom();
          break;
        case 'solflare':
          wallet = await this.connectSolflare();
          break;
        case 'metamask':
          wallet = await this.connectMetaMask();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }

      if (wallet) {
        this.connectedWallet = wallet;
        this.isAuthenticated = true;
        
        // Store connection in localStorage for persistence
        this.storeWalletConnection(wallet);
        
        // Show success state
        walletName.textContent = 'CONNECTED';
        connectText.textContent = 'SUCCESS';
        button.style.background = 'linear-gradient(135deg, rgba(0, 136, 254, 0.3), rgba(0, 136, 254, 0.1))';
        button.style.borderColor = '#0088fe';
        button.style.boxShadow = '0 0 20px rgba(0, 136, 254, 0.6)';
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('walletConnected', { 
          detail: wallet 
        }));
        
        setTimeout(() => {
          this.transitionToMainContent();
        }, 1500);
      }
    } catch (error) {
      this.log('Wallet connection failed:', error);
      
      // Show error state
      walletName.textContent = 'CONNECTION FAILED';
      connectText.textContent = 'ERROR';
      button.style.background = 'linear-gradient(135deg, rgba(255, 0, 64, 0.2), rgba(255, 0, 64, 0.1))';
      button.style.borderColor = '#ff0040';
      
      // Reset button after delay
      setTimeout(() => {
        walletName.textContent = originalName;
        connectText.textContent = originalConnect;
        button.style.background = '';
        button.style.borderColor = '';
        button.style.boxShadow = '';
        button.style.pointerEvents = '';
        button.style.opacity = '';
        button.disabled = false;
      }, 3000);
    }
  }

  /**
   * Connect to Phantom wallet
   */
  async connectPhantom() {
    try {
      this.log('Attempting Phantom connection...');
      
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet not detected. Please ensure it is installed and enabled.');
      }

      const response = await window.solana.connect();
      
      if (response && response.publicKey) {
        this.log('✅ Phantom connected successfully');
        return {
          type: 'phantom',
          publicKey: response.publicKey.toString(),
          address: response.publicKey.toString()
        };
      } else {
        throw new Error('Failed to get public key from Phantom');
      }
    } catch (error) {
      this.log('❌ Phantom connection error:', error);
      
      if (error.code === 4001 || error.message.includes('User rejected')) {
        throw new Error('Connection rejected by user');
      } else {
        throw new Error(`Connection failed: ${error.message}`);
      }
    }
  }

  /**
   * Connect to Solflare wallet
   */
  async connectSolflare() {
    try {
      this.log('Attempting Solflare connection...');
      
      if (!window.solflare) {
        throw new Error('Solflare wallet not detected. Please ensure it is installed and enabled.');
      }

      // Reset state if already connected
      if (window.solflare.isConnected) {
        try {
          await window.solflare.disconnect();
        } catch (disconnectError) {
          this.log('Disconnect error (normal):', disconnectError);
        }
      }

      const response = await window.solflare.connect();
      
      // Try multiple ways to get the public key
      let publicKey = null;
      if (response && response.publicKey) {
        publicKey = response.publicKey;
      } else if (window.solflare.publicKey) {
        publicKey = window.solflare.publicKey;
      } else if (window.solflare.wallet && window.solflare.wallet.publicKey) {
        publicKey = window.solflare.wallet.publicKey;
      }
      
      if (publicKey) {
        this.log('✅ Solflare connected successfully');
        return {
          type: 'solflare',
          publicKey: publicKey.toString(),
          address: publicKey.toString()
        };
      } else {
        throw new Error('Failed to get public key from Solflare');
      }
    } catch (error) {
      this.log('❌ Solflare connection error:', error);
      
      if (error.code === 4001 || error.message.includes('rejected')) {
        throw new Error('Connection rejected by user');
      } else {
        throw new Error(`Connection failed: ${error.message}`);
      }
    }
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectMetaMask() {
    try {
      this.log('Attempting MetaMask connection...');

      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error('MetaMask wallet not detected. Please ensure it is installed and enabled.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        this.log('✅ MetaMask connected successfully');
        return {
          type: 'metamask',
          publicKey: accounts[0],
          address: accounts[0]
        };
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      this.log('❌ MetaMask connection error:', error);
      
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending');
      } else {
        throw new Error(`Connection failed: ${error.message}`);
      }
    }
  }

  /**
   * Transition to main content after successful authentication
   */
  transitionToMainContent() {
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');

    this.log('Transitioning to main content after successful authentication');

    if (authScreen && mainContent) {
      authScreen.classList.add('fade-out');
      
      setTimeout(() => {
        // Hide auth screen
        authScreen.style.display = 'none';
        authScreen.classList.add('hidden');
        
        // Show main content
        mainContent.style.display = '';  // Reset to default
        mainContent.classList.remove('hidden');
        
        this.log('Main content should now be visible');
        this.debugScreenStates();
      }, 1000);
    } else {
      this.log('Error: Could not find auth screen or main content elements for transition');
      this.log('Auth screen:', !!authScreen);
      this.log('Main content:', !!mainContent);
    }
  }

  /**
   * Store wallet connection in localStorage
   */
  storeWalletConnection(wallet) {
    try {
      const connectionData = {
        walletType: wallet.type,
        timestamp: Date.now(),
        publicKey: wallet.publicKey,
        address: wallet.address
      };
      
      localStorage.setItem('micro_wallet_connection', JSON.stringify(connectionData));
      this.log('Wallet connection stored in localStorage');
    } catch (error) {
      this.log('Error storing wallet connection:', error);
    }
  }

  /**
   * Clear stored wallet connection
   */
  clearStoredConnection() {
    try {
      localStorage.removeItem('micro_wallet_connection');
      this.log('Stored wallet connection cleared');
    } catch (error) {
      this.log('Error clearing stored connection:', error);
    }
  }

  /**
   * Force re-authentication (public API)
   */
  forceReauth() {
    this.isAuthenticated = false;
    this.connectedWallet = null;
    
    // Clear stored connection
    this.clearStoredConnection();
    
    // Dispatch disconnection event
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
    
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingScreen && authScreen && mainContent) {
      this.log('Starting forceReauth process');
      
      // Hide main content
      mainContent.classList.add('hidden');
      mainContent.style.display = 'none';
      this.log('Main content hidden');
      
      // Reset auth screen state
      authScreen.classList.add('hidden');
      authScreen.style.display = 'none';
      this.log('Auth screen reset and hidden');
      
      // Reset and show loading screen
      loadingScreen.style.display = 'flex';
      loadingScreen.classList.remove('fade-out');
      this.log('Loading screen shown');
      
      // Reset progress bar
      const progressBar = document.getElementById('progressBar');
      const percentageDisplay = document.getElementById('loadingPercentage');
      if (progressBar && percentageDisplay) {
        progressBar.style.width = '0%';
        percentageDisplay.textContent = '0%';
        this.log('Progress bar reset');
      }
      
      this.startLoadingSequence();
    } else {
      this.log('Error: Missing required elements for forceReauth');
      this.log('Loading screen:', !!loadingScreen);
      this.log('Auth screen:', !!authScreen);
      this.log('Main content:', !!mainContent);
    }
  }

  /**
   * Debug method to check screen states
   */
  debugScreenStates() {
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');
    
    this.log('=== SCREEN STATES DEBUG ===');
    
    if (loadingScreen) {
      this.log('Loading Screen:');
      this.log('- Display:', loadingScreen.style.display);
      this.log('- Classes:', loadingScreen.className);
      this.log('- Computed display:', window.getComputedStyle(loadingScreen).display);
    }
    
    if (authScreen) {
      this.log('Auth Screen:');
      this.log('- Display:', authScreen.style.display);
      this.log('- Classes:', authScreen.className);
      this.log('- Computed display:', window.getComputedStyle(authScreen).display);
      this.log('- Z-index:', window.getComputedStyle(authScreen).zIndex);
    }
    
    if (mainContent) {
      this.log('Main Content:');
      this.log('- Display:', mainContent.style.display);
      this.log('- Classes:', mainContent.className);
      this.log('- Computed display:', window.getComputedStyle(mainContent).display);
    }
    
    this.log('=== END DEBUG ===');
  }

  /**
   * Manual wallet detection trigger (public API)
   */
  manualDetectWallets() {
    this.log('🔍 Manual wallet detection triggered');
    this.detectWallets();
  }
}

// Auto-initialize when DOM is ready
let walletAuth = null;

function initWalletAuth() {
  walletAuth = new WalletAuthController();
  window.walletAuth = walletAuth; // Expose globally
  
  // Expose debug function globally
  window.debugWalletScreens = () => {
    if (walletAuth) {
      walletAuth.debugScreenStates();
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWalletAuth);
} else {
  initWalletAuth();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WalletAuthController };
}
