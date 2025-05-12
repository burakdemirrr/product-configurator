import { useConfiguratorStore } from '../stores/useConfiguratorStore';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

// Add scaling presets for common models
const SCALE_PRESETS = [
  { name: "Normal (1.0)", value: 1.0 },
  { name: "Small (0.5)", value: 0.5 },
  { name: "Very Small (0.1)", value: 0.1 },
  { name: "Tiny (0.01)", value: 0.01 },
  { name: "Large (2.0)", value: 2.0 }
];

// Default accessories to show when model doesn't have any
const DEFAULT_ACCESSORIES = [
  { id: 'wheel', label: 'Wheels' },
  { id: 'spoiler', label: 'Spoiler' },
  { id: 'rim', label: 'Rims' },
  { id: 'bumper', label: 'Bumper' },
  { id: 'wing', label: 'Wing' }
];

// Map for converting accessory IDs to user-friendly labels
const ACCESSORY_LABELS: Record<string, string> = {
  wheel: 'Wheels',
  rim: 'Rims',
  spoiler: 'Spoiler',
  bumper: 'Bumper',
  wing: 'Wing',
  light: 'Extra Lights',
  window_tint: 'Window Tint',
  roof_rack: 'Roof Rack',
  antenna: 'Antenna',
  exhaust: 'Exhaust'
};

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
  
  // State for detected accessories from the model
  const [detectedAccessories, setDetectedAccessories] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // For model scaling and positioning
  const [currentScale, setCurrentScale] = useState<number>(2.0);
  
  // Listen for accessory detection events from the model component
  useEffect(() => {
    const handleAccessoryFound = (event: CustomEvent) => {
      const { accessoryKey } = event.detail;
      
      setDetectedAccessories(prev => {
        if (!prev.includes(accessoryKey)) {
          return [...prev, accessoryKey];
        }
        return prev;
      });
    };
    
    window.addEventListener('accessoryFound', handleAccessoryFound as EventListener);
    
    return () => {
      window.removeEventListener('accessoryFound', handleAccessoryFound as EventListener);
    };
  }, []);

  // Initialize some default accessories if none detected
  useEffect(() => {
    if (detectedAccessories.length === 0) {
      // Use default accessory list as fallback
      DEFAULT_ACCESSORIES.forEach(acc => {
        if (accessories[acc.id] === undefined) {
          toggleAccessory(acc.id);
        }
      });
    } else {
      // Initialize detected accessories
      detectedAccessories.forEach(acc => {
        if (accessories[acc] === undefined) {
          toggleAccessory(acc);
        }
      });
    }
  }, [detectedAccessories, accessories, toggleAccessory]);
  
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
  
  // Get list of accessories to display
  const accessoryList = detectedAccessories.length > 0 
    ? detectedAccessories 
    : DEFAULT_ACCESSORIES.map(acc => acc.id);

  // Helper to get a nice label for an accessory ID
  const getAccessoryLabel = (id: string) => {
    // Check the mapping
    if (ACCESSORY_LABELS[id]) {
      return ACCESSORY_LABELS[id];
    }
    
    // Otherwise generate a label from the ID
    return id
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
      <div className="mb-4 pb-4 border-b border-gray-200">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="color">
          Color
        </label>
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-md overflow-hidden cursor-pointer border border-gray-300"
            style={{ backgroundColor: color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></div>
          <span className="ml-3 text-sm text-gray-600">{color}</span>
        </div>
        
        {showColorPicker && (
          <div className="mt-3 relative">
            <div className="absolute z-10 bg-white rounded-md shadow-xl p-3">
              <HexColorPicker color={color} onChange={setColor} />
              <div className="flex justify-between mt-2">
                <button
                  className="px-2 py-1 bg-gray-200 text-xs rounded"
                  onClick={() => setShowColorPicker(false)}
                >
                  Close
                </button>
                <button
                  className="px-2 py-1 bg-blue-100 text-xs rounded"
                  onClick={() => navigator.clipboard.writeText(color)}
                >
                  Copy Hex
                </button>
              </div>
            </div>
          </div>
        )}
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
      <div className="mb-4 pb-4 border-b border-gray-200">
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
                {getAccessoryLabel(accessory)}
              </label>
            </div>
          ))}
        </div>
      </div>

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
        <h4 className="font-medium mb-1">Tip:</h4>
        <p>Try different material presets to see how they affect the appearance of the car and its accessories.</p>
      </div>
    </div>
  );
} 