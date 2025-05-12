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
    <div className="w-full max-w-xs bg-indigo-950/70 backdrop-blur-md p-6 rounded-lg shadow-xl border border-teal-500/20 font-['Montserrat']">
      <h2 className="text-xl font-bold mb-6 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-400">
        Customize Product
      </h2>
      
      {/* Model Scale Control */}
      <div className="mb-6 pb-4 border-b border-indigo-800">
        <h3 className="text-teal-300 text-sm font-medium mb-3">Model Scale</h3>
        <div className="flex gap-2 flex-wrap">
          {SCALE_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => setCurrentScale(preset.value)}
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                currentScale === preset.value 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-400 text-indigo-950 font-medium shadow-md shadow-teal-500/20' 
                  : 'bg-indigo-800/50 hover:bg-indigo-700/70 text-teal-100 border border-teal-500/10'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-indigo-300 mt-2">
          Changing scale will reload the page. Current: {currentScale}
        </p>
      </div>
      
      {/* Color Picker */}
      <div className="mb-5 pb-4 border-b border-indigo-800">
        <label className="block text-teal-300 text-sm font-medium mb-3" htmlFor="color">
          Color
        </label>
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-md overflow-hidden cursor-pointer border-2 border-teal-500/30 shadow-lg shadow-teal-500/10"
            style={{ backgroundColor: color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></div>
          <span className="ml-3 text-sm text-indigo-200 font-mono">{color}</span>
        </div>
        
        {showColorPicker && (
          <div className="mt-3 relative">
            <div className="absolute z-10 bg-indigo-900/90 rounded-md shadow-xl p-4 border border-teal-500/20">
              <HexColorPicker color={color} onChange={setColor} />
              <div className="flex justify-between mt-3">
                <button
                  className="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-teal-100 text-xs rounded border border-teal-500/10"
                  onClick={() => setShowColorPicker(false)}
                >
                  Close
                </button>
                <button
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-indigo-950 text-xs rounded font-medium"
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
        <label className="block text-teal-300 text-sm font-medium mb-2" htmlFor="metalness">
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
          className="w-full h-1.5 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Roughness Slider */}
      <div className="mb-5 pb-4 border-b border-indigo-800">
        <label className="block text-teal-300 text-sm font-medium mb-2" htmlFor="roughness">
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
          className="w-full h-1.5 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>
      
      {/* Accessories Toggles */}
      <div className="mb-6">
        <h3 className="block text-teal-300 text-sm font-medium mb-3">Accessories</h3>
        <div className="space-y-2.5">
          {accessoryList.map((accessory) => (
            <div key={accessory} className="flex items-center">
              <input
                type="checkbox"
                id={accessory}
                checked={accessories[accessory] || false}
                onChange={() => toggleAccessory(accessory)}
                className="w-4 h-4 text-teal-500 bg-indigo-800 rounded focus:ring-teal-400 focus:ring-offset-indigo-900"
              />
              <label htmlFor={accessory} className="ml-2 text-sm text-indigo-200">
                {getAccessoryLabel(accessory)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Material Presets */}
      <div className="mb-6">
        <h3 className="block text-teal-300 text-sm font-medium mb-3">Material Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => {
              setColor('#33c9dc');
              setMetalness(0.9);
              setRoughness(0.1);
            }}
            className="px-3 py-2 bg-gradient-to-r from-teal-600/40 to-teal-500/40 hover:from-teal-600/60 hover:to-teal-500/60 rounded text-sm text-teal-100 border border-teal-500/20 transition-all shadow-md shadow-teal-500/5"
          >
            Chrome Teal
          </button>
          <button 
            onClick={() => {
              setColor('#f472b6');
              setMetalness(0.7);
              setRoughness(0.3);
            }}
            className="px-3 py-2 bg-gradient-to-r from-purple-600/40 to-purple-500/40 hover:from-purple-600/60 hover:to-purple-500/60 rounded text-sm text-purple-100 border border-purple-500/20 transition-all shadow-md shadow-purple-500/5"
          >
            Metallic Pink
          </button>
          <button 
            onClick={() => {
              setColor('#a78bfa');
              setMetalness(0.2);
              setRoughness(0.8);
            }}
            className="px-3 py-2 bg-gradient-to-r from-violet-600/40 to-violet-500/40 hover:from-violet-600/60 hover:to-violet-500/60 rounded text-sm text-violet-100 border border-violet-500/20 transition-all shadow-md shadow-violet-500/5"
          >
            Matte Violet
          </button>
          <button 
            onClick={() => {
              setColor('#fbbf24');
              setMetalness(0.5);
              setRoughness(0.5);
            }}
            className="px-3 py-2 bg-gradient-to-r from-amber-600/40 to-amber-500/40 hover:from-amber-600/60 hover:to-amber-500/60 rounded text-sm text-amber-100 border border-amber-500/20 transition-all shadow-md shadow-amber-500/5"
          >
            Satin Amber
          </button>
        </div>
      </div>
      
      <div className="text-xs text-indigo-300 mt-4 p-3 bg-indigo-900/50 rounded-md border border-teal-500/10">
        <h4 className="font-medium text-teal-300 mb-1">Pro Tip:</h4>
        <p>Try combining different materials and accessories to create unique product variations.</p>
      </div>
    </div>
  );
} 