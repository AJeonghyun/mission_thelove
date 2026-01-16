'use client';

import type { StageEntry } from './types';

const stage10: StageEntry = {
  id: 'stage-10',
  title: 'Stage 10',
  introImages: [],
  puzzleTitle: 'Final',
  question: '',
  answer: '',
  renderPuzzle: () => (
    <section className="flex flex-col items-center justify-center gap-6 min-h-0">
      <div className="w-full max-w-3xl rounded-3xl border items-center justify-center mx-auto mb-10 border-zinc-800 bg-zinc-950/80 p-10 text-center text-3xl font-semibold tracking-wide text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:text-5xl">
        한 컷 프레임 추가 예정
      </div>
    </section>
  ),
};

export default stage10;
