import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 미로';
const question =
  '미로의 길목마다\n작은 복주머니가 있다.\n그 안에는 사탄이 훔친 무언가와\n다음 사람에게 전해져야 할 메시지가 담겨 있다.';
const mazeLayout = [
  1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1,
  0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
];
const roomBIcons: Record<number, string> = {
  43: 'B',
  13: 'B',
  33: 'B',
  23: 'B',
};

function Stage5Screen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [showMapHint, setShowMapHint] = useState(false);
  const [destinationInput, setDestinationInput] = useState('');
  const [actionAlertOpen, setActionAlertOpen] = useState(false);
  const [actionAlertType, setActionAlertType] = useState<'correct' | 'wrong'>(
    'correct',
  );
  const [actionAlertMessage, setActionAlertMessage] = useState('');
  const alertDialogRef = useRef<HTMLDialogElement | null>(null);
  const actionDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = alertDialogRef.current;
    if (!dialog) return;
    if (alertOpen && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!alertOpen && dialog.open) {
      dialog.close();
    }
  }, [alertOpen]);

  useEffect(() => {
    const dialog = actionDialogRef.current;
    if (!dialog) return;
    if (actionAlertOpen && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!actionAlertOpen && dialog.open) {
      dialog.close();
    }
  }, [actionAlertOpen]);

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
            <div className="flex flex-1 flex-col gap-3">
              <CardTitle className="text-2xl sm:text-3xl">
                {puzzleTitle}
              </CardTitle>
              <p className="whitespace-pre-line text-base text-zinc-200 sm:text-lg">
                {question}
              </p>
            </div>
            <div className="md:w-[460px] rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-sm text-zinc-200 md:self-start">
              <div className="mb-3">📢 규칙 📢</div>
              <div className="lists">
                <ul className="nes-list is-disc">
                  <li>역할: 안내자 / 탐험자</li>
                  <li className="text-emerald-300">
                    탐험자 2명: 이름에 ‘ㅇ’ 포함 1명 / 생일 가장 빠른 1명
                  </li>
                  <li className="text-emerald-300">-&gt; B1 아너스홀 이동</li>
                  <li>서로 못 봄, 전화만 가능</li>
                  <li>탐험자 - 선생님 폰 / 안내자 - 조스탭 폰</li>
                  <li>복주머니 찾고 EXIT 도착</li>
                </ul>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8" />
      </Card>

      {pageIndex === 0 ? (
        <div className="flex w-full flex-col items-center gap-6">
          <div className="w-full max-w-6xl rounded-3xl border border-zinc-800 bg-zinc-950/70 p-2 max-h-[50dvh] overflow-hidden">
            <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-stretch">
              <div className="flex w-full flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-sl uppercase tracking-[0.3em] text-zinc-400">
                  지도 방
                </div>
                <div className="mt-4 flex flex-1 items-center justify-center">
                  <div className="relative flex w-full max-w-xs items-center justify-center pt-4 pb-4">
                    <div className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-center text-zinc-100">
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src="/user-group-solid.svg"
                            alt="지도 보는 사람들"
                            width={80}
                            height={80}
                            className="h-16 w-16 object-contain brightness-0 invert"
                          />
                          <span className="text-xs text-zinc-400">안내자</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src="/map.svg"
                            alt="미로 지도"
                            width={80}
                            height={80}
                            className="h-16 w-16 object-contain brightness-0 invert"
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
                    핸드폰 통신
                  </span>
                  <span className="h-10 border-l border-dashed border-zinc-600 lg:hidden" />
                </div>
              </div>

              <div className="relative flex w-full flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-sl uppercase tracking-[0.3em] text-zinc-400">
                  미로 방
                </div>
                <div className="mt-4 flex flex-1 flex-col items-center gap-3">
                  <div className="relative flex w-full max-w-xs items-center justify-center ">
                    <div className="absolute left-0 -top-2 rounded-full border border-emerald-300/60 bg-emerald-300/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                      START
                    </div>
                    <div className="absolute -bottom-2 right-0 rounded-full border border-emerald-300/60 bg-emerald-300/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
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
                              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/60 bg-amber-300/20 text-[15px] text-amber-200">
                                {roomBIcons[index]}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/60 bg-amber-300/20 text-[15px] text-amber-200">
                        B
                      </span>
                      복주머니
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-wrap mb-4">
            <Button
              className="rounded-full bg-white px-8 text-black hover:bg-white/90"
              onClick={() => setAlertOpen(true)}
            >
              탐험 시작
            </Button>
          </div>
        </div>
      ) : pageIndex === 1 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 flex-wrap mb-4">
          <div className="w-full max-w-3xl rounded-3xl border-zinc-800 bg-zinc-950/70 text-white">
            <div className="text-base text-zinc-200 sm:text-lg items-center justify-center text-center">
              <button
                type="button"
                className="nes-btn is-primary w-full sm:w-auto"
                onClick={() => setShowMapHint((prev) => !prev)}
              >
                지도 위치
              </button>
              {showMapHint ? (
                <div className="mt-5 flex flex-col items-center gap-3 text-center text-zinc-100">
                  <div className="text-9xl">🪑⬇️🗺️</div>
                  <div className="text-3xl text-zinc-300">
                    식탁 아래에 지도가 있다.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <Button
            className="rounded-full bg-white px-8 text-black hover:bg-white/90"
            onClick={() => {
              setShowMapHint(false);
              setPageIndex(2);
            }}
          >
            다음 페이지
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4 flex-wrap mb-4">
          <div className="w-full max-w-3xl rounded-3xl border-zinc-800 bg-zinc-950/70 text-white p-6">
            <div className="text-center text-base text-zinc-200 sm:text-lg">
              목적지를 입력하세요.
            </div>
            <div className="mt-4 flex justify-center">
              <input
                value={destinationInput}
                onChange={(event) => setDestinationInput(event.target.value)}
                className="h-12 w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-center text-lg text-white"
                placeholder="목적지 입력"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                className="rounded-full bg-white px-8 text-black hover:bg-white/90"
                onClick={() => {
                  const isCorrect = destinationInput.trim() === '윈드홀';
                  setActionAlertType(isCorrect ? 'correct' : 'wrong');
                  setActionAlertMessage(
                    isCorrect ? '행동하세요.' : '오답입니다.',
                  );
                  setActionAlertOpen(true);
                }}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
      <dialog
        ref={alertDialogRef}
        className="nes-dialog is-rounded w-[90vw] max-w-[520px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl items-center justify-center text-white"
        style={{ backgroundColor: '#111827', backgroundImage: 'none' }}
        onClose={() => setAlertOpen(false)}
      >
        <form method="dialog">
          <p className="title text-center">
            안내자는 지금 아너스홀로 떠나세요.
          </p>
          <menu className="dialog-menu flex justify-end">
            <button
              className="nes-btn "
              onClick={() => {
                setAlertOpen(false);
                setPageIndex(1);
              }}
            >
              확인
            </button>
          </menu>
        </form>
      </dialog>
      <dialog
        ref={actionDialogRef}
        className="nes-dialog is-rounded w-[90vw] max-w-[520px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl items-center justify-center text-white"
        style={{
          backgroundColor:
            actionAlertType === 'correct' ? '#047857' : '#881337',
          backgroundImage: 'none',
        }}
        onClose={() => {
          setActionAlertOpen(false);
          setActionAlertMessage('');
        }}
      >
        <form method="dialog">
          <p className="title text-center">{actionAlertMessage}</p>
          <menu className="dialog-menu flex justify-end">
            <button
              className="nes-btn"
              onClick={() => {
                setActionAlertOpen(false);
                if (actionAlertType === 'correct' && canAdvanceStage) {
                  onNextStage();
                }
              }}
            >
              확인
            </button>
          </menu>
        </form>
      </dialog>
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
    <Stage5Screen onNextStage={onNextStage} canAdvanceStage={canAdvanceStage} />
  ),
};

export default stage5;
