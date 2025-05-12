"use client";

import { Layout } from '../components/Layout';
import { CanvasScene } from '../components/CanvasScene';
import { ControlsUI } from '../components/ControlsUI';
import dynamic from 'next/dynamic';

// Dynamically import the SnapshotButtonContainer to avoid SSR issues
const SnapshotButtonContainer = dynamic(
  () => import('../components/SnapshotButtonContainer').then(mod => ({ default: mod.SnapshotButtonContainer })),
  { ssr: false }
);

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* 3D Canvas - Takes up more space on larger screens */}
        <div className="w-full md:w-3/4 relative">
          <div className="w-full h-[500px] md:h-[600px] bg-gray-100 rounded-lg shadow-md overflow-hidden relative">
            <CanvasScene />
            <SnapshotButtonContainer />
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
