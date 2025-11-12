'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you could log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <Card className="max-w-md w-full p-6 md:p-8 bg-black/30 border-white/10">
            <div className="space-y-4 md:space-y-6 text-center">
              <div className="inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                <svg
                  className="h-6 w-6 md:h-8 md:w-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Something went wrong
                </h2>
                <p className="text-sm md:text-base text-white/60">
                  We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 p-3 md:p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs md:text-sm text-red-400 text-left font-mono break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  variant="secondary"
                  className="flex-1 rounded-full"
                >
                  Try again
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 rounded-full bg-accent hover:bg-accent/90"
                >
                  Go home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

