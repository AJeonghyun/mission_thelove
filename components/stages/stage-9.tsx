'use client';

import { Button } from '@/components/ui/button';
import type { StageEntry } from './types';

function Stage9Screen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 min-h-0">
      <img
        src="/pixel/final_msg.webp"
        alt="마지막 메시지"
        className="max-h-full max-w-full rounded-3xl object-contain"
      />
      <div className="flex justify-center flex-wrap mb-4">
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

const stage9: StageEntry = {
  id: 'stage-9',
  title: 'Stage 9',
  introImages: [],
  puzzleTitle: '',
  question: '',
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage9Screen onNextStage={onNextStage} canAdvanceStage={canAdvanceStage} />
  ),
};

export default stage9;
