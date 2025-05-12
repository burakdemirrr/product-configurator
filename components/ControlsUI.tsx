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
  
  // Initialize scale from URL parameter on component load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const scaleParam = url.searchParams.get('scale');
      if (scaleParam) {
        const scale = parseFloat(scaleParam);
        if (!isNaN(scale)) {
          console.log(`Initializing scale from URL: ${scale}`);
          setCurrentScale(scale);
        }
      }
    }
  }, []);
  
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
    const previousScale = url.searchParams.get('scale');
    url.searchParams.set('scale', currentScale.toString());
    window.history.replaceState({}, '', url.toString());
    
    // Always reload when scale changes, unless this is the initial load
    if (previousScale !== null && previousScale !== currentScale.toString()) {
      console.log(`Scale changed from ${previousScale} to ${currentScale}, reloading...`);
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
    <div className="w-full max-w-xs bg-[#1E1E1E] p-6 rounded-lg shadow-xl border border-[#2A2A2A] font-['Montserrat']">
      <h2 className="text-xl font-bold mb-6 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]">
        Customize Product
      </h2>
      
      {/* Model Scale Control */}
      <div className="mb-6 pb-4 border-b border-[#2A2A2A]">
        <h3 className="text-[#A78BFA] text-sm font-medium mb-3">Model Scale</h3>
        <div className="flex gap-2 flex-wrap">
          {SCALE_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => setCurrentScale(preset.value)}
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                currentScale === preset.value 
                  ? 'bg-[#7C3AED] text-white font-medium' 
                  : 'bg-[#252525] hover:bg-[#303030] text-gray-200 border border-[#2A2A2A]'
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
      <div className="mb-5 pb-4 border-b border-[#2A2A2A]">
        <label className="block text-[#A78BFA] text-sm font-medium mb-3" htmlFor="color">
          Color
        </label>
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-md overflow-hidden cursor-pointer border-2 border-[#2A2A2A] shadow-lg"
            style={{ backgroundColor: color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          ></div>
          <span className="ml-3 text-sm text-gray-300 font-mono">{color}</span>
        </div>
        
        {showColorPicker && (
          <div className="mt-3 relative">
            <div className="absolute z-10 bg-[#1E1E1E] rounded-md shadow-xl p-4 border border-[#2A2A2A]">
              <HexColorPicker color={color} onChange={setColor} />
              <div className="flex justify-between mt-3">
                <button
                  className="px-3 py-1.5 bg-[#252525] hover:bg-[#303030] text-gray-300 text-xs rounded border border-[#2A2A2A]"
                  onClick={() => setShowColorPicker(false)}
                >
                  Close
                </button>
                <button
                  className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs rounded font-medium"
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
        <label className="block text-[#A78BFA] text-sm font-medium mb-2" htmlFor="metalness">
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
          className="w-full h-1.5 bg-[#252525] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
        />
      </div>

      {/* Roughness Slider */}
      <div className="mb-5 pb-4 border-b border-[#2A2A2A]">
        <label className="block text-[#A78BFA] text-sm font-medium mb-2" htmlFor="roughness">
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
          className="w-full h-1.5 bg-[#252525] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
        />
      </div>
      
      {/* Accessories Toggles */}
      <div className="mb-6">
        <h3 className="block text-[#A78BFA] text-sm font-medium mb-3">Accessories</h3>
        <div className="space-y-2.5">
          {accessoryList.map((accessory) => (
            <div key={accessory} className="flex items-center">
              <input
                type="checkbox"
                id={accessory}
                checked={accessories[accessory] || false}
                onChange={() => toggleAccessory(accessory)}
                className="w-4 h-4 text-[#7C3AED] bg-[#252525] rounded focus:ring-[#A78BFA] focus:ring-offset-gray-900"
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
        <h3 className="block text-[#A78BFA] text-sm font-medium mb-3">Material Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => {
              setColor('#8B5CF6');
              setMetalness(0.9);
              setRoughness(0.1);
            }}
            className="px-3 py-2 bg-[#252525] hover:bg-[#303030] rounded text-sm text-gray-200 border border-[#2A2A2A] transition-all"
          >
            Chrome Violet
          </button>
          <button 
            onClick={() => {
              setColor('#EC4899');
              setMetalness(0.7);
              setRoughness(0.3);
            }}
            className="px-3 py-2 bg-[#252525] hover:bg-[#303030] rounded text-sm text-gray-200 border border-[#2A2A2A] transition-all"
          >
            Metallic Pink
          </button>
          <button 
            onClick={() => {
              setColor('#9333EA');
              setMetalness(0.2);
              setRoughness(0.8);
            }}
            className="px-3 py-2 bg-[#252525] hover:bg-[#303030] rounded text-sm text-gray-200 border border-[#2A2A2A] transition-all"
          >
            Matte Purple
          </button>
          <button 
            onClick={() => {
              setColor('#C084FC');
              setMetalness(0.5);
              setRoughness(0.5);
            }}
            className="px-3 py-2 bg-[#252525] hover:bg-[#303030] rounded text-sm text-gray-200 border border-[#2A2A2A] transition-all"
          >
            Satin Lavender
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4 p-3 bg-[#252525] rounded-md border border-[#2A2A2A]">
        <h4 className="font-medium text-[#A78BFA] mb-1">Pro Tip:</h4>
        <p>Try combining different materials and accessories to create unique product variations.</p>
      </div>
    </div>
  );
} 