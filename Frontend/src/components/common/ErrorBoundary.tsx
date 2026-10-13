import React, { useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setErrorMessage(event.message || 'An unexpected runtime error occurred.');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setErrorMessage(event.reason?.message || String(event.reason) || 'Unhandled promise rejection.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleReset = () => {
    setHasError(false);
    window.location.href = '/';
  };

  const handleClearStorageAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.href = '/';
  };

  if (hasError) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-slate-400 mb-4">
            An unexpected error occurred while loading this view. You can reload or reset stored data to recover immediately.
          </p>

          {errorMessage && (
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 mb-6 text-xs font-mono text-rose-300 overflow-x-auto max-h-36">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>

            <button
              type="button"
              onClick={handleClearStorageAndReload}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer border border-slate-700"
            >
              <Trash2 className="w-4 h-4 text-amber-400" />
              Clear Cache & Restart Fresh
            </button>

            <a
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs transition-colors cursor-pointer text-center"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Store Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ErrorBoundary;
