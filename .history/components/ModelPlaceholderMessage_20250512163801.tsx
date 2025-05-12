export function ModelPlaceholderMessage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-indigo-950/80 backdrop-blur-md p-6 rounded-lg shadow-xl max-w-md border border-teal-500/20 font-['Montserrat']">
        <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-400 font-['Orbitron']">3D Model Loading Error</h2>
        
        <p className="mb-3 text-indigo-200">
          We couldn't load the 3D model. This could be due to:
        </p>
        
        <ul className="list-disc pl-5 mb-4 space-y-2 text-indigo-200">
          <li>Missing model file (check that <code className="bg-indigo-900 px-1 py-0.5 rounded text-teal-300 font-mono">car_glb.glb</code> exists in <code className="bg-indigo-900 px-1 py-0.5 rounded text-teal-300 font-mono">public/models/</code>)</li>
          <li>WebGL not supported by your browser</li>
          <li>The model file is corrupted or in the wrong format</li>
          <li>Your device may not have enough processing power</li>
        </ul>
        
        <div className="mt-6 pt-4 border-t border-indigo-800">
          <h3 className="font-semibold mb-3 text-teal-300 font-['Orbitron']">Quick Fixes:</h3>
          <ol className="list-decimal pl-5 mb-4 space-y-2 text-indigo-200">
            <li>Try refreshing the page</li>
            <li>Use a different browser (like Chrome or Firefox)</li>
            <li>Try a different scale setting</li>
          </ol>
          
          <div className="flex space-x-3 mt-5">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-indigo-950 rounded-md font-medium transition-all duration-200 shadow-lg shadow-teal-500/20"
            >
              Reload Page
            </button>
            <a 
              href="/troubleshooting.md" 
              target="_blank" 
              className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 transition-colors text-teal-300 rounded border border-teal-500/20"
            >
              Troubleshooting Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 