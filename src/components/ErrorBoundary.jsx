import React from "react";
import { AlertCircle } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <div className="max-w-md w-full p-6 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
              <h2 className="font-semibold text-lg">Something went wrong</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              The app hit an unexpected error. Try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="text-sm font-medium underline hover:no-underline"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
