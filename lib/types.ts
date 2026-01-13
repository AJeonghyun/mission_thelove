export type Stage = {
  id: string;
  title: string;
  introImages: string[];
  puzzleImage?: string;
  puzzleTitle: string;
  question: string;
  answer: string;
  summary?: string;
  difficulty?: 'easy' | 'normal' | 'hard';
  estimatedMinutes?: number;
  status?: 'locked' | 'available' | 'cleared';
  inputMode?: 'drawer' | 'qr';
};
