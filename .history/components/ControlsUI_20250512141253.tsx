import { useConfiguratorStore } from '../stores/useConfiguratorStore';
import { useState, useEffect } from 'react';

// Add scaling presets for common models
const SCALE_PRESETS = [
  { name: "Normal (1.0)", value: 1.0 },
  { name: "Small (0.5)", value: 0.5 },
  { name: "Very Small (0.1)", value: 0.1 },
  { name: "Tiny (0.01)", value: 0.01 },
  { name: "Large (2.0)", value: 2.0 }
];

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

  // For model scaling and positioning
  const [currentScale, setCurrentScale] = useState<number>(0.02);
  
  // Update query parameter when scale changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('scale', currentScale.toString());
    window.history.replaceState({}, '', url.toString());
    
    // Trigger page reload to apply new scale
    if (window.location.search.includes('scale=') && 
        window.location.search.indexOf('scale=') !== window.location.search.lastIndexOf('scale=')) {
      window.location.reload();
    }
  }, [currentScale]);

  return (
    <div className="w-full max-w-xs bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Customize Product</h2>
      
      {/* Model Scale Control */}
      <div className="mb-5 pb-4 border-b border-gray-200">
        <h3 className="text-gray-700 text-sm font-semibold mb-2">Model Scale</h3>
        <div className="flex gap-2 flex-wrap">
          {SCALE_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => setCurrentScale(preset.value)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                currentScale === preset.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Changing scale will reload the page. Current: {currentScale}
        </p>
      </div>
      
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
        <h3 className="block text-gray-700 text-sm font-semibold mb-2">Material Presets</h3>
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
      
      <div className="text-xs text-gray-500 mt-4">
        <h4 className="font-medium mb-1">Model Troubleshooting:</h4>
        <ul className="list-disc pl-4 space-y-1">
          <li>If model is too big/small, try different scale presets</li>
          <li>Use mouse wheel to zoom, drag to orbit</li>
          <li>Right-click and drag to pan</li>
        </ul>
      </div>
    </div>
  );
} 