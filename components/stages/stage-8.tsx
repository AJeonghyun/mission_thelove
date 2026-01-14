'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';
import { Button } from '@/components/ui/button';

const puzzleTitle = '금고의 비밀번호';
const prompt =
  '네 개의 숫자는 무작위로 정해진 것이 아니다.\n아래의 조건을 모두 만족하는 숫자 네 개를 순서대로 나열하라.\n단 조건 하나라도 어길 시 문은 열리지 않는다.\n* 금고 번호는 서로 다른 네 자리 숫자이다.';

const conditions = [
  '네 숫자 중 짝수는 정확히 2개이다.',
  '첫번째 숫자는 마지막 숫자보다 크다.',
  '두번째 숫자와 세번째 숫자의 차는 3이다.',
  '첫번째 숫자와 두번째 숫자의 합이 세번째 숫자와 네번째 숫자의 합보다 크다.',
  '네 숫자의 합은 30을 넘지 않으며, 이 조건을 만족하는 경우 중 가장 크다.',
];

function Stage8Screen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const startPressTimer = () => {
    clearPressTimer();
    pressTimerRef.current = setTimeout(() => {
      if (canAdvanceStage) onNextStage();
    }, 5000);
  };

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle
            className="text-2xl sm:text-3xl"
            onPointerDown={startPressTimer}
            onPointerUp={clearPressTimer}
            onPointerLeave={clearPressTimer}
            onPointerCancel={clearPressTimer}
          >
            {puzzleTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                문제
              </div>
              <p className="mt-3 whitespace-pre-line text-base text-zinc-200 sm:text-lg">
                {prompt}
              </p>
              <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                실제 금고에 비밀번호를 입력해야 한다.
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-base text-zinc-200">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                조건
              </div>
              <div className="mt-4 space-y-2">
                {conditions.map((condition, index) => (
                  <div
                    key={condition}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2"
                  >
                    <span className="min-w-[1.5rem] text-sm text-zinc-500">
                      {index + 1}.
                    </span>
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button
          className="rounded-full bg-white px-8 text-black hover:bg-white/90"
          onClick={onNextStage}
          disabled={!canAdvanceStage}
        >
          다음 페이지
        </Button>
      </div>
    </section>
  );
}

const stage8: StageEntry = {
  id: 'stage-8',
  title: 'Stage 8',
  introImages: [],
  puzzleTitle,
  question: prompt,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage8Screen onNextStage={onNextStage} canAdvanceStage={canAdvanceStage} />
  ),
};

export default stage8;
