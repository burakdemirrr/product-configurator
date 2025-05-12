import { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useConfiguratorStore } from '../stores/useConfiguratorStore';

interface ProductModelProps {
  modelPath: string;
  onError?: () => void;
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

export function ProductModel({ modelPath, onError }: ProductModelProps) {
  const { color, metalness, roughness, accessories } = useConfiguratorStore();
  const modelRef = useRef<Group>(null);
  const [modelError, setModelError] = useState(false);
  
  // Handle model errors
  useEffect(() => {
    const handleModelError = () => {
      setModelError(true);
      if (onError) onError();
    };
    
    // Check if model exists at the specified path
    fetch(modelPath, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) handleModelError();
      })
      .catch(() => handleModelError());
  }, [modelPath, onError]);

  // Load the model
  const { scene } = useGLTF(modelPath);

  // Clone the model to prevent modifying the cached original
  useEffect(() => {
    if (!modelRef.current || modelError || !scene) return;

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
      if (onError) {
        onError();
      }
    }
  }, [scene, modelError, onError]);

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