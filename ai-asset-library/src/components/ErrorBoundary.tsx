import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing due to component errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);

    // In production, this would send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-main p-8">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border-2 border-border-200 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-text-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-text-600 mb-6">
              We're sorry, but something unexpected happened. Please refresh the page to try again.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-surface-50 p-4 rounded-lg border border-border-200 mb-4">
                <summary className="cursor-pointer font-semibold text-sm text-text-900 mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
