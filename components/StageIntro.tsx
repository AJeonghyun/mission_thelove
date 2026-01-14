import Image from 'next/image';
import { Button } from '@/components/ui/button';

type StageIntroProps = {
  title: string;
  images: string[];
  introIndex: number;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function StageIntro({
  title,
  images,
  introIndex,
  isFirst,
  isLast,
  onPrev,
  onNext,
}: StageIntroProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-between gap-6 min-h-0">
      <div className="relative w-full max-h-[70vh] overflow-hidden rounded-3xl bg-black shadow-2xl aspect-[4/3]">
        <Image
          src={images[introIndex]}
          alt={`${title} intro ${introIndex + 1}`}
          fill
          sizes="(min-width: 1024px) 80vw, 100vw"
          quality={75}
          className="object-contain"
          priority={introIndex === 0}
          loading={introIndex === 0 ? 'eager' : 'lazy'}
          fetchPriority={introIndex === 0 ? 'high' : 'auto'}
        />
      </div>
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={isFirst}
          className="rounded-full"
        >
          ← 이전
        </Button>
        <span>
          {introIndex + 1}/{images.length}
        </span>
        <Button
          type="button"
          size="sm"
          onClick={onNext}
          className="rounded-full"
        >
          {isLast ? '문제로 →' : '다음 →'}
        </Button>
      </div>
    </section>
  );
}
