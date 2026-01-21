import StagePuzzle from '../StagePuzzle';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 시험';
const question =
  '사탄은 우리를 시험에 들게 하기 위해 수많은 QR을 준비해 두었다.\n QR은 TV 밑에 있는 서랍 안에 숨겨져 있다. \n \n진짜 QR을 찾아서 문제를 해결해라.';
const qrAnswers = [
  '3,9,8',
  '1,12,27',
  '5,10,16',
  '7,33,7',
  '8,14,15',
  '3,19,5',
];

const stage2: StageEntry = {
  id: 'stage-2',
  title: 'Stage 2',
  introImages: [],
  puzzleTitle,
  question,
  inputMode: 'qr',
  answer: 'qr',
  qrAnswers,
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
      qrAnswers={qrAnswers}
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
