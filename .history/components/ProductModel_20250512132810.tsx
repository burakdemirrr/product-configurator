import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useConfiguratorStore } from '../stores/useConfiguratorStore';

interface ProductModelProps {
  modelPath: string;
}

export function ProductModel({ modelPath }: ProductModelProps) {
  const { color, metalness, roughness, accessories } = useConfiguratorStore();
  const modelRef = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);

  // Clone the model to prevent modifying the cached original
  useEffect(() => {
    if (!modelRef.current) return;

    // Clear any existing children
    while (modelRef.current.children.length > 0) {
      modelRef.current.remove(modelRef.current.children[0]);
    }
    
    // Add the cloned scene
    modelRef.current.add(scene.clone());
  }, [scene]);

  // Update materials based on configurator state
  useEffect(() => {
    if (!modelRef.current) return;
    
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
  }, [color, metalness, roughness, accessories]);

  // Optional: Add a subtle rotation animation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  return <group ref={modelRef} />;
} 