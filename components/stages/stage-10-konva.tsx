'use client';

import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';

type SlotLayout = {
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  gap: number;
  slotWidth: number;
  slotHeight: number;
};

type Stage10KonvaProps = {
  stageWidth: number;
  stageHeight: number;
  slotCount: number;
  photos: string[];
  slotLayout: SlotLayout;
};

const useKonvaImage = (src: string | null) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }
    const nextImage = new Image();
    nextImage.src = src;
    nextImage.onload = () => setImage(nextImage);
  }, [src]);

  return image;
};

const getContainPlacement = (
  image: HTMLImageElement,
  width: number,
  height: number,
) => {
  const imageRatio = image.width / image.height;
  const targetRatio = width / height;
  if (imageRatio > targetRatio) {
    const drawHeight = width / imageRatio;
    return {
      drawWidth: width,
      drawHeight,
      offsetX: 0,
      offsetY: (height - drawHeight) / 2,
    };
  }
  const drawWidth = height * imageRatio;
  return {
    drawWidth,
    drawHeight: height,
    offsetX: (width - drawWidth) / 2,
    offsetY: 0,
  };
};

export default function Stage10Konva({
  stageWidth,
  stageHeight,
  slotCount,
  photos,
  slotLayout,
}: Stage10KonvaProps) {
  const slotImages = [
    useKonvaImage(photos[0] ?? null),
    useKonvaImage(photos[1] ?? null),
    useKonvaImage(photos[2] ?? null),
    useKonvaImage(photos[3] ?? null),
  ];

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={stageWidth}
          height={stageHeight}
          fill="#0b0b0f"
        />
        <Rect
          x={slotLayout.frameX}
          y={slotLayout.frameY}
          width={slotLayout.frameWidth}
          height={slotLayout.frameHeight}
          fill="#111827"
          stroke="#f8fafc"
          strokeWidth={6}
          cornerRadius={24}
        />
        {Array.from({ length: slotCount }).map((_, index) => {
          const slotX = slotLayout.frameX;
          const slotY =
            slotLayout.frameY +
            index * (slotLayout.slotHeight + slotLayout.gap);
          return (
            <Rect
              key={`slot-border-${index}`}
              x={slotX}
              y={slotY}
              width={slotLayout.slotWidth}
              height={slotLayout.slotHeight}
              stroke="#facc15"
              strokeWidth={3}
              cornerRadius={18}
            />
          );
        })}
        {slotImages.map((image, index) => {
          if (!image) return null;
          const slotX = slotLayout.frameX;
          const slotY =
            slotLayout.frameY +
            index * (slotLayout.slotHeight + slotLayout.gap);
          const placement = getContainPlacement(
            image,
            slotLayout.slotWidth,
            slotLayout.slotHeight,
          );
          return (
            <KonvaImage
              key={`slot-image-${index}`}
              image={image}
              x={slotX + placement.offsetX}
              y={slotY + placement.offsetY}
              width={placement.drawWidth}
              height={placement.drawHeight}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}
