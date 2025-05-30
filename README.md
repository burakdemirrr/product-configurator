# 3D Product Configurator

A modern, responsive 3D product configurator built with Next.js, React Three Fiber, and Zustand.

## Features

- Interactive 3D model display with orbit controls
- Real-time material customization (color, metalness, roughness)
- Responsive design for desktop and mobile
- Screenshot/snapshot capability
- Clean, modern UI with Tailwind CSS

## Tech Stack

- **Next.js** - React framework
- **React Three Fiber** - Three.js renderer for React
- **React Three Drei** - Useful helpers for React Three Fiber
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/3d-product-configurator.git
cd 3d-product-configurator
```

2. Install dependencies:
```bash
npm install
```

3. Add your 3D model:
   - Place your GLB/GLTF model file in `/public/models/` as `product.glb`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Using Your Own 3D Model

Place your GLB file in `/public/models/` directory and update the model path in `components/CanvasScene.tsx` if necessary.

### Changing Default Material Properties

Edit the initial state in `stores/useConfiguratorStore.ts` to change default color, metalness, or roughness.

### Adding Accessories

1. Ensure your model has separate meshes for accessories with names containing "accessory"
2. They will automatically be handled by the toggle functionality

## Extending

### Adding New Material Properties

1. Add the property to the Zustand store in `stores/useConfiguratorStore.ts`
2. Add the UI control in `components/ControlsUI.tsx`
3. Update the material in `components/ProductModel.tsx`

### Creating Presets

Create a set of predefined configurations in the store and add UI buttons to apply them.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)
- [Zustand](https://github.com/pmndrs/zustand)
- [NextJS](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
#   p r o d u c t - c o n f i g u r a t o r  
 