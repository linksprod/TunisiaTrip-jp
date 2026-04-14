
/**
 * Performance budget monitoring for FCP and other core web vitals
 */

interface PerformanceBudget {
  fcp: number; // First Contentful Paint target (ms)
  lcp: number; // Largest Contentful Paint target (ms)
  fid: number; // First Input Delay target (ms)
  cls: number; // Cumulative Layout Shift target
}

const PERFORMANCE_BUDGET: PerformanceBudget = {
  fcp: 1800, // Google recommendation: 1.8s
  lcp: 2500, // Google recommendation: 2.5s (your current target)
  fid: 100,  // Google recommendation: 100ms
  cls: 0.1   // Google recommendation: 0.1
};

export const monitorPerformanceBudget = () => {
  if (!('PerformanceObserver' in window)) return;
  
  // Monitor FCP budget
  const paintObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const fcpTime = Math.round(entry.startTime);
        const withinBudget = fcpTime <= PERFORMANCE_BUDGET.fcp;
        
        console.log(
          `FCP: ${fcpTime}ms (Budget: ${PERFORMANCE_BUDGET.fcp}ms)`,
          withinBudget ? '✅' : '❌'
        );
        
        if (!withinBudget) {
          console.warn(`FCP exceeded budget by ${fcpTime - PERFORMANCE_BUDGET.fcp}ms`);
        }
      }
    }
  });
  
  // Monitor LCP budget with enhanced logging
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcpTime = Math.round(lastEntry.startTime);
    const withinBudget = lcpTime <= PERFORMANCE_BUDGET.lcp;
    
    console.log(
      `LCP: ${lcpTime}ms (Budget: ${PERFORMANCE_BUDGET.lcp}ms)`,
      withinBudget ? '✅' : '❌'
    );
    
    if (!withinBudget) {
      const overage = lcpTime - PERFORMANCE_BUDGET.lcp;
      console.warn(`🚨 LCP exceeded budget by ${overage}ms`);
      console.log('LCP Element:', (lastEntry as any).element || 'Unknown');
      console.log('LCP URL:', (lastEntry as any).url || 'N/A');
    } else {
      console.log('🎉 LCP within budget!');
    }
  });
  
  try {
    paintObserver.observe({ type: 'paint', buffered: true });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (err) {
    console.warn('Performance budget monitoring failed:', err);
  }
};
