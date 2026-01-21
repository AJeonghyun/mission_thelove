import Image from 'next/image';
import StagePuzzle from '../StagePuzzle';
import type { StageEntry } from './types';

const introNarrations = [
  'MISSION:THELOVE',
  '안녕?\n이른 아침인데도 용케 잘 일어났군.',
  '너희들이 방금 밥 먹고 졸려 방심한 타이밍에\n내가 예수님께서 가장 아끼고 사랑하는 것을 훔쳤지.',
  '과연 너희들이 날 쫓아올 수 있을까?',
  '아니. ㅎ 방금 밥 먹어서 뛰기 힘들겠지 하하',
  '지금부터 내가 훔쳐간 것을 되찾고 싶다면,\n내가 준비한 미션을 하나씩 통과해야 할거야.',
  '해볼테면 해봐 ㅎ',
];
const introImages = [
  ...Array.from(
    { length: 2 + introNarrations.length },
    () => '/pixel/intro.webp',
  ),
];
const puzzleImage = '/game1.webp';
const puzzleTitle = '😈 사탄의 암호 😈';
const question = '위에 보이는 네 개의 이름은 사탄이 남긴 거짓된 배열이다.';
const questionOverlay = (
  <div className="relative w-full max-h-[60dvh] overflow-hidden rounded-3xl aspect-[4/3] text-2xl">
    <div className="absolute inset-0 flex flex-col items-center justify-start gap-2 p-8 text-center">
      <p className="whitespace-pre-line">{question}</p>
      <div className="relative w-[50%] max-w-[860px] aspect-[4/3]">
        <Image
          src="/game1.webp"
          alt="Game 1"
          fill
          sizes="(min-width: 1024px) 40vw, 70vw"
          className="object-contain"
        />
      </div>
    </div>
  </div>
);
const introOverlayImage = '/pixel/문제.webp';
const introOverlayText = question;

const stage1: StageEntry = {
  id: 'stage-1',
  title: 'Stage 1',
  introImages,
  introNarrations,
  introOverlayImage,
  introOverlayText,
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
      question=""
      questionExtra={questionOverlay}
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
