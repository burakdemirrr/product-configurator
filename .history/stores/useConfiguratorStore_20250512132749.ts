import { create } from 'zustand';

interface ConfiguratorState {
  color: string;
  metalness: number;
  roughness: number;
  // Optional: accessories toggles
  accessories: {
    [key: string]: boolean;
  };
  
  // Actions
  setColor: (color: string) => void;
  setMetalness: (value: number) => void;
  setRoughness: (value: number) => void;
  toggleAccessory: (accessory: string) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  color: '#2196f3', // Default blue
  metalness: 0.5,
  roughness: 0.5,
  accessories: {},
  
  // Actions
  setColor: (color) => set({ color }),
  setMetalness: (value) => set({ metalness: value }),
  setRoughness: (value) => set({ roughness: value }),
  toggleAccessory: (accessory) => set((state) => ({
    accessories: {
      ...state.accessories,
      [accessory]: !state.accessories[accessory]
    }
  })),
})); 