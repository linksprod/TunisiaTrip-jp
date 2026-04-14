// Add TypeScript declaration for window.googleMapsLoaded
declare global {
  interface Window {
    googleMapsLoaded?: boolean;
  }
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/global-styles.css'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// Import critical and deferred initialization
import { 
  addCriticalResourceHints, 
  preloadCriticalAssets, 
  setupCriticalSafeguards,
  eliminateRenderBlocking
} from './utils/criticalInit'
import { runDeferredInit } from './utils/deferredInit'
import { monitorPerformanceBudget } from './utils/performanceBudget'
import { optimizeLCPImage, setupLCPMonitoring } from './utils/lcpOptimization'

// CRITICAL PATH - Only essential tasks before React renders
const runCriticalInit = () => {
  try {
    // Eliminate render-blocking first
    eliminateRenderBlocking();
    
    // LCP optimization
    optimizeLCPImage();
    
    // Other critical tasks
    addCriticalResourceHints();
    preloadCriticalAssets();
    setupCriticalSafeguards();
    
    console.log('Critical initialization completed');
  } catch (err) {
    console.error("Critical initialization error:", err);
  }
};

// Run critical initialization immediately
runCriticalInit();

// Render the app with error boundary
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');
    
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    
    console.log('App rendered successfully');
  } catch (err) {
    console.error("Error rendering application:", err);
    
    // Fallback rendering in case of critical error
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #e53e3e;">Unable to load application</h2>
          <p>Please refresh the page or try again later.</p>
          <button onclick="window.location.reload()" 
                  style="margin-top: 20px; padding: 8px 16px; background: #3182ce; color: white; 
                  border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

// Immediately start React rendering for faster FCP
renderApp();

// Register Service Worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.warn('Service Worker registration failed:', error);
      });
  });
}

// DEFERRED INITIALIZATION - Run after React has started rendering
const deferNonCriticalInit = () => {
  // Use multiple strategies to ensure deferred init runs after FCP
  if ('requestIdleCallback' in window) {
    // Use requestIdleCallback if available (best for performance)
    window.requestIdleCallback(() => {
      runDeferredInit();
      monitorPerformanceBudget();
      setupLCPMonitoring();
    }, { timeout: 3000 });
  } else {
    // Fallback to setTimeout for older browsers
    setTimeout(() => {
      runDeferredInit();
      monitorPerformanceBudget();
      setupLCPMonitoring();
    }, 100);
  }
};

// Start deferred initialization
deferNonCriticalInit();
