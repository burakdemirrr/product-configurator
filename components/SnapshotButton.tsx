import { useThree } from '@react-three/fiber';

export function SnapshotButton() {
  const { gl, scene, camera } = useThree();
  
  const takeSnapshot = () => {
    // Force a render
    gl.render(scene, camera);
    
    // Get the canvas element and convert to data URL
    const dataURL = gl.domElement.toDataURL('image/png');
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `product-config-${timestamp}.png`;
    link.href = dataURL;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <button
      onClick={takeSnapshot}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
      Save Snapshot
    </button>
  );
} 