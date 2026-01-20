import StagePuzzle from '../StagePuzzle';
import type { StageEntry } from './types';

const puzzleTitle = '사탄의 복도';
const question =
  '빙고판 속에서 숨은 문장을 찾아라.\n그 문장이 다음 행동을 말해준다.';
const bingoBoard = [
  ['두쫀쿠', '안 쓴', '가방', '안경'],
  ['사람', '빵', '바지', '포크'],
  ['암송하기', '쓴', '나가서', '목사님'],
  ['안경', '의자', '사람과', '책'],
  ['옷', '한명씩', '거울', '쿠키'],
];
const bingoAnswer = [
  '안경',
  '안 쓴',
  '사람과',
  '안경',
  '쓴',
  '사람',
  '한명씩',
  '나가서',
  '암송하기',
];
const bingoFinalQuestion =
  '밖에서 2명이서 암송한 말씀 구절을 그대로 입력하라. 띄어쓰기까지 정확히 적어야 한다. \n 틀리면 다시 나가서 암송해와라.';
const answer =
  '하나님의 사랑이 우리에게 이렇게 나타난 바 되었으니 하나님이 자기의 독생자를 세상에 보내심은 그로 말미암아 우리를 살리려 하심이라';

const stage4: StageEntry = {
  id: 'stage-4',
  title: 'Stage 4',
  introImages: [],
  puzzleTitle,
  question,
  inputMode: 'bingo',
  bingoBoard,
  bingoAnswer,
  bingoFinalQuestion,
  answer,
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
      inputMode="bingo"
      bingoBoard={bingoBoard}
      bingoAnswer={bingoAnswer}
      bingoFinalQuestion={bingoFinalQuestion}
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

export default stage4;
