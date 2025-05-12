import { useConfiguratorStore } from '../stores/useConfiguratorStore';
import { useState, useEffect } from 'react';

export function ControlsUI() {
  const { 
    color, 
    metalness, 
    roughness, 
    accessories,
    setColor, 
    setMetalness, 
    setRoughness,
    toggleAccessory
  } = useConfiguratorStore();
  
  // Sample accessories - in a real app, these would be detected from the model
  const [accessoryList, setAccessoryList] = useState<string[]>([
    'accessory_spoiler',
    'accessory_rims',
    'accessory_tint'
  ]);

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
      
      {/* Accessories Toggles */}
      {accessoryList.length > 0 && (
        <div className="mb-4">
          <h3 className="block text-gray-700 text-sm font-semibold mb-2">Accessories</h3>
          <div className="space-y-2">
            {accessoryList.map((accessory) => (
              <div key={accessory} className="flex items-center">
                <input
                  type="checkbox"
                  id={accessory}
                  checked={accessories[accessory] || false}
                  onChange={() => toggleAccessory(accessory)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <label htmlFor={accessory} className="ml-2 text-sm text-gray-700">
                  {accessory.replace('accessory_', '').replace(/^./, (str) => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Material Presets */}
      <div className="mb-4">
        <h3 className="block text-gray-700 text-sm font-semibold mb-2">Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => {
              setColor('#2196f3');
              setMetalness(0.9);
              setRoughness(0.1);
            }}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Chrome Blue
          </button>
          <button 
            onClick={() => {
              setColor('#f44336');
              setMetalness(0.7);
              setRoughness(0.3);
            }}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Metallic Red
          </button>
          <button 
            onClick={() => {
              setColor('#4caf50');
              setMetalness(0.2);
              setRoughness(0.8);
            }}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Matte Green
          </button>
          <button 
            onClick={() => {
              setColor('#ffc107');
              setMetalness(0.5);
              setRoughness(0.5);
            }}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Satin Gold
          </button>
        </div>
      </div>
    </div>
  );
} 