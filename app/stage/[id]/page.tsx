'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import StageIntro from '../../../components/StageIntro';
import { stages } from '../../../components/stages';
import { Button } from '@/components/ui/button';

export default function StagePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const stageNumber = Number(params.id);
  const stageIndex = stageNumber - 1;
  const stage = stages[stageIndex];

  const [introIndex, setIntroIndex] = useState(0);
  const [input, setInput] = useState(['']);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'cleared'>('idle');

  useEffect(() => {
    setStatus('idle');
    if (Number.isNaN(stageNumber)) return;
    const storedIntro = sessionStorage.getItem(`stage-intro-${stageNumber}`);
    if (storedIntro !== null) {
      const parsed = Number(storedIntro);
      if (!Number.isNaN(parsed)) {
        const maxIndex = stage?.introImages.length ?? parsed;
        setIntroIndex(Math.min(Math.max(parsed, 0), maxIndex));
        return;
      }
    }
    setIntroIndex(0);
  }, [stage?.introImages.length, stageIndex, stageNumber]);

  useEffect(() => {
    if (Number.isNaN(stageNumber)) return;
    sessionStorage.setItem(`stage-intro-${stageNumber}`, String(introIndex));
  }, [introIndex, stageNumber]);

  const normalizedAnswer = useMemo(
    () => (stage?.answer ?? '').trim().toLowerCase(),
    [stage?.answer]
  );

  useEffect(() => {
    if (!stage) return;
    if (stage.inputMode === 'bingo') {
      setInput(['']);
      return;
    }
    if (stage.inputMode === 'qr' && stage.qrAnswers?.length) {
      setInput(Array.from({ length: stage.qrAnswers.length }, () => ''));
      return;
    }
    setInput(Array.from({ length: stage.answer.length }, () => ''));
  }, [stage]);

  const submitAnswer = (): 'correct' | 'wrong' | null => {
    if (!stage) return null;
    if (stage.inputMode === 'qr' && stage.qrAnswers?.length) {
      const normalizedInputs = input.map((value) =>
        value.trim().toLowerCase()
      );
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

  const handleAnswerChange = useCallback((index: number, value: string) => {
    setInput((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }, []);

  if (!stage || Number.isNaN(stageNumber)) {
    return (
      <div className="h-full bg-zinc-950 font-sans text-zinc-100">
        <main className="mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-10">
          <p className="text-base text-zinc-200">존재하지 않는 스테이지입니다.</p>
          <Button asChild className="rounded-full bg-white px-8 text-black hover:bg-white/90">
            <Link href="/">목록으로</Link>
          </Button>
        </main>
      </div>
    );
  }

  const inIntro = introIndex < stage.introImages.length;
  const isFirstIntro = introIndex === 0;
  const isLastIntro = introIndex === stage.introImages.length - 1;
  const canAdvanceStage = stageIndex < stages.length - 1;

  const goNextStage = () => {
    if (!canAdvanceStage) return;
    router.push(`/stage/${stageIndex + 2}`);
  };

  const goPrevStage = () => {
    if (stageIndex === 0) return;
    router.push(`/stage/${stageIndex}`);
  };

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
    <div className="h-full bg-zinc-950 font-sans text-zinc-100">
      <main className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 overflow-hidden px-6 py-8 sm:px-10 md:px-16 md:py-10 lg:max-w-7xl lg:px-20 md:[@media(orientation:landscape)]:py-6">
        <header className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
          <span>Escape Room</span>
          <span>
            {stage.title} · {stageIndex + 1}/{stages.length}
          </span>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
              <Link href="/">목록</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/20 text-white hover:bg-white/10"
              onClick={goPrevStage}
              disabled={stageIndex === 0}
            >
              이전
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/20 text-white hover:bg-white/10"
              onClick={goNextStage}
              disabled={!canAdvanceStage}
            >
              다음
            </Button>
          </div>
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
                setInput(['']);
                setStatus('idle');
              },
              onNextStage: goNextStage,
              canAdvanceStage,
            })}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
                onClick={goPrevStage}
                disabled={stageIndex === 0}
              >
                이전 문제
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
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
