"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  private errorCount = 0;
  private lastErrorTime = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const now = Date.now();
    const errorId = `err_${now}_${Math.random().toString(36).substr(2, 9)}`;

    // Rate limiting: prevent error spam (max 5 errors per 10 seconds)
    if (now - this.lastErrorTime < 10000) {
      this.errorCount++;
      if (this.errorCount > 5) {
        console.warn("Error rate limit exceeded, suppressing error reporting");
        return;
      }
    } else {
      this.errorCount = 1;
    }
    this.lastErrorTime = now;

    // Update state with error info
    this.setState({ errorInfo, errorId });

    // Build error metadata
    const errorMetadata = {
      errorId,
      timestamp: new Date(now).toISOString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 ErrorBoundary caught error [${errorId}]`);
      console.error("Error:", error);
      console.error("Component Stack:", errorInfo.componentStack);
      console.error("Metadata:", errorMetadata);
      console.groupEnd();
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Integrate with error tracking service (Sentry, DataDog, etc.)
      // Example: Sentry.captureException(error, { contexts: { react: errorMetadata } });

      // Placeholder for error reporting
      this.reportError(errorMetadata);
    }
  }

  private reportError = async (metadata: Record<string, unknown>) => {
    try {
      // Example error reporting endpoint
      // await fetch("/api/errors", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(metadata),
      // });

      console.error("Error reported:", metadata.errorId);
    } catch (reportError) {
      // Silently fail error reporting to prevent infinite loops
      console.error("Failed to report error:", reportError);
    }
  };

  handleReset = () => {
    // Reset error count
    this.errorCount = 0;
    this.lastErrorTime = 0;

    // Reload the page to fully reset component tree
    // This is more reliable than just resetting state
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 text-center mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error ID for support */}
            {this.state.errorId && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Error ID: <span className="font-mono text-gray-700">{this.state.errorId}</span>
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Please reference this ID when contacting support
                </p>
              </div>
            )}

            {/* Development error details */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2 hover:text-gray-900">
                  Error Details (Development Only)
                </summary>
                <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Error Message:</p>
                    <p className="text-xs font-mono text-red-600 break-words">
                      {this.state.error.message}
                    </p>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Stack Trace:</p>
                      <pre className="text-xs font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Component Stack:</p>
                      <pre className="text-xs font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none font-medium"
                aria-label="Reload page and try again"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:outline-none font-medium"
                aria-label="Go to home page"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
