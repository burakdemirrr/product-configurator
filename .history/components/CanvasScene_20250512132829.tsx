import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Environment, OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { ProductModel } from './ProductModel';

export function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px]">
      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 2]} // Responsive DPI
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI - Math.PI / 6} 
          />
          
          {/* Environment & Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Environment preset="studio" />
          
          {/* Product */}
          <ProductModel modelPath="/models/product.glb" />
          
          {/* Floor with shadow */}
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={1.5} 
            far={1.5} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 