'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const BASE_WIDTH_PX = 2360;
const BASE_HEIGHT_PX = 1640;

export default function IpadScale({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  const [designSize, setDesignSize] = useState({
    width: BASE_WIDTH_PX,
    height: BASE_HEIGHT_PX,
  });

  useEffect(() => {
    const updateScale = () => {
      const dpr = window.devicePixelRatio || 1;
      const designWidth = BASE_WIDTH_PX / dpr;
      const designHeight = BASE_HEIGHT_PX / dpr;
      setDesignSize({ width: designWidth, height: designHeight });
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const nextScale = Math.min(
        viewportWidth / designWidth,
        viewportHeight / designHeight,
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
          width: designSize.width,
          height: designSize.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
