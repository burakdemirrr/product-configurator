import { create } from 'zustand';

interface ConfiguratorState {
  // Material properties
  color: string;
  metalness: number;
  roughness: number;
  
  // Optional: accessories toggles
  accessories: {
    [key: string]: boolean;
  };
  
  // Environment settings
  backgroundVisible: boolean;
  environmentIntensity: number;
  
  // Lighting settings
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  
  // Shadow settings
  shadowOpacity: number;
  shadowBlur: number;
  
  // Actions
  setColor: (color: string) => void;
  setMetalness: (value: number) => void;
  setRoughness: (value: number) => void;
  toggleAccessory: (accessory: string) => void;
  
  // Environment actions
  setBackgroundVisible: (visible: boolean) => void;
  setEnvironmentIntensity: (value: number) => void;
  
  // Lighting actions
  setAmbientLightIntensity: (value: number) => void;
  setDirectionalLightIntensity: (value: number) => void;
  
  // Shadow actions
  setShadowOpacity: (value: number) => void;
  setShadowBlur: (value: number) => void;
  
  // Apply preset configuration
  applyPreset: (preset: Partial<ConfiguratorState>) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  // Material properties 
  color: '#2196f3', // Default blue
  metalness: 0.5,
  roughness: 0.5,
  
  // Accessories
  accessories: {},
  
  // Environment settings
  backgroundVisible: true,
  environmentIntensity: 1.0, 
  
  // Lighting settings
  ambientLightIntensity: 0.5,
  directionalLightIntensity: 0.8,
  
  // Shadow settings
  shadowOpacity: 0.6,
  shadowBlur: 2,
  
  // Material actions
  setColor: (color) => set({ color }),
  setMetalness: (value) => set({ metalness: value }),
  setRoughness: (value) => set({ roughness: value }),
  toggleAccessory: (accessory) => set((state) => ({
    accessories: {
      ...state.accessories,
      [accessory]: !state.accessories[accessory]
    }
  })),
  
  // Environment actions
  setBackgroundVisible: (visible) => set({ backgroundVisible: visible }),
  setEnvironmentIntensity: (value) => set({ environmentIntensity: value }),
  
  // Lighting actions
  setAmbientLightIntensity: (value) => set({ ambientLightIntensity: value }),
  setDirectionalLightIntensity: (value) => set({ directionalLightIntensity: value }),
  
  // Shadow actions
  setShadowOpacity: (value) => set({ shadowOpacity: value }),
  setShadowBlur: (value) => set({ shadowBlur: value }),
  
  // Apply preset - allows setting multiple properties at once
  applyPreset: (preset) => set((state) => ({
    ...state,
    ...preset
  }))
})); 