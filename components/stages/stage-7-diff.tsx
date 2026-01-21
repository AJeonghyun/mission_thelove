'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 눈속임';
const question = '두 그림 속에 숨겨진 사탄의 눈속임을 찾아내라.';

const imagePairs = [
  {
    id: 'pair-1',
    left: '/틀린그림1.webp',
    right: '/틀린그림1-1.webp',
  },
  {
    id: 'pair-2',
    left: '/틀린그림2.webp',
    right: '/틀린그림2-2_1.webp',
  },
  {
    id: 'pair-3',
    left: '/틀린그림3.webp',
    right: '/틀린그림3-2_1.webp',
  },
];

function Stage7DiffScreen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const [pairIndex, setPairIndex] = useState(0);
  const totalPairs = imagePairs.length;
  const currentPair = imagePairs[pairIndex];
  const isLastPair = pairIndex === totalPairs - 1;

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          <p className="text-sm text-zinc-200 sm:text-base">{question}</p>
          <div className="mt-2 text-xs text-zinc-400">
            {pairIndex + 1}/{totalPairs}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="mb-3 text-center text-xs text-zinc-400">
          {pairIndex + 1}번 그림
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={currentPair.left}
                alt={`틀린그림 ${pairIndex + 1} 왼쪽`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={currentPair.right}
                alt={`틀린그림 ${pairIndex + 1} 오른쪽`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          className="rounded-full bg-white px-8 text-black hover:bg-white/90"
          onClick={() => {
            if (!isLastPair) {
              setPairIndex((prev) => Math.min(prev + 1, totalPairs - 1));
              return;
            }
            if (canAdvanceStage) onNextStage();
          }}
        >
          {isLastPair ? '다음 스테이지' : '다음 그림'}
        </Button>
      </div>
    </section>
  );
}

const stage7Diff: StageEntry = {
  id: 'stage-7-diff',
  title: 'Stage 7-1',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage7DiffScreen
      onNextStage={onNextStage}
      canAdvanceStage={canAdvanceStage}
    />
  ),
};

export default stage7Diff;
