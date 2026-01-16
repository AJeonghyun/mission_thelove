import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '⭐️ 스페셜 미션 ⭐️';
const question = '';

function Stage6Screen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          {pageIndex === 0 ? (
            <>
              <p className="whitespace-pre-line text-base text-zinc-200 sm:text-lg">
                {question}
              </p>
              <div className="mt-6 flex justify-center">
                <div className="rounded-3xl border border-rose-300/50 bg-rose-500/10 px-6 py-5 text-center text-2xl font-bold tracking-wide text-rose-200 animate-[pulse-glow_1600ms_ease-in-out_infinite] sm:text-8xl">
                  하트가 걸린 스페셜 미션 수행!
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                문제 설명
              </div>
              <p className="mt-4 whitespace-pre-line text-base text-zinc-200 sm:text-lg">
                윈드홀에 가서 탐험한 자들에게 받은 열쇠로 찬장을 열어라.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center flex-wrap mb-4 mt-4">
        {pageIndex === 0 ? (
          <Button
            className="rounded-full bg-white px-8 text-black hover:bg-white/90"
            onClick={() => setPageIndex(1)}
          >
            다음 페이지
          </Button>
        ) : (
          <Button
            className="rounded-full bg-white px-8 text-black hover:bg-white/90"
            onClick={onNextStage}
            disabled={!canAdvanceStage}
          >
            다음 문제
          </Button>
        )}
      </div>
    </section>
  );
}

const stage6: StageEntry = {
  id: 'stage-6',
  title: 'Stage 6',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage6Screen onNextStage={onNextStage} canAdvanceStage={canAdvanceStage} />
  ),
};

export default stage6;
