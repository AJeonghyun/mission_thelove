import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 미로';
const question =
  '미로의 길목마다\n작은 복주머니가 있다.\n그 안에는 사탄이 훔친 달란트와\n다음 사람에게 전해져야 할 메시지가 담겨 있다.';
const mazeLayout = [
  1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1,
  0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
];
const roomBIcons: Record<number, string> = {
  43: 'B',
  13: 'T',
  33: 'N',
};

function Stage5Screen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const [phase, setPhase] = useState<'intro' | 'reveal'>('intro');
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
            <p className="whitespace-pre-line text-base text-zinc-200 sm:text-lg md:flex-1">
              {question}
            </p>
            <div className="md:w-[320px] rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-200">
              <div>📢 규칙 📢</div>
              <div>1. 역할 : 지도자 / 탐험자</div>
              <div className="mt-2">2. 서로 볼 수 없음, 무전기로만 소통</div>
              <div className="mt-2">3. 탐험자는 길을 이동해 EXIT에 도달</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {phase === 'intro' ? (
        <div className="flex w-full flex-col items-center gap-6">
          <div className="w-full max-w-6xl rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch">
              <div className="flex w-full flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                  ROOM A (지도 방)
                </div>
                <div className="mt-5 flex flex-1 items-center justify-center">
                  <div className="relative flex w-full max-w-sm items-center justify-center pt-6 pb-6">
                    <div className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-5 text-center text-zinc-100">
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src="/user-group-solid.svg"
                            alt="지도 보는 사람들"
                            width={80}
                            height={80}
                            className="h-20 w-20 object-contain brightness-0 invert"
                          />
                          <span className="text-xs text-zinc-400">안내자</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src="/map.svg"
                            alt="미로 지도"
                            width={80}
                            height={80}
                            className="h-20 w-20 object-contain brightness-0 invert"
                          />
                          <span className="text-xs text-zinc-400">
                            미로 지도
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center text-zinc-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="h-10 border-l border-dashed border-zinc-600 lg:hidden" />
                  <div className="flex items-center gap-2">
                    <span className="h-px w-12 border-t border-dashed border-zinc-600" />
                    <span className="text-sm">↔</span>
                    <span className="h-px w-12 border-t border-dashed border-zinc-600" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em]">
                    무전기 통신
                  </span>
                  <span className="h-10 border-l border-dashed border-zinc-600 lg:hidden" />
                </div>
              </div>

              <div className="relative flex w-full flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                  ROOM B (미로 방)
                </div>
                <div className="mt-5 flex flex-1 flex-col items-center gap-3">
                  <div className="relative flex w-full max-w-sm items-center justify-center pt-6 pb-6">
                    <div className="absolute left-0 top-0 rounded-full border border-emerald-300/60 bg-emerald-300/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                      START
                    </div>
                    <div className="absolute bottom-0 right-0 rounded-full border border-emerald-300/60 bg-emerald-300/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                      EXIT
                    </div>
                    <div className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-5">
                      <div className="grid grid-cols-7 gap-1">
                        {mazeLayout.map((cell, index) => (
                          <div
                            key={`maze-${index}`}
                            className={`relative flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 ${
                              cell ? 'bg-zinc-700' : 'bg-zinc-950'
                            }`}
                            aria-hidden
                          >
                            {roomBIcons[index] && (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/60 bg-amber-300/20 text-[10px] text-amber-200">
                                {roomBIcons[index]}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/60 bg-amber-300/20 text-[10px] text-amber-200">
                        B
                      </span>
                      복주머니
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/60 bg-amber-300/20 text-[10px] text-amber-200">
                        T
                      </span>
                      달란트
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/60 bg-amber-300/20 text-[10px] text-amber-200">
                        N
                      </span>
                      쪽지
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="rounded-full bg-white px-8 text-black hover:bg-white/90"
              onClick={() => setAlertOpen(true)}
            >
              탐험 시작
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-4">
          <Card className="w-full max-w-3xl rounded-3xl border-zinc-800 bg-zinc-950/70 text-white">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">지도 위치</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-zinc-200 sm:text-lg">
              식탁 밑에 지도가 붙어 있다.
            </CardContent>
          </Card>
          <Button
            className="rounded-full bg-white px-8 text-black hover:bg-white/90"
            onClick={onNextStage}
            disabled={!canAdvanceStage}
          >
            다음 페이지
          </Button>
        </div>
      )}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              탐험자는 지금 바로 탐험을 떠나세요.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction
              className="bg-white text-black hover:bg-white/90"
              onClick={() => {
                setAlertOpen(false);
                setPhase('reveal');
              }}
            >
              확인
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

const stage5: StageEntry = {
  id: 'stage-5',
  title: 'Stage 5',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage5Screen
      onNextStage={onNextStage}
      canAdvanceStage={canAdvanceStage}
    />
  ),
};

export default stage5;
