'use client';

import Image from 'next/image';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
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
  qrAnswers?: string[];
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
  qrAnswers,
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
  const [qrEntry, setQrEntry] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [bingoProgress, setBingoProgress] = useState(0);
  const [wrongBingoIndex, setWrongBingoIndex] = useState<number | null>(null);
  const [correctBingoIndex, setCorrectBingoIndex] = useState<number | null>(
    null,
  );
  const [bingoAltChoice, setBingoAltChoice] = useState<'쓴' | '안 쓴' | null>(
    null,
  );
  const [bingoAlertOpen, setBingoAlertOpen] = useState(false);
  const [bingoFinalUnlocked, setBingoFinalUnlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const alertDialogRef = useRef<HTMLDialogElement | null>(null);
  const bingoDialogRef = useRef<HTMLDialogElement | null>(null);
  const qrPreviewDialogRef = useRef<HTMLDialogElement | null>(null);
  const showScannerRef = useRef(showScanner);
  const onAnswerChangeRef = useRef(onAnswerChange);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qrScanLockedRef = useRef(false);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);
  const [qrPreviewOpen, setQrPreviewOpen] = useState(false);
  const [qrPreviewKind, setQrPreviewKind] = useState<
    'loading' | 'image' | 'iframe' | 'unknown'
  >('unknown');
  const qrResolveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const qrResolveIdRef = useRef(0);
  const isBingoFinal = inputMode === 'bingo' && bingoFinalUnlocked;
  const displayQuestion =
    isBingoFinal && bingoFinalQuestion ? bingoFinalQuestion : question;
  const normalizedQrAnswers = (qrAnswers ?? []).map((value) =>
    value.trim().toLowerCase(),
  );
  const qrMatchedCount = normalizedQrAnswers.reduce((count, value, index) => {
    const current = (answer[index] ?? '').trim().toLowerCase();
    return count + (current === value ? 1 : 0);
  }, 0);

  useEffect(() => {
    onAnswerChangeRef.current = onAnswerChange;
  }, [onAnswerChange]);

  useEffect(() => {
    showScannerRef.current = showScanner;
  }, [showScanner]);

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
    if (inputMode === 'qr' && normalizedQrAnswers.length) {
      const normalizedEntry = qrEntry.trim().toLowerCase();
      if (!normalizedEntry) return;
      const matchIndex = normalizedQrAnswers.indexOf(normalizedEntry);
      if (matchIndex === -1) {
        setAlertMessage('오답입니다');
        setShouldAdvance(false);
        setShouldReset(false);
        setQrEntry('');
        return;
      }
      const alreadyMatched =
        (answer[matchIndex] ?? '').trim().toLowerCase() === normalizedEntry;
      if (alreadyMatched) {
        setAlertMessage('이미 입력한 값입니다');
        setShouldAdvance(false);
        setShouldReset(false);
        return;
      }
      onAnswerChange(matchIndex, qrAnswers?.[matchIndex] ?? normalizedEntry);
      setQrEntry('');
      if (qrMatchedCount + 1 === normalizedQrAnswers.length) {
        setAlertMessage('정답입니다');
        setShouldAdvance(true);
        setShouldReset(false);
        return;
      }
      setAlertMessage('정답입니다');
      setShouldAdvance(false);
      setShouldReset(false);
      return;
    }
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
      import.meta.url,
    ).toString();

    setScanError(null);
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!result?.data || qrScanLockedRef.current) return;
        const value = result.data.toString();
        qrScanLockedRef.current = true;
        scanner.stop();
        void resolveQrPreview(value);
      },
      {
        returnDetailedScanResult: true,
        preferredCamera: 'environment',
      },
    );
    scannerRef.current = scanner;

    scanner.start().catch(() => setScanError('카메라 권한을 확인해 주세요.'));
  }, [answer.length, inputMode, showScanner]);

  useEffect(() => {
    if (inputMode !== 'qr') return;
    const resumeScanner = () => {
      if (!showScannerRef.current || !scannerRef.current) return;
      setScanError(null);
      scannerRef.current
        .start()
        .catch(() => setScanError('카메라 권한을 확인해 주세요.'));
    };
    const handlePageShow = () => {
      resumeScanner();
    };
    const handleVisibilityChange = () => {
      if (!scannerRef.current) return;
      if (document.visibilityState === 'visible') {
        resumeScanner();
      } else {
        scannerRef.current.stop();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [inputMode]);

  useEffect(() => {
    if (!showScanner) {
      setScanError(null);
    }
  }, [showScanner]);

  useEffect(() => {
    return () => {
      if (qrResolveTimeoutRef.current) {
        clearTimeout(qrResolveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const dialog = qrPreviewDialogRef.current;
    if (!dialog) return;
    if (qrPreviewOpen && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!qrPreviewOpen && dialog.open) {
      dialog.close();
    }
  }, [qrPreviewOpen]);

  const isQrImageUrl = (value: string) =>
    value.startsWith('data:image/') ||
    /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(value);
  const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

  const resolveQrPreview = async (value: string) => {
    const resolveId = (qrResolveIdRef.current += 1);
    setQrPreviewUrl(value);
    setQrPreviewOpen(true);

    if (qrResolveTimeoutRef.current) {
      clearTimeout(qrResolveTimeoutRef.current);
      qrResolveTimeoutRef.current = null;
    }

    if (isQrImageUrl(value)) {
      setQrPreviewKind('image');
      return;
    }

    if (!isHttpUrl(value)) {
      setQrPreviewKind('unknown');
      return;
    }

    setQrPreviewKind('loading');
    if (typeof window === 'undefined') {
      setQrPreviewKind('iframe');
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    qrResolveTimeoutRef.current = timeoutId;

    try {
      const response = await fetch(
        `/api/qr-preview?url=${encodeURIComponent(value)}`,
        { signal: controller.signal },
      );
      if (qrResolveIdRef.current !== resolveId) return;

      if (!response.ok) {
        setQrPreviewKind('iframe');
        return;
      }
      const data = (await response.json()) as {
        type: 'image' | 'iframe' | 'unknown';
        url?: string;
      };
      if (data.type === 'image' && data.url) {
        setQrPreviewUrl(data.url);
        setQrPreviewKind('image');
        return;
      }
      if (data.type === 'iframe' && data.url) {
        setQrPreviewUrl(data.url);
        setQrPreviewKind('iframe');
        return;
      }
    } catch (error) {
      // Ignore fetch failures and fall back to iframe.
    } finally {
      if (qrResolveTimeoutRef.current) {
        clearTimeout(qrResolveTimeoutRef.current);
        qrResolveTimeoutRef.current = null;
      }
    }

    if (qrResolveIdRef.current === resolveId) {
      setQrPreviewKind('iframe');
    }
  };

  useEffect(() => {
    const dialog = alertDialogRef.current;
    if (!dialog) return;
    if (alertMessage !== null && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (alertMessage === null && dialog.open) {
      dialog.close();
    }
  }, [alertMessage]);

  useEffect(() => {
    const dialog = bingoDialogRef.current;
    if (!dialog) return;
    if (bingoAlertOpen && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!bingoAlertOpen && dialog.open) {
      dialog.close();
    }
  }, [bingoAlertOpen]);

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          {displayQuestion ? (
            <p className="whitespace-pre-line text-base text-zinc-200 sm:text-lg">
              {displayQuestion}
            </p>
          ) : null}
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

      <div className="flex flex-wrap items-center justify-center gap-4 mb-6 mt-5">
        {inputMode === 'drawer' && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button type="button" className="nes-btn is-primary">
                정답 입력
              </button>
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
                      className="h-20 w-20 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-4xl text-white font-[var(--font-geist-sans)] tracking-wide"
                      placeholder="?"
                    />
                  ))}
                </div>
              </div>
              <DrawerFooter className="flex-row justify-center gap-3 ">
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
            <div className="mt-4 flex flex-col items-center justify-center gap-4 text-white">
              <div
                key={qrMatchedCount}
                className={`text-2xl transition-colors ${
                  qrMatchedCount > 0
                    ? 'text-emerald-300 animate-pulse'
                    : 'text-zinc-300'
                }`}
              >
                {qrMatchedCount}/{normalizedQrAnswers.length}
              </div>
              <Input
                value={qrEntry}
                onChange={(event) =>
                  setQrEntry(
                    event.target.value.replace(/[^0-9,]/g, '').slice(0, 12),
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                inputMode="text"
                className="h-20 w-56 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-white font-[var(--font-geist-sans)] leading-none !text-2xl  sm:h-16 sm:w-56"
                placeholder="1,2,3"
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
                onClick={() => {
                  setQrEntry('');
                }}
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
              <Input
                value={answer[6] ?? ''}
                onChange={(event) =>
                  onAnswerChange(6, event.target.value.slice(-1))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                maxLength={1}
                className="h-20 w-16 rounded-2xl border-zinc-700 bg-zinc-950 text-center text-3xl text-white"
                placeholder="?"
              />
              <Input
                value={answer[7] ?? ''}
                onChange={(event) =>
                  onAnswerChange(7, event.target.value.slice(-1))
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
                              500,
                            );
                            return;
                          }
                          setWrongBingoIndex(index);
                          if (wrongTimeoutRef.current) {
                            clearTimeout(wrongTimeoutRef.current);
                          }
                          wrongTimeoutRef.current = setTimeout(
                            () => setWrongBingoIndex(null),
                            500,
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
                  {bingoAnswer.map((word, index) => {
                    const isFilled = index < bingoProgress;
                    const displayWord =
                      index === 1 && bingoAltChoice
                        ? bingoAltChoice
                        : index === 4 && bingoAltChoice
                          ? bingoAltChoice === '안 쓴'
                            ? '쓴'
                            : '안 쓴'
                          : word;
                    return (
                      <button
                        key={`bingo-answer-${index}`}
                        type="button"
                        onClick={() => {
                          if (!isFilled) return;
                          setBingoProgress(index);
                          setWrongBingoIndex(null);
                          setCorrectBingoIndex(null);
                          if (index <= 1) {
                            setBingoAltChoice(null);
                          }
                          setBingoAlertOpen(false);
                        }}
                        disabled={!isFilled}
                        className={`min-w-[6rem] rounded-2xl border border-zinc-700 px-5 py-3 text-center ${
                          isFilled
                            ? 'bg-white text-black'
                            : 'bg-zinc-950 text-white'
                        }`}
                        aria-disabled={!isFilled}
                      >
                        {isFilled ? displayWord : '•'}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <dialog
        ref={qrPreviewDialogRef}
        className="nes-dialog is-rounded w-[90vw] max-w-[560px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 is-dark"
        onClose={() => {
          setQrPreviewOpen(false);
          setQrPreviewUrl(null);
          setQrPreviewKind('unknown');
          if (qrResolveTimeoutRef.current) {
            clearTimeout(qrResolveTimeoutRef.current);
            qrResolveTimeoutRef.current = null;
          }
          qrScanLockedRef.current = false;
          if (showScannerRef.current && scannerRef.current) {
            setScanError(null);
            scannerRef.current
              .start()
              .catch(() => setScanError('카메라 권한을 확인해 주세요.'));
          }
        }}
      >
        <form method="dialog">
          <p className="title text-center text-lg">QR 이미지</p>
          <div className="mt-4 flex justify-center">
            {qrPreviewUrl ? (
              qrPreviewKind === 'image' ? (
                <img
                  src={qrPreviewUrl}
                  alt="QR result"
                  className="max-h-[60vh] w-full rounded-xl object-contain"
                />
              ) : qrPreviewKind === 'iframe' ? (
                <iframe
                  title="QR page preview"
                  src={qrPreviewUrl}
                  className="h-[60vh] w-full rounded-xl border border-zinc-800 bg-black"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : qrPreviewKind === 'loading' ? (
                <div className="flex flex-col items-center gap-3 text-zinc-300">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-200" />
                  <p className="text-center text-sm">이미지 불러오는 중...</p>
                </div>
              ) : (
                <p className="text-center text-sm text-zinc-300">
                  이미지나 웹페이지로 표시할 수 없는 QR입니다.
                </p>
              )
            ) : (
              <p className="text-center text-sm text-zinc-300">
                QR 결과를 불러오지 못했습니다.
              </p>
            )}
          </div>
          {qrPreviewUrl && qrPreviewKind === 'iframe' ? (
            <div className="mt-3 text-center">
              <a
                href={qrPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-300 underline"
              >
                새 탭에서 열기
              </a>
            </div>
          ) : null}
          <menu className="dialog-menu mt-4 flex justify-end">
            <button className="nes-btn">확인</button>
          </menu>
        </form>
      </dialog>
      <dialog
        ref={alertDialogRef}
        className={`nes-dialog is-rounded w-[90vw] max-w-[520px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          shouldAdvance
            ? 'bg-emerald-900 text-2xl items-center justify-center text-white'
            : shouldReset
              ? 'bg-rose-900 text-2xl items-center justify-center text-white'
              : 'is-dark'
        }`}
        onClose={() => {
          setAlertMessage(null);
          setShouldAdvance(false);
          setShouldReset(false);
        }}
      >
        <form method="dialog">
          <p className="title text-center">{alertMessage ?? ''}</p>
          <menu className="dialog-menu flex justify-end">
            <button
              className="nes-btn "
              onClick={() => {
                if (shouldAdvance && canAdvanceStage) onNextStage();
                if (shouldReset) {
                  setIsDrawerOpen(false);
                  onReset();
                }
              }}
            >
              확인
            </button>
          </menu>
        </form>
      </dialog>
      <dialog
        ref={bingoDialogRef}
        className="nes-dialog is-dark is-rounded w-[90vw] max-w-[520px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onClose={() => setBingoAlertOpen(false)}
      >
        <form method="dialog">
          <p className="title text-center text-xl">문장대로 행동하세요.</p>
          <menu className="dialog-menu flex justify-end">
            <button
              className="nes-btn "
              onClick={() => {
                setBingoAlertOpen(false);
                setBingoFinalUnlocked(true);
              }}
            >
              확인
            </button>
          </menu>
        </form>
      </dialog>
    </section>
  );
}
