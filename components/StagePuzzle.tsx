'use client';

import Image from 'next/image';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';

type StagePuzzleProps = {
  title: string;
  question: string;
  puzzleImage?: string;
  inputMode?: 'drawer' | 'qr';
  answer: string[];
  status: 'idle' | 'wrong' | 'cleared';
  onAnswerChange: (index: number, value: string) => void;
  onSubmit: () => 'correct' | 'wrong' | null;
  onReset: () => void;
  onNextStage: () => void;
  canAdvanceStage: boolean;
};

export default function StagePuzzle({
  title,
  question,
  puzzleImage,
  inputMode = 'drawer',
  answer,
  status,
  onAnswerChange,
  onSubmit,
  onReset,
  onNextStage,
  canAdvanceStage,
}: StagePuzzleProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [shouldAdvance, setShouldAdvance] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const onAnswerChangeRef = useRef(onAnswerChange);

  useEffect(() => {
    onAnswerChangeRef.current = onAnswerChange;
  }, [onAnswerChange]);

  const handleSubmit = () => {
    const result = onSubmit();
    if (!result) return;
    setAlertMessage(result === 'correct' ? '정답입니다' : '오답입니다');
    if (result === 'correct') {
      setIsDrawerOpen(false);
      setShouldAdvance(true);
      setShouldReset(false);
      return;
    }
    setShouldAdvance(false);
    setShouldReset(true);
  };

  useEffect(() => {
    if (inputMode !== 'qr') return;

    if (!showScanner) {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      return;
    }

    if (!videoRef.current || scannerRef.current) return;

    QrScanner.WORKER_PATH = new URL(
      'qr-scanner/qr-scanner-worker.min.js',
      import.meta.url
    ).toString();

    setScanError(null);
    let hasNavigated = false;
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!result?.data || hasNavigated) return;
        const value = result.data.toString();
        hasNavigated = true;
        scanner.stop();
        window.open(value, '_blank', 'noopener,noreferrer');
      },
      {
        returnDetailedScanResult: true,
        preferredCamera: 'environment',
      }
    );
    scannerRef.current = scanner;

    scanner.start().catch(() => setScanError('카메라 권한을 확인해 주세요.'));
  }, [answer.length, inputMode, showScanner]);

  useEffect(() => {
    if (!showScanner) {
      setScanError(null);
    }
  }, [showScanner]);

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          <p className="whitespace-pre-line text-base text-zinc-200 sm:text-lg">
            {question}
          </p>
          {inputMode === 'qr' && (
            <div className="mt-6 flex">
              <Button
                variant="outline"
                className="rounded-full border-white text-black hover:bg-white/10"
                type="button"
                onClick={() => setShowScanner((prev) => !prev)}
              >
                {showScanner ? '카메라 닫기' : 'QR Code Scanner'}
              </Button>
            </div>
          )}
          {puzzleImage && (
            <div className="relative mt-5 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black aspect-[16/9] max-h-[42vh]">
              <Image
                src={puzzleImage}
                alt={`${title} puzzle`}
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                quality={95}
                className="object-contain"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {inputMode === 'drawer' && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="rounded-full bg-white text-black hover:bg-white/90">
                정답 입력
              </Button>
            </DrawerTrigger>
            <DrawerContent className="border-zinc-800 bg-zinc-950 text-white data-[vaul-drawer-direction=bottom]:bottom-[20vh] data-[state=closed]:translate-y-full data-[state=open]:translate-y-0">
              <DrawerHeader>
                <DrawerTitle>정답 입력</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <div className="mt-4 flex justify-center gap-4">
                  {answer.map((value, index) => (
                    <Input
                      key={`drawer-answer-${index}`}
                      value={value}
                      onChange={(event) =>
                        onAnswerChange(index, event.target.value.slice(-1))
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSubmit();
                      }}
                      maxLength={1}
                      className="h-20 w-20 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                      placeholder="?"
                    />
                  ))}
                </div>
              </div>
              <DrawerFooter>
                <Button
                  className="bg-white text-black hover:bg-white/90"
                  onClick={handleSubmit}
                >
                  제출
                </Button>
                <Button
                  variant="outline"
                  className="border-black bg-black text-white hover:bg-white/10"
                  onClick={onReset}
                >
                  초기화
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
        {inputMode === 'qr' && (
          <div className="w-full">
            {showScanner && (
              <div className="mt-2 flex w-full justify-center">
                <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                  <video
                    ref={videoRef}
                    className="h-64 w-full object-cover"
                    muted
                    playsInline
                  />
                </div>
              </div>
            )}
            {scanError && (
              <p className="mt-3 text-center text-sm text-rose-400">
                {scanError}
              </p>
            )}
            <div className="mt-4 flex items-center justify-center gap-3 text-3xl text-white">
              <span>[</span>
              <Input
                value={answer[0] ?? ''}
                onChange={(event) =>
                  onAnswerChange(
                    0,
                    event.target.value.replace(/\D/g, '').slice(-1)
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                inputMode="numeric"
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="0"
              />
              <Input
                value={answer[1] ?? ''}
                onChange={(event) =>
                  onAnswerChange(
                    1,
                    event.target.value.replace(/\D/g, '').slice(-1)
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                inputMode="numeric"
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="0"
              />
              <span>,</span>
              <Input
                value={answer[2] ?? ''}
                onChange={(event) =>
                  onAnswerChange(
                    2,
                    event.target.value.replace(/\D/g, '').slice(-1)
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                inputMode="numeric"
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="0"
              />
              <span>,</span>
              <Input
                value={answer[3] ?? ''}
                onChange={(event) =>
                  onAnswerChange(
                    3,
                    event.target.value.replace(/\D/g, '').slice(-1)
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                inputMode="numeric"
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="0"
              />
              <span>]</span>
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <Button
                className="bg-white text-black hover:bg-white/90"
                onClick={handleSubmit}
              >
                제출
              </Button>
              <Button
                variant="outline"
                className="border-black bg-black text-white hover:bg-white/10"
                onClick={onReset}
              >
                초기화
              </Button>
            </div>
          </div>
        )}
      </div>
      <AlertDialog
        open={alertMessage !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAlertMessage(null);
            setShouldAdvance(false);
            setShouldReset(false);
          }
        }}
      >
        <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction
              className="bg-white text-black hover:bg-white/90"
              onClick={() => {
                if (shouldAdvance && canAdvanceStage) onNextStage();
                if (shouldReset) {
                  setIsDrawerOpen(false);
                  onReset();
                }
              }}
            >
              확인
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
