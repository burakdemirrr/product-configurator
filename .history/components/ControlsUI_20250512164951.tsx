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
    <div className="w-full max-w-xs bg-black/80 backdrop-blur-md p-6 rounded-lg shadow-xl border border-blue-500/30 font-['Montserrat']">
      <h2 className="text-xl font-bold mb-6 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
        Customize Product
      </h2>
      
      {/* Model Scale Control */}
      <div className="mb-6 pb-4 border-b border-gray-800">
        <h3 className="text-blue-400 text-sm font-medium mb-3">Model Scale</h3>
        <div className="flex gap-2 flex-wrap">
          {SCALE_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => setCurrentScale(preset.value)}
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                currentScale === preset.value 
                  ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-medium shadow-md shadow-fuchsia-500/20' 
                  : 'bg-gray-800 hover:bg-gray-700 text-blue-100 border border-blue-500/20'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Changing scale will reload the page. Current: {currentScale}
        </p>
      </div>
      
      {/* Color Picker */}
      <div className="mb-5 pb-4 border-b border-gray-800">
        <label className="block text-blue-400 text-sm font-medium mb-3" htmlFor="color">
          Color
        </label>
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-md overflow-hidden cursor-pointer border-2 border-blue-500/30 shadow-lg shadow-blue-500/10"
            style={{ backgroundColor: color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></div>
          <span className="ml-3 text-sm text-gray-300 font-mono">{color}</span>
        </div>
        
        {showColorPicker && (
          <div className="mt-3 relative">
            <div className="absolute z-10 bg-black/90 rounded-md shadow-xl p-4 border border-blue-500/20">
              <HexColorPicker color={color} onChange={setColor} />
              <div className="flex justify-between mt-3">
                <button
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs rounded border border-blue-500/10"
                  onClick={() => setShowColorPicker(false)}
                >
                  Close
                </button>
                <button
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-medium"
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
      <div className="mb-5">
        <label className="block text-blue-400 text-sm font-medium mb-2" htmlFor="metalness">
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
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Roughness Slider */}
      <div className="mb-5 pb-4 border-b border-gray-800">
        <label className="block text-blue-400 text-sm font-medium mb-2" htmlFor="roughness">
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
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      {/* Accessories Toggles */}
      <div className="mb-6">
        <h3 className="block text-blue-400 text-sm font-medium mb-3">Accessories</h3>
        <div className="space-y-2.5">
          {accessoryList.map((accessory) => (
            <div key={accessory} className="flex items-center">
              <input
                type="checkbox"
                id={accessory}
                checked={accessories[accessory] || false}
                onChange={() => toggleAccessory(accessory)}
                className="w-4 h-4 text-blue-500 bg-gray-800 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <label htmlFor={accessory} className="ml-2 text-sm text-gray-300">
                {getAccessoryLabel(accessory)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Material Presets */}
      <div className="mb-6">
        <h3 className="block text-blue-400 text-sm font-medium mb-3">Material Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => {
              setColor('#3b82f6');
              setMetalness(0.9);
              setRoughness(0.1);
            }}
            className="px-3 py-2 bg-gradient-to-r from-blue-600/40 to-blue-500/40 hover:from-blue-600/60 hover:to-blue-500/60 rounded text-sm text-blue-100 border border-blue-500/20 transition-all shadow-md shadow-blue-500/5"
          >
            Chrome Blue
          </button>
          <button 
            onClick={() => {
              setColor('#d946ef');
              setMetalness(0.7);
              setRoughness(0.3);
            }}
            className="px-3 py-2 bg-gradient-to-r from-fuchsia-600/40 to-fuchsia-500/40 hover:from-fuchsia-600/60 hover:to-fuchsia-500/60 rounded text-sm text-fuchsia-100 border border-fuchsia-500/20 transition-all shadow-md shadow-fuchsia-500/5"
          >
            Metallic Fuchsia
          </button>
          <button 
            onClick={() => {
              setColor('#60a5fa');
              setMetalness(0.2);
              setRoughness(0.8);
            }}
            className="px-3 py-2 bg-gradient-to-r from-blue-600/30 to-blue-500/30 hover:from-blue-600/50 hover:to-blue-500/50 rounded text-sm text-blue-100 border border-blue-500/20 transition-all shadow-md shadow-blue-500/5"
          >
            Matte Sky
          </button>
          <button 
            onClick={() => {
              setColor('#f472b6');
              setMetalness(0.5);
              setRoughness(0.5);
            }}
            className="px-3 py-2 bg-gradient-to-r from-pink-600/40 to-pink-500/40 hover:from-pink-600/60 hover:to-pink-500/60 rounded text-sm text-pink-100 border border-pink-500/20 transition-all shadow-md shadow-pink-500/5"
          >
            Satin Pink
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-4 p-3 bg-gray-900/70 rounded-md border border-blue-500/10">
        <h4 className="font-medium text-blue-400 mb-1">Pro Tip:</h4>
        <p>Try combining different materials and accessories to create unique product variations.</p>
      </div>
    </div>
  );
} 