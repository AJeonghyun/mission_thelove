'use client';

import Image from 'next/image';
import type { StageEntry } from './types';

const stage10: StageEntry = {
  id: 'stage-10',
  title: 'Stage 10',
  introImages: [],
  puzzleTitle: 'Final',
  question: '',
  answer: '',
  renderPuzzle: () => (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <div className="relative w-full max-h-[80vh] overflow-hidden rounded-3xl bg-black aspect-[4/3]">
        <Image
          src="/final.webp"
          alt="Final"
          fill
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
    </section>
  ),
};

export default stage10;
