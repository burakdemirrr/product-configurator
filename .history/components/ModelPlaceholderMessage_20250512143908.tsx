export function ModelPlaceholderMessage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">3D Model Loading Error</h2>
        
        <p className="mb-3 text-gray-600">
          We couldn't load the 3D model. This could be due to:
        </p>
        
        <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-600">
          <li>Missing model file (check that <code className="bg-gray-100 px-1 py-0.5 rounded">car_glb.glb</code> exists in <code className="bg-gray-100 px-1 py-0.5 rounded">public/models/</code>)</li>
          <li>WebGL not supported by your browser</li>
          <li>The model file is corrupted or in the wrong format</li>
          <li>Your device may not have enough processing power</li>
        </ul>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-semibold mb-2 text-gray-800">Quick Fixes:</h3>
          <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-600">
            <li>Try refreshing the page</li>
            <li>Use a different browser (like Chrome or Firefox)</li>
            <li>Try a different scale setting</li>
          </ol>
          
          <div className="flex space-x-3 mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            <a 
              href="/troubleshooting.md" 
              target="_blank" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Troubleshooting Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 