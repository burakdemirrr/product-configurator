import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Environment, OrbitControls, PerspectiveCamera, ContactShadows, Grid, Center, useHelper } from '@react-three/drei';
import { ProductModel } from './ProductModel';
import { ModelPlaceholderMessage } from './ModelPlaceholderMessage';
import * as THREE from 'three';

export function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelError, setModelError] = useState(false);
  
  // Error handler for model loading failures
  const handleModelError = () => {
    setModelError(true);
  };
  
  // Check if model exists at the specified path
  useEffect(() => {
    const checkModelExists = async () => {
      try {
        const response = await fetch('/models/car_glb.glb', { method: 'HEAD' });
        if (!response.ok) {
          setModelError(true);
        }
      } catch (error) {
        setModelError(true);
      }
    };
    
    checkModelExists();
  }, []);
  
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] relative">
      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 2]} // Responsive DPI
        camera={{ position: [0, 2, 8], fov: 50 }} // Adjusted camera position and FOV
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
          <OrbitControls 
            enablePan={true} 
            minDistance={2}
            maxDistance={20}
            target={[0, 0, 0]} // Look at the center
          />
          
          {/* Environment & Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={0.8} castShadow />
          <Environment preset="studio" />
          
          {/* Grid for reference */}
          <Grid 
            args={[20, 20]} 
            cellSize={1} 
            cellThickness={1} 
            cellColor="#6f6f6f" 
            position={[0, -0.01, 0]} 
          />
          
          {/* Center the product */}
          <Center position={[0, 0, 0]}>
            {/* Product */}
            <ProductModel 
              modelPath="/models/car_glb.glb" 
              onError={handleModelError}
              scale={0.02} // Scale down the model if it's too large
              position={[0, 0, 0]} // Position at center
            />
          </Center>
          
          {/* Floor with shadow */}
          <ContactShadows 
            position={[0, -1, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={1.5} 
            far={5} 
          />
          
          {/* World axes helper for debugging */}
          <axesHelper args={[5]} />
        </Suspense>
      </Canvas>
      
      {/* Show placeholder message when there's an error or no model available */}
      {modelError && <ModelPlaceholderMessage />}
    </div>
  );
} 