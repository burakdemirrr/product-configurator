export function ModelPlaceholderMessage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl max-w-md border border-[#2A2A2A] font-['Montserrat']">
        <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] font-['Orbitron']">3D Model Loading Error</h2>
        
        <p className="mb-3 text-gray-300">
          We couldn&apos;t load the 3D model. This could be due to:
        </p>
        
        <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-300">
          <li>Missing model file (check that <code className="bg-[#252525] px-1 py-0.5 rounded text-[#A78BFA] font-mono">car_glb.glb</code> exists in <code className="bg-[#252525] px-1 py-0.5 rounded text-[#A78BFA] font-mono">public/models/</code>)</li>
          <li>WebGL not supported by your browser</li>
          <li>The model file is corrupted or in the wrong format</li>
          <li>Your device may not have enough processing power</li>
        </ul>
        
        <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
          <h3 className="font-semibold mb-3 text-[#A78BFA] font-['Orbitron']">Quick Fixes:</h3>
          <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-300">
            <li>Try refreshing the page</li>
            <li>Use a different browser (like Chrome or Firefox)</li>
            <li>Try a different scale setting</li>
          </ol>
          
          <div className="flex space-x-3 mt-5">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-md font-medium transition-all duration-200"
            >
              Reload Page
            </button>
            <a 
              href="/troubleshooting.md" 
              target="_blank" 
              className="px-4 py-2 bg-[#252525] hover:bg-[#303030] transition-colors text-[#A78BFA] rounded border border-[#2A2A2A]"
            >
              Troubleshooting Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 