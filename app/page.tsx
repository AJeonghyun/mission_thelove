'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import StageIntro from '../components/StageIntro';
import { stages } from '../components/stages';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [stageIndex, setStageIndex] = useState(0);
  const [introIndex, setIntroIndex] = useState(0);
  const [input, setInput] = useState(['', '']);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'cleared'>('idle');

  const stage = stages[stageIndex];
  const inIntro = introIndex < stage.introImages.length;
  const isFirstIntro = introIndex === 0;
  const isLastIntro = introIndex === stage.introImages.length - 1;
  const canAdvanceStage = stageIndex < stages.length - 1;
  const canGoPrevStage = stageIndex > 0;

  const normalizedAnswer = useMemo(
    () => stage.answer.trim().toLowerCase(),
    [stage.answer]
  );

  useEffect(() => {
    if (stage.inputMode === 'bingo') {
      setInput(['']);
      return;
    }
    if (stage.inputMode === 'qr' && stage.qrAnswers?.length) {
      setInput(Array.from({ length: stage.qrAnswers.length }, () => ''));
      return;
    }
    setInput(Array.from({ length: stage.answer.length }, () => ''));
  }, [stage.answer.length, stage.inputMode, stage.qrAnswers?.length]);

  const submitAnswer = (): 'correct' | 'wrong' | null => {
    if (stage.inputMode === 'qr' && stage.qrAnswers?.length) {
      const normalizedInputs = input.map((value) => value.trim().toLowerCase());
      if (normalizedInputs.some((value) => !value)) return null;
      const normalizedQr = stage.qrAnswers.map((value) =>
        value.trim().toLowerCase()
      );
      const isCorrect =
        normalizedInputs.length === normalizedQr.length &&
        normalizedInputs.every((value, index) => value === normalizedQr[index]);
      if (isCorrect) {
        setStatus('cleared');
        return 'correct';
      }
      setStatus('wrong');
      return 'wrong';
    }
    const normalizedInput = input.join('').trim().toLowerCase();
    if (!normalizedInput) return null;
    if (normalizedInput === normalizedAnswer) {
      setStatus('cleared');
      return 'correct';
    }
    setStatus('wrong');
    return 'wrong';
  };

  const goNextStage = () => {
    if (!canAdvanceStage) return;
    setStageIndex((prev) => prev + 1);
    setIntroIndex(0);
    setInput(['', '']);
    setStatus('idle');
  };
  const goPrevStage = () => {
    if (!canGoPrevStage) return;
    setStageIndex((prev) => Math.max(prev - 1, 0));
    setIntroIndex(0);
    setInput(['', '']);
    setStatus('idle');
  };

  const handleAnswerChange = useCallback((index: number, value: string) => {
    setInput((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }, []);

  const goNextIntro = () => {
    if (!inIntro) return;
    if (isLastIntro) {
      setIntroIndex(stage.introImages.length);
      return;
    }
    setIntroIndex((prev) => prev + 1);
  };

  const goPrevIntro = () => {
    if (!inIntro || isFirstIntro) return;
    setIntroIndex((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 overflow-y-auto px-6 py-8 sm:px-10 md:px-16 md:py-10 lg:max-w-7xl lg:px-20 md:[@media(orientation:landscape)]:py-6">
        <header className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-500">
          <span>Escape Room</span>
        </header>

        {inIntro ? (
          <StageIntro
            title={stage.title}
            images={stage.introImages}
            narrations={stage.introNarrations}
            overlayImage={stage.introOverlayImage}
            overlayText={stage.introOverlayText}
            introIndex={introIndex}
            isFirst={isFirstIntro}
            isLast={isLastIntro}
            onPrev={goPrevIntro}
            onNext={goNextIntro}
          />
        ) : (
          <>
            {stage.renderPuzzle({
              answer: input,
              status,
              onAnswerChange: handleAnswerChange,
              onSubmit: submitAnswer,
              onReset: () => {
                setInput(['', '']);
                setStatus('idle');
              },
              onNextStage: goNextStage,
              canAdvanceStage,
            })}
            <div className="flex items-center justify-center gap-3 ">
              <Button
                variant="outline"
                className="rounded-full border-black/20 text-black "
                onClick={goPrevStage}
                disabled={!canGoPrevStage}
              >
                이전 문제
              </Button>
              <Button
                variant="outline"
                className="rounded-full bg-black text-white border-white/20"
                onClick={goNextStage}
                disabled={!canAdvanceStage}
              >
                다음 문제
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
