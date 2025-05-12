import { useConfiguratorStore } from '../stores/useConfiguratorStore';

export function ControlsUI() {
  const { 
    color, 
    metalness, 
    roughness, 
    setColor, 
    setMetalness, 
    setRoughness 
  } = useConfiguratorStore();

  return (
    <div className="w-full max-w-xs bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Customize Product</h2>
      
      {/* Color Picker */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="color">
          Color
        </label>
        <div className="flex items-center">
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-md overflow-hidden cursor-pointer"
          />
          <span className="ml-3 text-sm text-gray-600">{color}</span>
        </div>
      </div>

      {/* Metalness Slider */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="metalness">
          Metalness: {metalness.toFixed(2)}
        </label>
        <input
          type="range"
          id="metalness"
          min="0"
          max="1"
          step="0.01"
          value={metalness}
          onChange={(e) => setMetalness(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Roughness Slider */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="roughness">
          Roughness: {roughness.toFixed(2)}
        </label>
        <input
          type="range"
          id="roughness"
          min="0"
          max="1"
          step="0.01"
          value={roughness}
          onChange={(e) => setRoughness(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
} 