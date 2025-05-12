import { createPortal } from 'react-dom';
import { useThree } from '@react-three/fiber';
import { SnapshotButton } from './SnapshotButton';

export function SnapshotButtonContainer() {
  return (
    <div className="absolute bottom-6 right-6 z-10">
      <ThreeContextProvider>
        <SnapshotButton />
      </ThreeContextProvider>
    </div>
  );
}

function ThreeContextProvider({ children }: { children: React.ReactNode }) {
  const state = useThree();
  return createPortal(children, document.body);
} 