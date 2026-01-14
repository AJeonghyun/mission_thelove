import StagePuzzle from '../StagePuzzle';
import type { StageEntry } from './types';

const introImages = [
  '/intro1.webp',
  '/intro2.webp',
  '/intro3.webp',
  '/intro4.webp',
];
const puzzleImage = '/game1.webp';
const puzzleTitle = '사탄의 암호';
const question =
  '위에 보이는 네 개의 이름은 사탄이 남긴 거짓된 배열이다.\n각 이름은 색으로 쓰인 조각이며 진짜 순서는 숨겨져 있다.\n아래에 놓인 색의 문양은 그 조각들이 다시 정렬된 모습이다.';

const stage1: StageEntry = {
  id: 'stage-1',
  title: 'Stage 1',
  introImages,
  puzzleImage,
  puzzleTitle,
  question,
  inputMode: 'drawer',
  answer: '사랑',
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
      puzzleImage={puzzleImage}
      inputMode="drawer"
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

export default stage1;
