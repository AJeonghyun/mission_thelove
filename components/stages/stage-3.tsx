import StagePuzzle from '../StagePuzzle';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 복도';
const question =
  '사탄은 진실을 지우지 않았다.\n그는 그것을 숫자 속에 숨겼다.\n\n앞선 방에서 너희가 발견한 세 개의 숫자들은 단순한 코드가 아니다.';
const highlightNumbers = [
  '[3,9,8]',
  '[1,12,27]',
  '[5,10,16]',
  '[7,33,7]',
  '[8,14,15]',
  '[3,19,5]',
];

const stage3: StageEntry = {
  id: 'stage-3',
  title: 'Stage 3',
  introImages: [],
  puzzleTitle,
  question,
  inputMode: 'coord',
  answer: '요한일서4장9절',
  renderPuzzle: ({
    answer,
    status,
    onAnswerChange,
    onSubmit,
    onReset,
    onNextStage,
    canAdvanceStage,
  }) => (
    <StagePuzzle
      title={puzzleTitle}
      question={question}
      questionExtra={
        <div className="flex justify-center">
          <div className="grid w-full max-w-3xl grid-cols-2 gap-4 rounded-3xl border border-zinc-700 bg-zinc-950/80 px-6 py-6 text-3xl font-semibold font-mono tracking-wide text-white shadow-[0_0_25px_rgba(255,255,255,0.08)] sm:grid-cols-3 sm:text-4xl">
            {highlightNumbers.map((value) => (
              <div
                key={value}
                className="flex items-center justify-center rounded-2xl border border-zinc-600 bg-zinc-900/70 px-4 py-3"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      }
      inputMode="coord"
      answer={answer}
      status={status}
      onAnswerChange={onAnswerChange}
      onSubmit={onSubmit}
      onReset={onReset}
      onNextStage={onNextStage}
      canAdvanceStage={canAdvanceStage}
    />
  ),
};

export default stage3;
