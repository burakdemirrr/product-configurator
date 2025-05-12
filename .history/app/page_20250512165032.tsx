"use client";

import { Layout } from '../components/Layout';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Simple error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Error caught by boundary:', event.error);
      setHasError(true);
    };
    
    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);
  
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-500/10 p-4 rounded-lg border border-red-500/30">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2 font-['Orbitron']">3D Rendering Error</h2>
          <p className="mb-4 text-indigo-200">There was an error loading the 3D model.</p>
          <button 
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-indigo-950 rounded-md font-medium transition-all duration-200 shadow-lg shadow-teal-500/20"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Dynamically import 3D components with loading fallbacks
const CanvasScene = dynamic(
  () => import('../components/CanvasScene').then(mod => mod.CanvasScene)
    .catch(err => {
      console.error("Failed to load CanvasScene:", err);
      // Return a simple fallback component
      return () => (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold text-red-600">Failed to load 3D viewer</h2>
            <p>Please check console for details and make sure WebGL is enabled.</p>
          </div>
        </div>
      );
    }),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] md:h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-3 text-gray-700">Loading 3D viewer...</p>
        </div>
      </div>
    )
  }
);

const ControlsUI = dynamic(
  () => import('../components/ControlsUI').then(mod => ({ default: mod.ControlsUI })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full max-w-xs bg-white/90 p-4 rounded-lg shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Only render components on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Performance optimization: disable animation frames when tab is not visible
  useEffect(() => {
    let animationActive = true;
    
    const handleVisibilityChange = () => {
      animationActive = !document.hidden;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      animationActive = false;
    };
  }, []);
  
  // Add service worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed: ', error);
        });
    }
  }, []);
  
  if (!mounted) {
    return (
      <Layout>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4 relative">
            <div className="w-full h-[500px] md:h-[600px] bg-black/50 rounded-lg border border-blue-500/20"></div>
          </div>
          <div className="w-full md:w-1/4"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* 3D Canvas - Takes up more space on larger screens */}
        <div className="w-full md:w-3/4 relative">
          <div className="w-full h-[500px] md:h-[600px] bg-black/50 rounded-lg border border-blue-500/20 shadow-xl shadow-blue-500/5 overflow-hidden relative">
            <ErrorBoundary>
              <CanvasScene />
            </ErrorBoundary>
          </div>
        </div>
        
        {/* Controls Panel - Fixed width on larger screens */}
        <div className="w-full md:w-1/4">
          <ControlsUI />
        </div>
      </div>
    </Layout>
  );
}
