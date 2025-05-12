import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { 
  Environment, 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Center,
  useGLTF,
  Loader,
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows
} from '@react-three/drei';
import { ProductModel } from './ProductModel';
import { ModelPlaceholderMessage } from './ModelPlaceholderMessage';
import { FallbackView } from './FallbackView';

// Preload the model with retry functionality
function preloadWithRetry(modelPath: string, maxRetries = 3) {
  let retries = 0;
  
  const tryPreload = () => {
    console.log(`Attempting to preload model (attempt ${retries + 1}/${maxRetries})`);
    try {
      useGLTF.preload(modelPath, true);
    } catch (error) {
      console.error(`Preload attempt ${retries + 1} failed:`, error);
      retries++;
      if (retries < maxRetries) {
        setTimeout(tryPreload, 1000); // Wait 1 second before retrying
      }
    }
  };
  
  tryPreload();
}

preloadWithRetry('/models/car_glb.glb');

export function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelError, setModelError] = useState(false);
  const [modelScale, setModelScale] = useState(2.0);
  const [loading, setLoading] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelPath = '/models/car_glb.glb';
  
  // Manual model loading check with XHR
  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', modelPath, true);
    xhr.responseType = 'arraybuffer';
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log('Model file found and loaded via XHR:', xhr.response.byteLength, 'bytes');
        setModelLoaded(true);
      } else {
        console.error('XHR Error loading model:', xhr.statusText);
        setModelError(true);
      }
      setLoading(false);
    };
    
    xhr.onerror = function() {
      console.error('XHR Network error loading model');
      setModelError(true);
      setLoading(false);
    };
    
    xhr.send();
    
    // Check if model file exists
    console.log('Attempting to load model from:', modelPath);
    
    return () => {
      xhr.abort();
    };
  }, [modelPath]);
  
  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error('WebGL not supported');
        setWebglSupported(false);
      }
    } catch (e) {
      console.error('Error checking WebGL support:', e);
      setWebglSupported(false);
    }
  }, []);
  
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
  
  const orbitControlsProps = useMemo(() => ({
    enablePan: true,
    minDistance: 5,
    maxDistance: 20,
    target: [0, 0.75, 0] as [number, number, number],
    enableDamping: true,
    dampingFactor: 0.1,
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: Math.PI * 0.6
  }), []);

  // If WebGL is not supported, show fallback
  if (!webglSupported) {
    return <FallbackView />;
  }
  
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

      {/* Show model loaded status for debugging */}
      {modelLoaded && !modelError && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded z-10 opacity-75">
          Model loaded successfully
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
          depth: true,
          failIfMajorPerformanceCaveat: false // Try to render even on low-end devices
        }}
        camera={{ position: [5, 2, 10], fov: 50, near: 0.1, far: 1000 }}
        performance={{ min: 0.5 }} // Allow the renderer to drop to 0.5x resolution during high load
        onError={(error) => {
          console.error('Canvas render error:', error);
          setModelError(true);
          setLoading(false);
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows />
        
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[3, 1.5, 8]} fov={45} />
          <OrbitControls 
            {...orbitControlsProps}
            target={[0, 0.75, 0]}
            enableDamping={true}
            dampingFactor={0.1}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI * 0.6}
          />
          
          {/* Environment & Lighting - Optimized */}
          <ambientLight intensity={1.0} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={1024} // Reduced from default for performance
          />
          <directionalLight position={[-10, 10, -5]} intensity={1.2} castShadow={true} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <Environment 
            files="/hdri/bloem_train_track_cloudy_4k.exr"
            background={false}
            resolution={256} // Further reduced for better performance
            path=""
            blur={0.5} // Add some blur to hide compression artifacts
          />
          
          {/* Add dark background color to match UI Design Daily dark mode */}
          <color attach="background" args={['#121212']} />
          
          {/* Center the product */}
          <Center position={[0, 0, 0]}>
            {/* Product */}
            <ProductModel 
              modelPath="/models/car_glb.glb" 
              onError={() => {
                console.error("Failed to load model, showing fallback");
                setModelError(true);
                setLoading(false);
              }}
              scale={modelScale}
              position={[0, 0.25, 0]}
            />
            
            {/* Fallback if model fails */}
            {modelError && (
              <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[2, 1, 3]} />
                <meshStandardMaterial color="#8B5CF6" />
              </mesh>
            )}
          </Center>
          
          {/* Floor with shadow - Lower quality for performance */}
          <ContactShadows 
            position={[0, -0.25, 0]} 
            opacity={0.6}
            scale={20} 
            blur={2}
            far={4}
            resolution={128} // Lower resolution for better performance
            frames={1} // Only render shadow once for better performance
            color="#000000"
          />
        </Suspense>
      </Canvas>
      
      <Loader />
      
      {/* Show placeholder message when there's an error or no model available */}
      {modelError && <ModelPlaceholderMessage />}
    </div>
  );
} 