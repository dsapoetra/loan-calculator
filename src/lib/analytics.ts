// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for loan calculator events
export const trackCalculatorUsage = (
  calculatorType: 'mortgage' | 'auto-loan' | 'personal-loan' | 'investment',
  action: 'calculate' | 'reset' | 'export_pdf' | 'view_schedule',
  loanAmount?: number,
  interestRate?: number,
  termYears?: number
) => {
  trackEvent(action, `calculator_${calculatorType}`, undefined, loanAmount);
  
  // Track additional parameters as separate events for detailed analysis
  if (loanAmount) {
    trackEvent('loan_amount_range', `calculator_${calculatorType}`, getLoanAmountRange(loanAmount));
  }
  
  if (interestRate) {
    trackEvent('interest_rate_range', `calculator_${calculatorType}`, getInterestRateRange(interestRate));
  }
  
  if (termYears) {
    trackEvent('loan_term', `calculator_${calculatorType}`, `${termYears}_years`);
  }
};

// Track navigation events
export const trackNavigation = (destination: string, source?: string) => {
  trackEvent('navigate', 'navigation', `${source || 'unknown'}_to_${destination}`);
};

// Track form interactions
export const trackFormInteraction = (
  formType: string,
  action: 'start' | 'complete' | 'abandon',
  fieldName?: string
) => {
  trackEvent(action, `form_${formType}`, fieldName);
};

// Track PDF exports
export const trackPDFExport = (
  calculatorType: string,
  reportType: 'summary' | 'schedule' | 'chart'
) => {
  trackEvent('export_pdf', `calculator_${calculatorType}`, reportType);
};

// Track chart interactions
export const trackChartInteraction = (
  chartType: string,
  action: 'view' | 'hover' | 'click',
  calculatorType: string
) => {
  trackEvent(action, `chart_${chartType}`, calculatorType);
};

// Helper functions to categorize values for better analytics
const getLoanAmountRange = (amount: number): string => {
  if (amount < 10000) return 'under_10k';
  if (amount < 50000) return '10k_to_50k';
  if (amount < 100000) return '50k_to_100k';
  if (amount < 250000) return '100k_to_250k';
  if (amount < 500000) return '250k_to_500k';
  if (amount < 1000000) return '500k_to_1m';
  return 'over_1m';
};

const getInterestRateRange = (rate: number): string => {
  if (rate < 2) return 'under_2_percent';
  if (rate < 4) return '2_to_4_percent';
  if (rate < 6) return '4_to_6_percent';
  if (rate < 8) return '6_to_8_percent';
  if (rate < 10) return '8_to_10_percent';
  return 'over_10_percent';
};

// Track user engagement metrics
export const trackEngagement = (
  action: 'time_on_page' | 'scroll_depth' | 'feature_usage',
  value: number,
  label?: string
) => {
  trackEvent(action, 'engagement', label, value);
};

// Track errors for debugging
export const trackError = (
  errorType: string,
  errorMessage: string,
  page?: string
) => {
  trackEvent('error', errorType, `${page || 'unknown'}: ${errorMessage}`);
};
