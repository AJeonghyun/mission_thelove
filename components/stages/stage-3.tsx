import StagePuzzle from '../StagePuzzle';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 좌표';
const question =
  '사탄은\n진실을 지우지 않았다.\n그는 그것을 숫자 속에 숨겼다.\n\n앞선 방에서 너희가 발견한 세 개의 숫자는\n단순한 코드가 아니다.';
const highlightNumbers = '[66,3,4]';

const stage3: StageEntry = {
  id: 'stage-3',
  title: 'Stage 3',
  introImages: [],
  puzzleTitle,
  question,
  inputMode: 'coord',
  answer: '요한일서49',
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
          <div className="rounded-3xl border border-zinc-700 bg-zinc-950/80 px-8 py-5 text-4xl font-semibold font-mono tracking-wide text-white shadow-[0_0_25px_rgba(255,255,255,0.08)] sm:text-5xl">
            {highlightNumbers}
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
