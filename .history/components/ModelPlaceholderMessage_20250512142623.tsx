export function ModelPlaceholderMessage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Welcome to the 3D Product Configurator!</h2>
        
        <p className="mb-3 text-gray-600">
          To use this application with your own 3D model:
        </p>
        
        <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-600">
          <li>Add a GLB file named <code className="bg-gray-100 px-1 py-0.5 rounded">product.glb</code> to the <code className="bg-gray-100 px-1 py-0.5 rounded">public/models/</code> directory</li>
          <li>Make sure your model follows the naming conventions (accessories should include "accessory" in their name)</li>
          <li>Restart the development server</li>
        </ol>
        
        <p className="text-gray-600">
          The fallback cube you see demonstrates the material controls. Try adjusting color, metalness, and roughness!
        </p>
      </div>
    </div>
  );
} 