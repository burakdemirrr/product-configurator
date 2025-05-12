import { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, BoxGeometry } from 'three';
import { useConfiguratorStore } from '../stores/useConfiguratorStore';

interface ProductModelProps {
  modelPath: string;
}

// Create a fallback model when the actual model isn't available
function FallbackModel() {
  const meshRef = useRef<Mesh>(null);
  const { color, metalness, roughness } = useConfiguratorStore();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        metalness={metalness} 
        roughness={roughness} 
      />
    </mesh>
  );
}

export function ProductModel({ modelPath }: ProductModelProps) {
  const { color, metalness, roughness, accessories } = useConfiguratorStore();
  const modelRef = useRef<Group>(null);
  const [modelError, setModelError] = useState(false);
  
  // Try to load the model, but catch any errors
  const { scene } = useGLTF(modelPath, undefined, undefined, (e) => {
    console.error('Error loading model:', e);
    setModelError(true);
  });

  // Clone the model to prevent modifying the cached original
  useEffect(() => {
    if (!modelRef.current || modelError) return;

    // Clear any existing children
    while (modelRef.current.children.length > 0) {
      modelRef.current.remove(modelRef.current.children[0]);
    }
    
    // Add the cloned scene
    try {
      modelRef.current.add(scene.clone());
    } catch (error) {
      console.error("Error adding model to scene:", error);
      setModelError(true);
    }
  }, [scene, modelError]);

  // Update materials based on configurator state
  useEffect(() => {
    if (!modelRef.current || modelError) return;
    
    modelRef.current.traverse((node) => {
      if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
        // Apply material properties from the store
        node.material.color.set(color);
        node.material.metalness = metalness;
        node.material.roughness = roughness;
        node.material.needsUpdate = true;

        // Handle accessories visibility (if implemented)
        const accessoryName = node.name.toLowerCase();
        if (accessoryName.includes('accessory') && accessories[accessoryName] !== undefined) {
          node.visible = accessories[accessoryName];
        }
      }
    });
  }, [color, metalness, roughness, accessories, modelError]);

  // Optional: Add a subtle rotation animation
  useFrame((state, delta) => {
    if (modelRef.current && !modelError) {
      modelRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  // If there's an error, show the fallback model
  if (modelError) {
    return <FallbackModel />;
  }

  return <group ref={modelRef} />;
} 