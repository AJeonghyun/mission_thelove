'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const CAPTURE_COUNT = 4;

const puzzleTitle = '사랑의 증거';
const question = '카메라로 4장의 사진을 촬영하세요.';

type CountdownValue = number | 'SNAP' | null;

function Stage10Screen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<CountdownValue>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isActive = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (error) {
            // Ignore play aborts during navigation/unmount.
          }
        }
      } catch (error) {
        setStreamError('카메라 접근에 실패했습니다.');
      }
    };

    startCamera();
    return () => {
      isActive = false;
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const runCountdown = async () => {
    for (let tick = 10; tick >= 1; tick -= 1) {
      setCountdown(tick);
      await sleep(1000);
    }
    setCountdown('SNAP');
    await sleep(350);
    setCountdown(null);
  };

  const triggerFlash = async () => {
    setFlashOn(true);
    await sleep(120);
    setFlashOn(false);
  };

  const startCapture = async () => {
    if (isCapturing) return;
    setStreamError(null);
    setIsCapturing(true);
    setPhotos([]);
    if (videoRef.current?.paused) {
      try {
        await videoRef.current.play();
      } catch (error) {
        // Ignore play aborts caused by stream/DOM changes.
      }
    }
    const nextPhotos: string[] = [];
    for (let i = 0; i < CAPTURE_COUNT; i += 1) {
      await runCountdown();
      const shot = captureFrame();
      if (shot) {
        nextPhotos.push(shot);
        setPhotos([...nextPhotos]);
        await triggerFlash();
      }
      await sleep(300);
    }
    setIsCapturing(false);
    sessionStorage.setItem('photobooth-captures', JSON.stringify(nextPhotos));
    if (canAdvanceStage) {
      onNextStage();
    }
  };

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          <p className="text-sm text-zinc-200 sm:text-base">{question}</p>
        </CardContent>
      </Card>

      <div className="relative flex h-[70vh] min-h-[260px] max-h-[520px] flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-black/70 p-4">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
          />
          <AnimatePresence>
            {countdown ? (
              <motion.div
                key={countdown}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-7xl font-bold text-white"
              >
                {countdown}
              </motion.div>
            ) : null}
          </AnimatePresence>
          {flashOn ? (
            <div className="pointer-events-none absolute inset-0 bg-white/90" />
          ) : null}
        </div>
        {streamError ? (
          <div className="mt-3 text-center text-xs text-rose-300">
            {streamError}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-400">촬영 수: {CAPTURE_COUNT}컷</div>
        <Button
          className="rounded-full bg-white px-8 text-black hover:bg-white/90"
          onClick={startCapture}
          disabled={isCapturing}
        >
          {isCapturing ? '촬영 중...' : '촬영 시작'}
        </Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}

const stage10: StageEntry = {
  id: 'stage-10',
  title: 'Stage 10',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage10Screen
      onNextStage={onNextStage}
      canAdvanceStage={canAdvanceStage}
    />
  ),
};

export default stage10;
