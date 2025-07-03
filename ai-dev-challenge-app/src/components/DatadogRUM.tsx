import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

interface DatadogRUMProps {
  children: React.ReactNode;
}

export const DatadogRUM: React.FC<DatadogRUMProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Datadog RUM
    datadogRum.init({
      applicationId: '56ff3e23-90fa-45d7-94e7-7b24f9bfa2e3',
      clientToken: 'pub495cd1bac940142e3f5f50083245560b',
      site: 'datadoghq.com',
      service: 'ai-dev-challenge-hub',
      env: 'prod',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      defaultPrivacyLevel: 'mask-user-input',
    });

    // Set global context for the AI Dev Challenge app
    datadogRum.setGlobalContext({
      app_name: 'AI Dev Challenge Hub',
      challenge_type: '5-day-collaborative',
      features: ['repository-tracking', 'timeline', 'statistics', 'admin-panel']
    });

    // Track app initialization
    datadogRum.addAction('app_initialized', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  }, []);

  return <>{children}</>;
};

// Custom hooks for tracking specific events
export const useDatadogTracking = () => {
  const trackRepositoryAction = (action: string, repoUrl: string, day?: string) => {
    try {
      datadogRum.addAction(`repository_${action}`, {
        repo_url: repoUrl,
        challenge_day: day,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to track repository action:', error);
    }
  };

  const trackAdminAction = (action: string, details?: Record<string, any>) => {
    try {
      datadogRum.addAction(`admin_${action}`, {
        ...details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to track admin action:', error);
    }
  };

  const trackError = (error: Error, context?: Record<string, any>) => {
    try {
      datadogRum.addError(error, {
        ...context,
        timestamp: new Date().toISOString()
      });
    } catch (trackingError) {
      console.warn('Failed to track error:', trackingError);
    }
  };

  const trackPageView = (page: string) => {
    try {
      datadogRum.addAction('page_view', {
        page,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  };

  const trackUserInteraction = (interaction: string, details?: Record<string, any>) => {
    try {
      datadogRum.addAction(`user_interaction_${interaction}`, {
        ...details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to track user interaction:', error);
    }
  };

  return {
    trackRepositoryAction,
    trackAdminAction,
    trackError,
    trackPageView,
    trackUserInteraction
  };
}; 