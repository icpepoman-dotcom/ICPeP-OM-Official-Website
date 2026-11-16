import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Portal ErrorBoundary caught error:', error, info);
  }

  handleResetCache = () => {
    try {
      const keysToClear = [
        'icpep_oman_content_v1',
        'icpep_oman_admin_auth',
        'icpep_oman_current_user_v1',
      ];
      keysToClear.forEach((k) => localStorage.removeItem(k));
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EEEEE7] text-[#12203A] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-[#F6F6F2] border-2 border-[#12203A] p-6 shadow-xl space-y-4">
            <div className="font-mono text-xs uppercase tracking-wider text-[#9C3B2E] font-bold">
              ICpEP-Oman Portal Recovery
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#12203A]">
              Portal Display Interrupted
            </h1>
            <p className="text-sm text-[#3B475C]">
              A cached configuration or runtime error prevented the page from rendering cleanly. You can safely reset the local browser display cache to restore the portal.
            </p>
            <div className="p-3 bg-white border border-[#CDCDC0] font-mono text-xs text-[#9C3B2E] break-words">
              {this.state.errorMessage}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleResetCache}
                className="px-4 py-2 bg-[#12203A] text-[#EEEEE7] font-mono text-xs uppercase font-bold border border-[#C99A2E] hover:bg-[#1C2F54]"
              >
                Reset Cache & Reload Portal
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-[#12203A] font-mono text-xs uppercase font-bold border border-[#CDCDC0] hover:bg-[#E3E3D8]"
              >
                Retry Load
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
