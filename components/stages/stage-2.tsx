import StagePuzzle from '../StagePuzzle';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 복도';
const question =
  '사탄은 진실을 숨기기 위해 수많은 거울과 문을 만들어 두었다.\n\n겉보기에는 모두 같지만 그중 단 하나만이 다음 방으로 이어지는 길이다.';

const stage2: StageEntry = {
  id: 'stage-2',
  title: 'Stage 2',
  introImages: [],
  puzzleTitle,
  question,
  inputMode: 'qr',
  answer: '6634',
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
      inputMode="qr"
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

export default stage2;
