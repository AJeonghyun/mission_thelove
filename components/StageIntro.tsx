import Image from 'next/image';
import { Button } from '@/components/ui/button';

type StageIntroProps = {
  title: string;
  images: string[];
  narrations?: string[];
  overlayImage?: string;
  overlayText?: string;
  introIndex: number;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function StageIntro({
  title,
  images,
  narrations,
  overlayImage,
  overlayText,
  introIndex,
  isFirst,
  isLast,
  onPrev,
  onNext,
}: StageIntroProps) {
  const narrationIndex = introIndex - 2;
  const hasNarration =
    narrations && narrationIndex >= 0 && narrationIndex < narrations.length;
  const activeNarration = hasNarration ? narrations[narrationIndex] : '';
  const showNarration = !!activeNarration;
  const overlayIndex = 2 + (narrations?.length ?? 0);
  const showOverlay = !!overlayImage && introIndex === overlayIndex;
  const showDevil = introIndex >= 1 && !showOverlay;

  return (
    <section className="flex flex-1 flex-col items-center justify-between gap-6 min-h-0">
      <div className="relative w-full max-h-[70dvh] overflow-hidden rounded-3xl  shadow-2xl aspect-[4/3]">
        <Image
          src={images[introIndex]}
          alt={`${title} intro ${introIndex + 1}`}
          fill
          sizes="(min-width: 1024px) 80vw, 100vw"
          quality={75}
          className="object-cover"
          priority={introIndex === 0}
          loading={introIndex === 0 ? 'eager' : 'lazy'}
          fetchPriority={introIndex === 0 ? 'high' : 'auto'}
        />
        {showNarration ? (
          <>
            <div className="pointer-events-none absolute inset-0 z-10 text-4xl bg-black/65 backdrop-blur-sm" />
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center sm:px-10 ">
              <div className="max-w-[600px] text-lg leading-relaxed text-zinc-100 sm:text-2xl">
                {activeNarration.split('\n').map((line, index) => (
                  <p key={`${index}-${line}`}>{line}</p>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {showOverlay ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
            <div className="relative w-[80%] max-w-[760px] aspect-[4/3]">
              <Image
                src={overlayImage ?? ''}
                alt="Problem"
                fill
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="object-contain"
              />
              {overlayText ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div className="rounded-2xl bg-black/65 px-5 py-4 text-base leading-relaxed text-zinc-100 shadow-xl backdrop-blur sm:text-lg">
                    {overlayText.split('\n').map((line, index) => (
                      <p key={`${index}-${line}`}>{line}</p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {showDevil ? (
          <div className="pointer-events-none absolute bottom-0 -left-15 z-10 w-[35%] max-w-[420px]">
            <Image
              src="/pixel/devil.webp"
              alt="Devil"
              width={600}
              height={600}
              className="h-auto w-full object-contain"
              priority={introIndex === 0}
            />
          </div>
        ) : null}
      </div>
      <div className="relative z-10 mb-30 flex items-center justify-center gap-5 text-sm text-zinc-400">
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
