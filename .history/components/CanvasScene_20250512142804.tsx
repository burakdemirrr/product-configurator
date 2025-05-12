import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { 
  Environment, 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Grid, 
  Center,
  useGLTF,
  Loader,
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows
} from '@react-three/drei';
import { ProductModel } from './ProductModel';
import { ModelPlaceholderMessage } from './ModelPlaceholderMessage';

// Preload the model
useGLTF.preload('/models/car_glb.glb');

export function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelError, setModelError] = useState(false);
  const [modelScale, setModelScale] = useState(2.0); // Changed from 0.02 to 2.0 for large mode
  const [loading, setLoading] = useState(true);
  
  // Get scale from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const scaleParam = url.searchParams.get('scale');
      if (scaleParam) {
        const scale = parseFloat(scaleParam);
        if (!isNaN(scale)) {
          setModelScale(scale);
        }
      }
    }
  }, []);
  
  // Error handler for model loading failures
  const handleModelError = () => {
    setModelError(true);
    setLoading(false);
  };

  // Successfully loaded model
  const handleModelLoaded = () => {
    setLoading(false);
  };
  
  // Check if model exists at the specified path
  useEffect(() => {
    const checkModelExists = async () => {
      try {
        const response = await fetch('/models/car_glb.glb', { method: 'HEAD' });
        if (!response.ok) {
          setModelError(true);
          setLoading(false);
        }
      } catch (error) {
        setModelError(true);
        setLoading(false);
      }
    };
    
    checkModelExists();
  }, []);

  const orbitControlsProps = useMemo(() => ({
    enablePan: true,
    minDistance: 2,
    maxDistance: 20,
    target: [0, 0, 0],
    enableDamping: true,
    dampingFactor: 0.05
  }), []);
  
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="mt-3 text-gray-700">Loading 3D model...</p>
          </div>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 1.5]} // Lower DPR for better performance
        gl={{ 
          antialias: true, 
          powerPreference: "high-performance",
          alpha: false, // Disable alpha for better performance
          stencil: false, // Disable stencil buffer for better performance
          depth: true
        }}
        camera={{ position: [0, 2, 8], fov: 50 }}
        performance={{ min: 0.5 }} // Allow the renderer to drop to 0.5x resolution during high load
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows />
        
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
          <OrbitControls {...orbitControlsProps} />
          
          {/* Environment & Lighting - Optimized */}
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
            castShadow 
            shadow-mapSize={1024} // Reduced from default for performance
          />
          <directionalLight position={[-10, 10, -5]} intensity={0.8} castShadow={false} />
          <Environment 
            files="/hdri/bloem_train_track_cloudy_4k.exr"
            background={true}
            resolution={512} // Reduced for better performance
            path=""
          />
          
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
              onLoaded={handleModelLoaded}
              scale={modelScale} // Use scale from state
              position={[0, 0, 0]} // Position at center
            />
          </Center>
          
          {/* Floor with shadow - Lower quality for performance */}
          <ContactShadows 
            position={[0, -1, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={1.5} 
            far={5} 
            resolution={128} // Lower resolution for better performance
            frames={1} // Only render shadow once for better performance
          />
        </Suspense>
      </Canvas>
      
      <Loader />
      
      {/* Show placeholder message when there's an error or no model available */}
      {modelError && <ModelPlaceholderMessage />}
    </div>
  );
} 