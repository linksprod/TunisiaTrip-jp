
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import loadingLogoIOS from '@/assets/loading-logo-ios.png';

export const LoadingScreen = () => {
  const [show, setShow] = useState(true);
  const [animationState, setAnimationState] = useState('visible'); // 'visible', 'exiting', 'hidden'
  const [isIOS, setIsIOS] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Detect iOS device
    const checkIsIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(checkIsIOS);
  }, []);

  useEffect(() => {
    // Reset loading state on route change
    setShow(true);
    setAnimationState('visible');
    
    const minDisplayTime = 300; // Reduced for faster FCP - was 1200ms
    const startTime = Date.now();
    
    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      // Use requestAnimationFrame for smoother animation timing
      requestAnimationFrame(() => {
        setTimeout(() => {
          setAnimationState('exiting');
          setTimeout(() => setShow(false), 600); // Keep 600ms for exit animation
        }, remainingTime);
      });
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Hide translation initialization messages that might appear during loading
    const originalConsoleInfo = console.info;
    console.info = function(...args) {
      // Skip logging translation service initialization messages
      const message = args.join(' ');
      if (message.includes('Translation') || 
          message.includes('translat') || 
          message.includes('Loading saved language preference')) {
        // Suppress these messages during loading
        return;
      }
      originalConsoleInfo.apply(console, args);
    };
    
    return () => {
      window.removeEventListener('load', handleLoad);
      // Restore original console.info
      console.info = originalConsoleInfo;
    };
  }, [location.pathname]); // Reset loading state on route change

  if (!show) return null;

  return (
    <div 
      className={`fixed top-16 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-[9998] overflow-hidden
                 ${animationState === 'exiting' ? 'fade-out-bg' : ''}`}
      style={{ 
        transition: 'all 0.6s ease-in-out',
        willChange: 'opacity, transform'
      }}
    >
      <div 
        className={`relative ${animationState === 'exiting' ? 'fade-out' : isIOS ? '' : 'pulse-subtle'}`}
        style={{
          transition: 'all 0.6s ease-in-out',
          willChange: 'opacity, transform'
        }}
      >
        <img 
          src={loadingLogoIOS} 
          alt="Loading..." 
          className={`w-24 h-24 object-contain ${animationState !== 'exiting' ? (isIOS ? 'spin-smooth' : 'pulse-subtle') : ''}`}
          loading="eager"
        />
      </div>
    </div>
  );
};

// Update the animations with optimized properties
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes fade-out {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.95);
      }
    }
    
    .fade-out {
      animation: fade-out 0.6s ease-in-out forwards;
      will-change: opacity, transform;
    }

    @keyframes fade-out-bg {
      0% {
        background-color: rgba(255, 255, 255, 1);
      }
      100% {
        background-color: rgba(255, 255, 255, 0);
      }
    }
    
    @keyframes pulse-subtle {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    
    .pulse-subtle {
      animation: pulse-subtle 2s infinite ease-in-out;
      will-change: transform;
    }
    
    @keyframes spin-smooth {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.05);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }
    
    .spin-smooth {
      animation: spin-smooth 2s ease-in-out infinite;
      will-change: transform;
    }
    
    /* Global page transition animations */
    .page-transition {
      will-change: opacity, transform;
    }
    
    .page-enter {
      opacity: 0;
      transform: translateY(20px);
    }
    
    .page-visible {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
`);
