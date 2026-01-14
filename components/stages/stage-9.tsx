'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '마지막 메시지';
const message =
  '사실 사탄이 훔쳐간 예수님이 가장 사랑하시는 것은 바로 거울에 비친 "너"';

const stage9: StageEntry = {
  id: 'stage-9',
  title: 'Stage 9',
  introImages: [],
  puzzleTitle,
  question: message,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          <p className="whitespace-pre-line text-base text-zinc-200 sm:text-lg">
            {message}
          </p>
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
  ),
};

export default stage9;
