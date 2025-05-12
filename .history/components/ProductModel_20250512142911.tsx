import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, Vector3, Object3D } from 'three';
import { useConfiguratorStore } from '../stores/useConfiguratorStore';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

interface ProductModelProps {
  modelPath: string;
  onError?: () => void;
  scale?: number | [number, number, number];
  position?: [number, number, number];
}

// Create a fallback model when the actual model isn't available
function FallbackModel({ scale = 1, position = [0, 0, 0] }: { 
  scale?: number | [number, number, number];
  position?: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);
  const { color, metalness, roughness } = useConfiguratorStore();
  
  return (
    <mesh ref={meshRef} scale={scale} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        metalness={metalness} 
        roughness={roughness} 
      />
    </mesh>
  );
}

export function ProductModel({ 
  modelPath, 
  onError,
  scale = 1,
  position = [0, 0, 0]
}: ProductModelProps) {
  const { color, metalness, roughness, accessories } = useConfiguratorStore();
  const modelRef = useRef<Group>(null);
  const [modelError, setModelError] = useState(false);
  
  // Setup Draco loader for better compression
  const dracoLoader = useMemo(() => {
    const loader = new DRACOLoader();
    loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
    return loader;
  }, []);

  // Handle model errors
  const handleError = useCallback(() => {
    setModelError(true);
    if (onError) onError();
  }, [onError]);
  
  // Check if model exists
  useEffect(() => {
    fetch(modelPath, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) handleError();
      })
      .catch(() => handleError());
  }, [modelPath, handleError]);

  // Load the model with optimized settings
  const { scene } = useGLTF(modelPath, true, undefined, (error) => {
    console.error('Error loading model:', error);
    handleError();
  });

  // Prepare scale values for better performance
  const scaleValues = useMemo(() => {
    if (typeof scale === 'number') {
      return [scale, scale, scale] as [number, number, number];
    }
    return scale as [number, number, number];
  }, [scale]);

  // Clone and prepare the model - memoized for better performance
  const preparedModel = useMemo(() => {
    if (!scene || modelError) return null;
    
    try {
      // Clone the model
      const clonedScene = scene.clone();
      
      // Apply material updates
      clonedScene.traverse((node: Object3D) => {
        if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
          // Create a new material instance to avoid shared materials
          const newMaterial = node.material.clone();
          newMaterial.color.set(color);
          newMaterial.metalness = metalness;
          newMaterial.roughness = roughness;
          newMaterial.needsUpdate = true;

          // Apply the new material
          node.material = newMaterial;

          // Handle accessories visibility
          const accessoryName = node.name.toLowerCase();
          if (accessoryName.includes('accessory') && accessories[accessoryName] !== undefined) {
            node.visible = accessories[accessoryName];
          }
        }
      });
      
      return clonedScene;
    } catch (error) {
      console.error("Error preparing model:", error);
      handleError();
      return null;
    }
  }, [scene, modelError, color, metalness, roughness, accessories, handleError]);

  // Update the displayed model
  useEffect(() => {
    if (!modelRef.current || modelError || !preparedModel) return;

    // Clear any existing children
    while (modelRef.current.children.length > 0) {
      modelRef.current.remove(modelRef.current.children[0]);
    }
    
    // Add the prepared model
    modelRef.current.add(preparedModel);
    
    // Apply scale and position directly
    modelRef.current.scale.set(scaleValues[0], scaleValues[1], scaleValues[2]);
    modelRef.current.position.set(position[0], position[1], position[2]);
  }, [preparedModel, modelError, scaleValues, position]);

  // If there's an error, show the fallback model
  if (modelError) {
    return <FallbackModel scale={scale} position={position} />;
  }

  return <group ref={modelRef} />;
} 