# HDRI Environment Maps

This directory is where you should place HDRI environment maps for the 3D product configurator.

## Required File Structure

If you want to use a custom HDRI instead of the built-in presets, you can place it here as:

```
studio.hdr
```

And then update the `<Environment>` component in `CanvasScene.tsx` to use the path:

```tsx
<Environment files="/hdri/studio.hdr" />
```

Instead of the preset:

```tsx
<Environment preset="studio" />
```

## HDRI Requirements

- Format: HDR or EXR
- Resolution: 2K to 4K recommended
- Properly equirectangular mapping
- Well-balanced lighting for product visualization

## Where to Get HDRI Maps

- Poly Haven: https://polyhaven.com/hdris
- HDRI Haven (legacy site)
- HDR Maps: https://hdrmaps.com
- Adobe Stock

## Default Configuration

By default, the configurator uses the built-in "studio" preset from @react-three/drei, 
which provides good neutral lighting for product visualization without requiring any external files. 