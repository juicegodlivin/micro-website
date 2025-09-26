/*
 * Micro - AI Agent Stack - JavaScript
 * Clean, accessible, performance-focused implementation
 * Focus: Progressive enhancement, accessibility, and minimal dependencies
 */

'use strict';

/**
 * Copy token address to clipboard
 */
function copyTokenAddress() {
  const fullAddress = "MCR8pA9sD2fH3jK4mN5qW6eR7tY8uI9oP0L1nM2xY3zV4bN5mQ6rS7tU8vW9xY0zA1bC2";
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern async clipboard API
      navigator.clipboard.writeText(fullAddress).then(() => {
        showCopyFeedback();
        console.log('Token address copied to clipboard');
      }).catch((err) => {
        console.error('Clipboard API failed:', err);
        fallbackCopy();
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      fallbackCopy();
    }
  } catch (error) {
    console.error('Copy function error:', error);
    fallbackCopy();
  }
  
  function fallbackCopy() {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = fullAddress;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, fullAddress.length);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showCopyFeedback();
        console.log('Token address copied using fallback method');
      } else {
        console.error('Fallback copy failed');
        alert('Copy failed. Please manually copy: ' + fullAddress);
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
      alert('Copy failed. Please manually copy: ' + fullAddress);
    }
  }
  
  function showCopyFeedback() {
    const button = document.getElementById('tokenAddress');
    if (!button) return;
    
    const caAddress = button.querySelector('.ca-address');
    const copyIcon = button.querySelector('.copy-icon');
    
    if (caAddress && copyIcon) {
      const originalText = caAddress.textContent;
      const originalIcon = copyIcon.textContent;
      
      // Show feedback
      caAddress.textContent = 'Copied!';
      copyIcon.textContent = '✓';
      
      // Reset after 2 seconds
      setTimeout(() => {
        caAddress.textContent = originalText;
        copyIcon.textContent = originalIcon;
      }, 2000);
    }
  }
}

/**
 * Micro UI Controller
 * Handles core functionality with emphasis on accessibility and performance
 */
class MicroUI {
  constructor() {
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    try {
      this.ensureScrollToTop();
      this.setupEventListeners();
      this.setupAccessibilityFeatures();
      this.setupPerformanceOptimizations();
      this.setupSecurityFeatures();
      
      this.isInitialized = true;
      console.log('Micro AI Agent Stack UI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Micro UI:', error);
    }
  }

