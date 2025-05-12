import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ModelLoaderProps {
  modelPath: string;
  onSuccess: () => void;
  onError: () => void;
}

export function ModelLoader({ modelPath, onSuccess, onError }: ModelLoaderProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  useEffect(() => {
    console.log(`ModelLoader: Loading model from ${modelPath}`);
    
    const loader = new GLTFLoader();
    
    // First check if file exists
    fetch(modelPath)
      .then(response => {
        if (!response.ok) {
          console.error(`ModelLoader: HTTP error ${response.status} for ${modelPath}`);
          throw new Error(`HTTP error ${response.status}`);
        }
        return response;
      })
      .then(() => {
        // File exists, now try to load it with GLTFLoader
        loader.load(
          modelPath,
          (gltf) => {
            console.log('ModelLoader: Successfully loaded model', gltf);
            setStatus('success');
            onSuccess();
          },
          (progress) => {
            const percentComplete = Math.round((progress.loaded / progress.total) * 100);
            console.log(`ModelLoader: Loading progress: ${percentComplete}%`);
          },
          (error) => {
            console.error('ModelLoader: Error loading model:', error);
            setStatus('error');
            onError();
          }
        );
      })
      .catch(error => {
        console.error('ModelLoader: Error checking model existence:', error);
        setStatus('error');
        onError();
      });
    
    return () => {
      // Cancel loader if component unmounts
      loader.dispose();
    };
  }, [modelPath, onSuccess, onError]);
  
  // Return loading status for debugging or future UI integration
  return status === 'loading' ? <div className="sr-only">Loading model...</div> : null;
} 