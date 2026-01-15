'use client';

import Image from 'next/image';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
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
  questionExtra?: ReactNode;
  puzzleImage?: string;
  inputMode?: 'drawer' | 'qr' | 'coord' | 'bingo';
  bingoBoard?: string[][];
  bingoAnswer?: string[];
  bingoFinalQuestion?: string;
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
  questionExtra,
  puzzleImage,
  inputMode = 'drawer',
  bingoBoard,
  bingoAnswer = [],
  bingoFinalQuestion,
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
  const [bingoProgress, setBingoProgress] = useState(0);
  const [wrongBingoIndex, setWrongBingoIndex] = useState<number | null>(null);
  const [correctBingoIndex, setCorrectBingoIndex] = useState<number | null>(
    null
  );
  const [bingoAltChoice, setBingoAltChoice] = useState<'쓴' | '안 쓴' | null>(
    null
  );
  const [bingoAlertOpen, setBingoAlertOpen] = useState(false);
  const [bingoFinalUnlocked, setBingoFinalUnlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const onAnswerChangeRef = useRef(onAnswerChange);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBingoFinal = inputMode === 'bingo' && bingoFinalUnlocked;
  const displayQuestion =
    isBingoFinal && bingoFinalQuestion ? bingoFinalQuestion : question;

  useEffect(() => {
    onAnswerChangeRef.current = onAnswerChange;
  }, [onAnswerChange]);

  useEffect(() => {
    if (inputMode !== 'bingo') return;
    setBingoProgress(0);
    setWrongBingoIndex(null);
    setCorrectBingoIndex(null);
    setBingoAlertOpen(false);
    setBingoFinalUnlocked(false);
    setBingoAltChoice(null);
  }, [inputMode, bingoAnswer.join('|')]);

  useEffect(() => {
    if (!bingoAnswer.length || bingoFinalUnlocked) return;
    if (bingoProgress === bingoAnswer.length) {
      setBingoAlertOpen(true);
    }
  }, [bingoAnswer.length, bingoFinalUnlocked, bingoProgress]);

  useEffect(() => {
    if (isBingoFinal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isBingoFinal]);

  useEffect(() => {
    return () => {
      if (wrongTimeoutRef.current) {
        clearTimeout(wrongTimeoutRef.current);
      }
      if (correctTimeoutRef.current) {
        clearTimeout(correctTimeoutRef.current);
      }
    };
  }, []);

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
        window.location.assign(value);
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
            {displayQuestion}
          </p>
          {questionExtra && <div className="mt-5">{questionExtra}</div>}
          {inputMode === 'qr' && (
            <div className="mt-6 flex">
              <Button
                variant="outline"
                className="rounded-full border-white text-black hover:bg-white/10"
                type="button"
                onClick={() => setShowScanner((prev) => !prev)}
              >
                {showScanner ? '카메라 닫기' : '카메라 열기'}
              </Button>
            </div>
          )}
          {puzzleImage && (
            <div className="relative mt-5 w-full overflow-hidden rounded-2xl aspect-[16/9] max-h-[42vh]">
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
              <DrawerFooter className="flex-row justify-center gap-3">
                <Button
                  className="w-auto px-10 bg-white text-black hover:bg-white/90"
                  onClick={handleSubmit}
                >
                  제출
                </Button>
                <Button
                  variant="outline"
                  className="w-auto px-10 border-black bg-black text-white hover:bg-white/10"
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
                <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                  <video
                    ref={videoRef}
                    className="h-140 w-full object-cover"
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
        {inputMode === 'coord' && (
          <div className="w-full">
            <div className="mt-4 flex items-center justify-center gap-3 text-3xl text-white">
              <Input
                value={answer[0] ?? ''}
                onChange={(event) =>
                  onAnswerChange(0, event.target.value.slice(-1))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="?"
              />
              <Input
                value={answer[1] ?? ''}
                onChange={(event) =>
                  onAnswerChange(1, event.target.value.slice(-1))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="?"
              />
              <Input
                value={answer[2] ?? ''}
                onChange={(event) =>
                  onAnswerChange(2, event.target.value.slice(-1))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="?"
              />
              <Input
                value={answer[3] ?? ''}
                onChange={(event) =>
                  onAnswerChange(3, event.target.value.slice(-1))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="?"
              />
              <span className="w-4" aria-hidden />
              <Input
                value={answer[4] ?? ''}
                onChange={(event) =>
                  onAnswerChange(4, event.target.value.slice(-1))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="?"
              />
              <span>:</span>
              <Input
                value={answer[5] ?? ''}
                onChange={(event) =>
                  onAnswerChange(5, event.target.value.slice(-1))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="?"
              />
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
        {inputMode === 'bingo' && (
          <div className="w-full">
            {isBingoFinal ? (
              <div className="mt-6 flex w-full flex-col items-center gap-4">
                <Input
                  value={answer[0] ?? ''}
                  onChange={(event) => onAnswerChange(0, event.target.value)}
                  className="h-12 rounded-2xl border-zinc-700 bg-zinc-950 px-4 text-center text-base text-white sm:text-lg"
                  placeholder="말씀 구절을 입력하세요"
                />
                <div className="flex justify-center gap-3">
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
            ) : (
              <>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {(bingoBoard ?? []).flat().map((cell, index) => {
                    const isWrong = wrongBingoIndex === index;
                    const isDone = bingoProgress >= bingoAnswer.length;
                    return (
                      <button
                        key={`bingo-${index}`}
                        type="button"
                        onClick={() => {
                          if (isDone || !bingoAnswer.length) return;
                          const expected =
                            bingoProgress === 1
                              ? ['안 쓴', '쓴']
                              : bingoProgress === 4
                              ? [
                                  bingoAltChoice === '안 쓴'
                                    ? '쓴'
                                    : bingoAltChoice === '쓴'
                                    ? '안 쓴'
                                    : '쓴',
                                ]
                              : [bingoAnswer[bingoProgress]];
                          if (expected.includes(cell)) {
                            setBingoProgress((prev) => prev + 1);
                            setCorrectBingoIndex(index);
                            if (bingoProgress === 1) {
                              if (cell === '쓴' || cell === '안 쓴') {
                                setBingoAltChoice(cell);
                              }
                            }
                            if (correctTimeoutRef.current) {
                              clearTimeout(correctTimeoutRef.current);
                            }
                            correctTimeoutRef.current = setTimeout(
                              () => setCorrectBingoIndex(null),
                              500
                            );
                            return;
                          }
                          setWrongBingoIndex(index);
                          if (wrongTimeoutRef.current) {
                            clearTimeout(wrongTimeoutRef.current);
                          }
                          wrongTimeoutRef.current = setTimeout(
                            () => setWrongBingoIndex(null),
                            500
                          );
                        }}
                        className={`flex h-14 items-center justify-center rounded-xl border text-center text-sm text-white transition sm:h-18 sm:text-base ${
                          isWrong
                            ? 'border-rose-500 bg-rose-500/60'
                            : correctBingoIndex === index
                            ? 'border-sky-400 bg-sky-500/60'
                            : 'border-zinc-800 bg-zinc-950'
                        }`}
                      >
                        {cell}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xl text-white">
                  {bingoAnswer.map((word, index) => (
                    <span
                      key={`bingo-answer-${index}`}
                      className={`min-w-[6rem] rounded-2xl border border-zinc-700 px-5 py-3 text-center ${
                        index < bingoProgress
                          ? 'bg-white text-black'
                          : 'bg-zinc-950 text-white'
                      }`}
                    >
                      {index < bingoProgress ? word : '•'}
                    </span>
                  ))}
                </div>
              </>
            )}
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
      <AlertDialog open={bingoAlertOpen} onOpenChange={setBingoAlertOpen}>
        <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>문장대로 행동하세요.</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction
              className="bg-white text-black hover:bg-white/90"
              onClick={() => {
                setBingoAlertOpen(false);
                setBingoFinalUnlocked(true);
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
