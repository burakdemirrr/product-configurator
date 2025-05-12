import { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useConfiguratorStore } from '../stores/useConfiguratorStore';

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

  console.log('ProductModel - Attempting to load:', modelPath);
  
  // Load the model directly with error handling
  const { scene, nodes, materials, animations } = useGLTF(modelPath);
  
  console.log('Model loading result:', { 
    sceneLoaded: !!scene, 
    nodeCount: Object.keys(nodes || {}).length,
    materials: Object.keys(materials || {}).length,
    animations: (animations || []).length 
  });

  // Handle errors
  useEffect(() => {
    if (!scene) {
      console.error('Failed to load model scene');
      setModelError(true);
      if (onError) onError();
      return;
    }
  }, [scene, onError]);

  // Use effect to update the model
  useEffect(() => {
    if (!modelRef.current || !scene || modelError) return;
    
    try {
      console.log('Setting up model in scene');
      
      // Clear existing children
      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
      }
      
      // Clone and add the scene
      const clonedScene = scene.clone();
      modelRef.current.add(clonedScene);
      
      // Apply scale
      if (typeof scale === 'number') {
        modelRef.current.scale.set(scale, scale, scale);
      } else {
        modelRef.current.scale.set(scale[0], scale[1], scale[2]);
      }
      
      // Apply position
      modelRef.current.position.set(position[0], position[1], position[2]);
      
      // Update materials
      modelRef.current.traverse((node) => {
        if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
          node.material.color.set(color);
          node.material.metalness = metalness;
          node.material.roughness = roughness;
          node.material.needsUpdate = true;

          // Handle accessories visibility with improved detection
          const nodeName = node.name.toLowerCase();
          
          // Log all mesh names to help with debugging
          console.log('Found mesh:', nodeName);
          
          // Check for common accessory naming patterns
          const isAccessory = 
            nodeName.includes('accessory') || 
            nodeName.includes('extra') ||
            nodeName.includes('option') ||
            nodeName.includes('part_') ||
            nodeName.includes('wheel') ||
            nodeName.includes('rim') ||
            nodeName.includes('spoiler') ||
            nodeName.includes('bumper') ||
            nodeName.includes('wing') ||
            nodeName.includes('light');
          
          if (isAccessory) {
            // Extract accessory key name from the full node name
            const accessoryKey = nodeName.replace(/[^a-z0-9_]/g, '_');
            console.log('Detected accessory:', accessoryKey);
            
            // Dispatch custom event for accessory detection
            if (typeof window !== 'undefined') {
              const event = new CustomEvent('accessoryFound', { 
                detail: { accessoryKey } 
              });
              window.dispatchEvent(event);
            }
            
            // Check if this accessory has a toggle state in the store
            if (accessories[accessoryKey] !== undefined) {
              node.visible = accessories[accessoryKey];
            } else {
              // For newly discovered accessories, they start visible
              console.log('New accessory found:', accessoryKey);
            }
          }
        }
      });
      
      console.log('Model setup complete');
    } catch (error) {
      console.error('Error setting up model:', error);
      setModelError(true);
      if (onError) onError();
    }
  }, [scene, color, metalness, roughness, accessories, modelError, onError, position, scale]);

  if (modelError) {
    console.log('Showing fallback model due to error');
    return <FallbackModel scale={scale} position={position} />;
  }

  return <group ref={modelRef} />;
} 