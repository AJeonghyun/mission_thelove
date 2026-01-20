'use client';

import type { StageEntry } from './types';

const stage9: StageEntry = {
  id: 'stage-9',
  title: 'Stage 9',
  introImages: [],
  puzzleTitle: '',
  question: '',
  answer: '',
  renderPuzzle: () => (
    <section className="flex flex-1 items-center justify-center min-h-0 ">
      <img
        src="/pixel/final_msg.webp"
        alt="마지막 메시지"
        className="max-h-full max-w-full rounded-3xl object-contain"
      />
    </section>
  ),
};

export default stage9;
