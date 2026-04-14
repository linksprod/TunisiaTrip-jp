
import React, { ErrorInfo, Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      errorInfo: errorInfo
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[200px] text-sm mb-4">
                <p className="font-mono">{this.state.error.toString()}</p>
              </div>
            )}
            {this.state.errorInfo && (
              <details className="mb-4">
                <summary className="cursor-pointer text-blue-600 mb-2">Technical Details</summary>
                <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] text-xs">
                  <pre className="font-mono whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Refresh Page
              </Button>
              <Button 
                onClick={() => window.location.href = "/"}
                variant="outline"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
