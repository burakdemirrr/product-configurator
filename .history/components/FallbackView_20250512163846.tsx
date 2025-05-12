import { useConfiguratorStore } from '../stores/useConfiguratorStore';

export function FallbackView() {
  const { color, metalness, roughness } = useConfiguratorStore();
  
  // Generate inline styles based on current configurator state
  const boxStyle = {
    width: '280px',
    height: '160px',
    backgroundColor: color,
    opacity: 1 - roughness * 0.7,
    boxShadow: `0 8px 32px rgba(0,0,0,${0.3 + metalness * 0.5})`,
    borderRadius: '12px',
    transform: 'rotate(-10deg) perspective(500px) rotateY(15deg)',
    transition: 'all 0.5s ease',
    border: `1px solid rgba(79, 209, 197, ${metalness * 0.3})`
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
    <div className="w-full h-full flex items-center justify-center flex-col bg-indigo-950 font-['Montserrat']">
      <div className="relative mb-8">
        <div style={boxStyle}></div>
        <div style={glareStyle}></div>
      </div>
      
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold mb-2 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-400">
          3D Viewer Not Available
        </h2>
        <p className="mb-4 text-indigo-200">
          We're showing this simplified view because the 3D model couldn't be loaded.
        </p>
        <p className="text-sm text-indigo-300 mb-6">
          Try a different browser or device with WebGL support.
        </p>
        <button 
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-indigo-950 rounded-md font-medium transition-all duration-200 shadow-lg shadow-teal-500/20"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
} 