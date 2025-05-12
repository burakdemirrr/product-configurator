import { useConfiguratorStore } from '../stores/useConfiguratorStore';

export function FallbackView() {
  const { color, metalness, roughness } = useConfiguratorStore();
  
  // Generate inline styles based on current configurator state
  const boxStyle = {
    width: '280px',
    height: '160px',
    backgroundColor: color,
    opacity: 1 - roughness * 0.7,
    boxShadow: `0 4px 20px rgba(0,0,0,${0.3 + metalness * 0.5})`,
    borderRadius: '12px',
    transform: 'rotate(-10deg) perspective(500px) rotateY(15deg)',
    transition: 'all 0.5s ease'
  };
  
  const glareStyle = {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    right: '0',
    height: '40%',
    background: `linear-gradient(to bottom, rgba(255,255,255,${metalness * 0.7}), transparent)`,
    borderRadius: '12px 12px 0 0',
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center flex-col bg-gray-800">
      <div className="relative mb-8">
        <div style={boxStyle}></div>
        <div style={glareStyle}></div>
      </div>
      
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold mb-2 text-gray-200">3D Viewer Not Available</h2>
        <p className="mb-4 text-gray-300">
          We're showing this simplified view because the 3D model couldn't be loaded.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Try a different browser or device with WebGL support.
        </p>
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
} 