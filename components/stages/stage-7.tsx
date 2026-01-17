'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '오병이어';
const question =
  '네 개의 요소는 자리를 가질 수 있지만 \n 그 자체로는 숫자가 아니다. \n 올바른 배치를 완성하시오.';
const conditions = [
  '조건 1. ✝️와 🐟는 서로 붙어있다.',
  '조건 2. 🍞은 👥의 왼쪽에 있다.',
  '조건 3. 👥은 맨 왼쪽에 있지 않다.',
  '조건 4. ✝️는 🍞의 오른쪽에 있다.',
];

const cards = [
  { id: 'bread', label: '떡', emoji: '🍞' },
  { id: 'cross', label: '십자가', emoji: '✝' },
  { id: 'fish', label: '물고기', emoji: '🐟' },
  { id: 'people', label: '사람', emoji: '👥' },
] as const;

const correctOrder = ['bread', 'cross', 'fish', 'people'];

function Stage7Screen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const [slots, setSlots] = useState<
    Array<(typeof cards)[number]['id'] | null>
  >([null, null, null, null]);
  const [pool, setPool] = useState<(typeof cards)[number]['id'][]>([
    'people',
    'fish',
    'bread',
    'cross',
  ]);
  const [phase, setPhase] = useState<'order' | 'final'>('order');
  const [finalInput, setFinalInput] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<'correct' | 'wrong'>('correct');
  const [alertMessage, setAlertMessage] = useState('');
  const [shouldAdvance, setShouldAdvance] = useState(false);
  const alertDialogRef = useRef<HTMLDialogElement | null>(null);
  const [selectedCard, setSelectedCard] = useState<{
    id: (typeof cards)[number]['id'];
    from: 'pool' | 'slot';
    index: number;
  } | null>(null);

  const cardMap = useMemo(() => {
    return new Map(cards.map((card) => [card.id, card]));
  }, []);

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

  const moveToSlot = (
    toIndex: number,
    cardId: (typeof cards)[number]['id']
  ) => {
    setSlots((prevSlots) => {
      const nextSlots = [...prevSlots];
      if (nextSlots[toIndex] === cardId) return prevSlots;
      const existingIndex = nextSlots.findIndex((value) => value === cardId);
      if (existingIndex !== -1) nextSlots[existingIndex] = null;
      nextSlots[toIndex] = cardId;
      return nextSlots;
    });
    setPool((prevPool) => prevPool.filter((id) => id !== cardId));
  };

  const moveToPool = (cardId: (typeof cards)[number]['id']) => {
    setSlots((prevSlots) =>
      prevSlots.map((value) => (value === cardId ? null : value))
    );
    setPool((prevPool) =>
      prevPool.includes(cardId) ? prevPool : [...prevPool, cardId]
    );
  };

  const handleCheck = () => {
    const isCorrect =
      slots.every((id) => id !== null) &&
      slots.every((id, index) => id === correctOrder[index]);
    if (isCorrect) {
      setAlertType('correct');
      setAlertMessage('정답입니다');
      setAlertOpen(true);
      setShouldAdvance(false);
      setPhase('final');
      return;
    }
    setSlots([null, null, null, null]);
    setPool(['people', 'fish', 'cross', 'bread']);
    setShouldAdvance(false);
    setSelectedCard(null);
    setAlertType('wrong');
    setAlertMessage('오답입니다. 카드가 초기화되었습니다.');
    setAlertOpen(true);
  };

  const handleSlotClick = (index: number) => {
    if (!selectedCard) return;
    if (slots[index] !== null) return;
    if (selectedCard.from === 'pool') {
      moveToSlot(index, selectedCard.id);
      setSelectedCard(null);
      return;
    }
    if (selectedCard.from === 'slot') {
      if (selectedCard.index === index) return;
      setSlots((prev) => {
        const next = [...prev];
        next[index] = next[selectedCard.index];
        next[selectedCard.index] = null;
        return next;
      });
      setSelectedCard(null);
    }
  };

  const handlePoolClick = () => {
    if (!selectedCard) return;
    if (selectedCard.from === 'slot') {
      moveToPool(selectedCard.id);
    }
    setSelectedCard(null);
  };

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="w-full max-w-4xl mx-auto rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-6">
          <CardTitle className="text-xl sm:text-2xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <p className="title text-center text-base text-yellow-300">
            &lt;메인 제시문&gt;
          </p>
          <p className="whitespace-pre-line text-sm text-center text-yellow-300 sm:text-xs">
            {question}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="max-w-xl text-left text-base text-zinc-200 sm:text-sm">
              {conditions.map((line) => (
                <p key={line} className="whitespace-pre-line">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col items-center gap-4">
        {phase === 'order' ? (
          <>
            <div
              className="w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
              onClick={handlePoolClick}
            >
              <div className="text-xs text-zinc-400">카드 목록</div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {pool.map((id, index) => {
                  const card = cardMap.get(id);
                  const isSelected =
                    selectedCard?.id === id && selectedCard.from === 'pool';
                  return (
                    <div
                      key={`pool-${id}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedCard((prev) =>
                          prev?.id === id && prev.from === 'pool'
                            ? null
                            : { from: 'pool', index, id }
                        );
                      }}
                      className={`flex h-28 flex-col items-center justify-center gap-3 rounded-xl border px-4 text-center text-white ${
                        isSelected
                          ? 'border-sky-400 bg-zinc-900/70'
                          : 'border-zinc-700 bg-zinc-900/70'
                      }`}
                    >
                      <span className="text-3xl">{card?.emoji}</span>
                      <span className="text-sm text-zinc-200">
                        {card?.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="text-xs text-zinc-400">정답 칸</div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {slots.map((id, index) => {
                  const card = id ? cardMap.get(id) : null;
                  const isSelected =
                    !!card &&
                    selectedCard?.id === card.id &&
                    selectedCard.from === 'slot';
                  return (
                    <div
                      key={`slot-${index}`}
                      className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60"
                      onClick={() => handleSlotClick(index)}
                    >
                      {card ? (
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedCard((prev) =>
                              prev?.id === card.id && prev.from === 'slot'
                                ? null
                                : { from: 'slot', index, id: card.id }
                            );
                          }}
                          className={`flex h-28 w-full flex-col items-center justify-center gap-3 rounded-xl border px-4 text-center text-white ${
                            isSelected
                              ? 'border-sky-400 bg-zinc-900/70'
                              : 'border-zinc-700 bg-zinc-900/70'
                          }`}
                        >
                          <span className="text-3xl">{card.emoji}</span>
                          <span className="text-sm text-zinc-200">
                            {card.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500">선택</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center flex-wrap mb-4">
              <Button
                className="rounded-full bg-white px-8 text-black hover:bg-white/90"
                onClick={handleCheck}
              >
                정답 확인
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              힌트
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: '🍞', label: '떡' },
                { icon: '✝', label: '십자가' },
                { icon: '🐟', label: '물고기' },
                { icon: '👥', label: '사람' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-3 py-4 text-3xl shadow-sm sm:text-4xl"
                >
                  <span>{icon}</span>
                  <span className="text-xs text-zinc-300 sm:text-sm">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <input
                value={finalInput}
                onChange={(event) =>
                  setFinalInput(event.target.value.replace(/\D/g, ''))
                }
                className="h-12 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-center text-lg text-white"
                placeholder="정답 입력"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                className="rounded-full bg-white px-8 text-black hover:bg-white/90"
                onClick={() => {
                  const isCorrect = finalInput === '7';
                  setAlertType(isCorrect ? 'correct' : 'wrong');
                  setAlertMessage(isCorrect ? '정답입니다' : '오답입니다');
                  setShouldAdvance(isCorrect);
                  setAlertOpen(true);
                }}
              >
                제출
              </Button>
            </div>
          </div>
        )}
      </div>

      <dialog
        ref={alertDialogRef}
        className="nes-dialog is-rounded w-[90vw] max-w-[520px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl items-center justify-center text-white"
        style={{
          backgroundColor: alertType === 'correct' ? '#047857' : '#881337',
          backgroundImage: 'none',
        }}
        onClose={() => {
          setAlertOpen(false);
          setShouldAdvance(false);
        }}
      >
        <form method="dialog">
          <p className="title text-center">{alertMessage}</p>
          <menu className="dialog-menu flex justify-end">
            <button
              className="nes-btn"
              onClick={() => {
                setAlertOpen(false);
                if (alertType === 'correct' && shouldAdvance && canAdvanceStage) {
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

const stage7: StageEntry = {
  id: 'stage-7',
  title: 'Stage 7',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage7Screen onNextStage={onNextStage} canAdvanceStage={canAdvanceStage} />
  ),
};

export default stage7;
