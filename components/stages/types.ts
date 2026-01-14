import type { ReactElement } from 'react';
import type { Stage } from '../../lib/types';

export type StageRuntimeProps = {
  answer: string[];
  status: 'idle' | 'wrong' | 'cleared';
  onAnswerChange: (index: number, value: string) => void;
  onSubmit: () => 'correct' | 'wrong' | null;
  onReset: () => void;
  onNextStage: () => void;
  canAdvanceStage: boolean;
};

export type StageEntry = Stage & {
  renderPuzzle: (props: StageRuntimeProps) => ReactElement;
};
