"use client";

import { Layout } from '../components/Layout';
import { CanvasScene } from '../components/CanvasScene';
import { ControlsUI } from '../components/ControlsUI';
import { SnapshotButtonContainer } from '../components/SnapshotButtonContainer';
import { useEffect, useState } from 'react';

export default function Home() {
  // Client-side rendering for components that need browser APIs
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* 3D Canvas - Takes up more space on larger screens */}
        <div className="w-full md:w-3/4 relative">
          <div className="w-full h-[500px] md:h-[600px] bg-gray-100 rounded-lg shadow-md overflow-hidden relative">
            <CanvasScene />
            {isClient && <SnapshotButtonContainer />}
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
