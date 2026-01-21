'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 수수께끼';
const question = '배치를 완성했다면\n정답을 입력하세요.';
const hintPassword = '1004';
const hintMessage = '오병이어 숫자를 잘 생각해보세요';

function Stage7FinalScreen({
  onNextStage,
  canAdvanceStage,
}: {
  onNextStage: () => void;
  canAdvanceStage: boolean;
}) {
  const [finalInput, setFinalInput] = useState('');
  const [hintPasswordInput, setHintPasswordInput] = useState('');
  const [hintError, setHintError] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<'correct' | 'wrong'>('correct');
  const [alertMessage, setAlertMessage] = useState('');
  const [shouldAdvance, setShouldAdvance] = useState(false);
  const alertDialogRef = useRef<HTMLDialogElement | null>(null);
  const hintDialogRef = useRef<HTMLDialogElement | null>(null);
  const hintPasswordDialogRef = useRef<HTMLDialogElement | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintPasswordOpen, setHintPasswordOpen] = useState(false);

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
    const dialog = hintDialogRef.current;
    if (!dialog) return;
    if (hintOpen && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!hintOpen && dialog.open) {
      dialog.close();
    }
  }, [hintOpen]);

  useEffect(() => {
    const dialog = hintPasswordDialogRef.current;
    if (!dialog) return;
    if (hintPasswordOpen && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!hintPasswordOpen && dialog.open) {
      dialog.close();
    }
  }, [hintPasswordOpen]);

  return (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="w-full max-w-4xl mx-auto rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-6">
          <CardTitle className="text-xl sm:text-2xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <p className="title text-center text-base text-white">
            &lt;메인 제시문&gt;
          </p>
          <p className="whitespace-pre-line text-sm text-center text-white sm:text-2xl">
            {question}
          </p>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col items-center gap-4">
        <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-white">
          <div className="flex items-center justify-end gap-3 mb-2">
            <button
              type="button"
              className="nes-btn is-primary text-xs px-2 py-1"
              onClick={() => {
                setHintPasswordInput('');
                setHintError('');
                setHintPasswordOpen(true);
              }}
            >
              힌트
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
              inputMode="numeric"
              pattern="[0-9]*"
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
                if (
                  alertType === 'correct' &&
                  shouldAdvance &&
                  canAdvanceStage
                ) {
                  onNextStage();
                }
              }}
            >
              확인
            </button>
          </menu>
        </form>
      </dialog>
      <dialog
        ref={hintDialogRef}
        className="nes-dialog is-rounded w-[90vw] max-w-[520px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl items-center justify-center text-white"
        style={{ backgroundColor: '#111827', backgroundImage: 'none' }}
        onClose={() => setHintOpen(false)}
      >
        <form method="dialog">
          <p className="title text-center">{hintMessage}</p>
          <menu className="dialog-menu flex justify-end">
            <button
              className="nes-btn"
              onClick={() => {
                setHintOpen(false);
              }}
            >
              확인
            </button>
          </menu>
        </form>
      </dialog>
      <dialog
        ref={hintPasswordDialogRef}
        className="nes-dialog is-rounded w-[90vw] max-w-[520px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl items-center justify-center text-white"
        style={{ backgroundColor: '#111827', backgroundImage: 'none' }}
        onClose={() => {
          setHintPasswordOpen(false);
          setHintError('');
        }}
      >
        <form
          method="dialog"
          onSubmit={(event) => {
            event.preventDefault();
            if (hintPasswordInput !== hintPassword) {
              setHintError('비밀번호가 틀렸습니다.');
              return;
            }
            setHintPasswordOpen(false);
            setHintOpen(true);
          }}
        >
          <p className="title text-center">힌트 비밀번호를 입력하세요.</p>
          <div className="mt-4">
            <input
              value={hintPasswordInput}
              onChange={(event) => setHintPasswordInput(event.target.value)}
              className="h-12 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-center text-lg text-white"
              placeholder="비밀번호 입력"
            />
          </div>
          {hintError ? (
            <p className="mt-3 text-center text-sm text-rose-300">
              {hintError}
            </p>
          ) : null}
          <menu className="dialog-menu mt-4 flex justify-end gap-2">
            <button
              className="nes-btn"
              onClick={() => {
                setHintPasswordOpen(false);
                setHintError('');
              }}
            >
              닫기
            </button>
            <button className="nes-btn is-primary" type="submit">
              확인
            </button>
          </menu>
        </form>
      </dialog>
    </section>
  );
}

const stage7Final: StageEntry = {
  id: 'stage-7-final',
  title: 'Stage 7 Final',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <Stage7FinalScreen
      onNextStage={onNextStage}
      canAdvanceStage={canAdvanceStage}
    />
  ),
};

export default stage7Final;