  /**
   * Ensure page loads at the top when refreshed
   */
  ensureScrollToTop() {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    
    // Also ensure it happens after DOM is fully loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        window.scrollTo(0, 0);
      });
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('beforeunload', () => {
      window.scrollTo(0, 0);
    });
    
    // Handle page show event (when page is restored from cache)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        window.scrollTo(0, 0);
      }
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Smooth scrolling for anchor links
    this.setupSmoothScrolling();
    
    // Form enhancements
    this.setupFormEnhancements();
    
    // Button interactions
    this.setupButtonInteractions();
    
    
    // Scroll-triggered animations
    this.setupScrollAnimations();
    
    // Parallax effects
    this.setupParallaxEffects();
    
    // Advanced component interactions
    this.setupAdvancedInteractions();
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        
        // Skip empty hash or just # links
        if (!targetId || targetId === '#') {
          return;
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Prevent default behavior immediately and stop propagation
          event.preventDefault();
          event.stopPropagation();
          
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          let extraOffset = 20;
          
          // Special handling for docs page sections
          if (document.body.classList.contains('docs-page')) {
            // Reduce offset slightly to position one scroll click lower
            extraOffset = -15; // Negative offset to scroll down a bit more
          }
          
          const targetPosition = Math.max(0, targetElement.offsetTop - headerHeight - extraOffset);
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update focus for accessibility
          setTimeout(() => {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
            targetElement.addEventListener('blur', () => {
              targetElement.removeAttribute('tabindex');
            }, { once: true });
          }, 100);
        }
      }, { passive: false });
    });
  }

  /**
   * Setup form enhancements
   */
  setupFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add loading states
      form.addEventListener('submit', (_event) => {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.setAttribute('aria-busy', 'true');
          
          const originalText = submitButton.textContent;
          submitButton.textContent = 'Processing...';
          
          // Reset after a delay (in real app, this would be after actual submission)
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            submitButton.textContent = originalText;
          }, 2000);
        }
      });
    });
  }

  /**
   * Setup button interactions
   */
  setupButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add ripple effect on click
      button.addEventListener('click', this.createRippleEffect.bind(this));
      
      // Keyboard interaction feedback
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          button.classList.add('btn-active');
        }
      });
      
      button.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          button.classList.remove('btn-active');
        }
      });
    });
  }


  /**
   * Create subtle ripple effect for buttons
   */
  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: scale(0);
      animation: micro-ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Ensure button has relative positioning
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Setup accessibility features
   */
  setupAccessibilityFeatures() {
    // Announce theme changes to screen readers
    this.createAriaLiveRegion();
    
    // Skip link functionality
    this.setupSkipLink();
    
    // Focus management
    this.setupFocusManagement();
    
    // Reduced motion support
    this.setupReducedMotionSupport();
    
    // High contrast support
    this.setupHighContrastSupport();
  }

  /**
   * Create ARIA live region for announcements
   */
  createAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'micro-aria-live-region';
    document.body.appendChild(liveRegion);
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('micro-aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Setup skip link functionality
   */
  setupSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
        }
      });
    }
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Ensure focusable elements are properly managed
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      // Ensure all interactive elements have visible focus indicators
      element.addEventListener('focus', () => {
        element.classList.add('focused');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focused');
      });
    });
  }

  /**
   * Setup reduced motion support
   */
  setupReducedMotionSupport() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
  }

  /**
   * Setup high contrast support
   */
  setupHighContrastSupport() {
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }

  /**
   * Setup security features
   */
  setupSecurityFeatures() {
    // Basic security measures for dark ops theme
    this.setupCSPCompliance();
    this.setupSecureNavigation();
  }

  /**
   * Setup CSP compliance
   */
  setupCSPCompliance() {
    // Ensure all inline styles are properly handled
    // This would be expanded in a real security-focused application
    console.log('CSP compliance measures initialized');
  }

  /**
   * Setup secure navigation
   */
  setupSecureNavigation() {
    // Add security attributes to external links
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    
    externalLinks.forEach(link => {
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    });
  }

  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-item, .intelligence-item, .stat-item, .integration-item');
    animatedElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      if (index < 6) el.classList.add(`stagger-${index + 1}`);
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Setup parallax effects
   */
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero, .stats');
    parallaxElements.forEach(el => el.classList.add('parallax-slow'));

    let ticking = false;
    const updateParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;
          
          parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
              el.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  /**
   * Setup advanced component interactions
   */
  setupAdvancedInteractions() {
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.feature-item, .intelligence-item, .integration-item');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.createParticleEffect(e.currentTarget);
      });
      
      card.addEventListener('mousemove', (e) => {
        this.updateCardTilt(e);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.resetCardTilt(e.currentTarget);
      });
    });

    // Logo interaction
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', () => {
        this.createLogoEffect();
      });
    }

  }

  /**
   * Create particle effect on card hover
   */
  createParticleEffect(element) {
    const particles = 3;
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--color-accent);
        border-radius: 50%;
        pointer-events: none;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particle-float 2s ease-out forwards;
      `;
      element.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  }

  /**
   * Update card tilt effect
   */
  updateCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }

  /**
   * Reset card tilt
   */
  resetCardTilt(card) {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }

  /**
   * Create logo click effect
   */
  createLogoEffect() {
    const logo = document.querySelector('.logo-icon');
    if (logo) {
      logo.style.animation = 'none';
      setTimeout(() => {
        logo.style.animation = 'logo-pulse 0.6s ease-out';
      }, 10);
    }
  }


  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Lazy load images (if any are added)
    this.setupLazyLoading();
    
    // Debounce scroll events
    this.setupScrollOptimization();
    
    // Monitor performance
    this.setupPerformanceMonitoring();
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Setup scroll optimization
   */
  setupScrollOptimization() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-based functionality would go here
          // For example, updating navigation highlight based on section
          this.updateNavigationHighlight();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Update navigation highlight based on current section
   */
  updateNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"], .docs-nav-link[href^="#"]');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Adjusted to match scroll positioning
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
    
    // Update header transparency based on scroll
    const header = document.querySelector('.header');
    if (header) {
      if (scrollPosition > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with a real performance monitoring solution
      console.log('Performance monitoring initialized for Micro');
    }
    
    // Simple performance logging
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Micro loaded in ${loadTime.toFixed(2)}ms`);
      
      // Log navigation timing
      if (performance.navigation) {
        console.log('Navigation type:', performance.navigation.type);
      }
    });
  }
}

/**
 * Enhanced Error handling and logging for security-focused application
 */
class MicroErrorHandler {
  static init() {
    // Global error handler with security considerations
    window.addEventListener('error', (event) => {
      const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.error('Micro JavaScript error:', errorInfo);
      
      // In production, this would send errors to a secure logging service
      // with proper data sanitization
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Micro unhandled promise rejection:', {
        reason: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      
      // Prevent the default browser behavior
      event.preventDefault();
    });

    // Security-focused error reporting
    window.addEventListener('securitypolicyviolation', (event) => {
      console.error('CSP Violation:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy
      });
    });
  }
}

/**
 * Enhanced utility functions for micro theme
 */
const MicroUtils = {
  /**
   * Debounce function calls
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  },

  /**
   * Throttle function calls
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Secure random string generation
   */
  generateSecureId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    return result;
  },

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Add enhanced animation styles for Micro theme
const style = document.createElement('style');
style.textContent = `
  @keyframes micro-ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes storm-glow {
    0%, 100% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    50% {
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    }
  }
  
  .btn-active {
    transform: translateY(1px);
  }
  
  .focused {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
  
  .nav-link.active {
    color: var(--color-accent);
  }
  
  .nav-link.active::after {
    width: 100%;
  }
  
  .reduce-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .high-contrast .btn-secondary {
    border-width: 2px;
  }
  
  .high-contrast .feature-item:hover,
  .high-contrast .intelligence-item:hover {
    border-width: 2px;
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    MicroErrorHandler.init();
    new MicroUI();
  });
} else {
  MicroErrorHandler.init();
  new MicroUI();
}

// Export for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MicroUI, MicroErrorHandler, MicroUtils };
}
