'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';
import type Konva from 'konva';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const CAPTURE_STORAGE_KEY = 'photobooth-captures';
const STAGE_WIDTH = 1024;
const STAGE_HEIGHT = 768;
const SLOT_COUNT = 1;

const puzzleTitle = '사랑의 증거';
const question = '촬영된 사진 중 한 장을 선택하면 가로 프레임으로 합성됩니다.';

const PhotoFrameStage = dynamic(
  () => import('@/components/photobooth/PhotoFrameStage'),
  { ssr: false },
);

function Stage10ComposeScreen() {
  const router = useRouter();
  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = sessionStorage.getItem(CAPTURE_STORAGE_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as string[];
      setCaptures(parsed);
      sessionStorage.removeItem(CAPTURE_STORAGE_KEY);
    } catch (err) {
      setError('사진 데이터를 불러오지 못했습니다.');
      sessionStorage.removeItem(CAPTURE_STORAGE_KEY);
    }
  }, []);

  const slotLayout = useMemo(() => {
    const frameWidth = 900;
    const frameHeight = 480;
    const frameX = (STAGE_WIDTH - frameWidth) / 2;
    const frameY = (STAGE_HEIGHT - frameHeight) / 2;
    const gap = 12;
    const slotHeight = frameHeight;
    return {
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      gap,
      slotWidth: frameWidth,
      slotHeight,
    };
  }, []);

  const toggleSelect = (src: string) => {
    setSelected((prev) => (prev[0] === src ? [] : [src]));
  };

  const handleSave = async () => {
    if (!stageWrapRef.current) return;
    try {
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      const dataUrl =
        stageRef.current?.toDataURL({ pixelRatio: 2 }) ??
        (await toPng(stageWrapRef.current, {
          cacheBust: true,
          pixelRatio: 2,
        }));
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const fileName = 'fourcut.png';
      const file = new File([blob], fileName, { type: 'image/png' });
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes('Mac') &&
          navigator.maxTouchPoints > 1);

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'fourcut' });
        return;
      }

      if (isIOS) {
        const objectUrl = URL.createObjectURL(blob);
        const nextWindow = window.open(objectUrl, '_blank');
        if (!nextWindow) {
          window.location.href = objectUrl;
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
        return;
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    } catch (err) {
      setError('이미지 저장에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4 text-white">
        <div className="text-sm text-zinc-200">사진 선택</div>
        <div className="mt-1 text-xs text-zinc-400">
          한 장만 선택할 수 있습니다.
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-zinc-400">테마</span>
          {(['light', 'dark'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`rounded-full px-3 py-1 text-xs ${
                theme === value
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-zinc-200'
              }`}
              onClick={() => setTheme(value)}
            >
              {value === 'light' ? '화이트' : '블랙'}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {captures.map((src, index) => {
            const isSelected = selected[0] === src;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => toggleSelect(src)}
                className={`relative overflow-hidden rounded-2xl border ${
                  isSelected ? 'border-emerald-300' : 'border-zinc-800'
                }`}
              >
                <img
                  src={src}
                  alt={`capture-${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {isSelected ? (
                  <span className="absolute left-2 top-2 rounded-full bg-emerald-300 px-2 py-1 text-xs font-semibold text-black">
                    선택됨
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4 text-white">
        <div className="text-sm text-zinc-200">합성 미리보기</div>
        <div className="mt-1 text-xs text-zinc-400">
          선택한 사진이 가로 프레임에 합성됩니다.
        </div>
        <div className="mt-4 flex max-h-[70vh] min-h-[360px] items-center justify-center overflow-auto">
          <div
            ref={stageWrapRef}
            className="origin-top-left"
            style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
          >
            <PhotoFrameStage
              stageWidth={STAGE_WIDTH}
              stageHeight={STAGE_HEIGHT}
              slotCount={SLOT_COUNT}
              photos={selected}
              slotLayout={slotLayout}
              theme={theme}
              stageRef={stageRef}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            className="rounded-full bg-white px-8 text-black hover:bg-white/90"
            onClick={handleSave}
            disabled={selected.length !== SLOT_COUNT}
          >
            저장하기
          </Button>
        </div>
        {error ? (
          <div className="mt-3 text-center text-xs text-rose-300">{error}</div>
        ) : null}
      </div>
    </div>
  );
}

const stage10_1: StageEntry = {
  id: 'stage-10-1',
  title: 'Stage 10-1',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: () => <Stage10ComposeScreen />,
};

export default stage10_1;
