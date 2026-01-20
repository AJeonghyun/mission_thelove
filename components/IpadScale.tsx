'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const DESIGN_WIDTH = 2360;
const DESIGN_HEIGHT = 1640;

export default function IpadScale({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const nextScale = Math.min(
        viewportWidth / DESIGN_WIDTH,
        viewportHeight / DESIGN_HEIGHT,
      );
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="flex h-screen w-screen items-start justify-center overflow-hidden">
      <div
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
