'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

export default function IpadScale({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const nextScale = Math.min(
        viewportWidth / CANVAS_WIDTH,
        viewportHeight / CANVAS_HEIGHT,
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
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
