import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageEntry } from './types';

const puzzleTitle = '레이저빔';
const question = '레이저빔.. \n\n 뭐라고 설명해야할까..';

const stage6: StageEntry = {
  id: 'stage-6',
  title: 'Stage 6',
  introImages: [],
  puzzleTitle,
  question,
  answer: '',
  renderPuzzle: ({ onNextStage, canAdvanceStage }) => (
    <section className="flex flex-1 flex-col gap-6 min-h-0">
      <Card className="rounded-3xl border-zinc-800 bg-zinc-900/70 text-white">
        <CardHeader className="px-8">
          <CardTitle className="text-2xl sm:text-3xl">{puzzleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-8">
          <p className="whitespace-pre-line text-base text-zinc-200 sm:text-lg">
            {question}
          </p>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button
          className="rounded-full bg-white px-8 text-black hover:bg-white/90"
          onClick={onNextStage}
          disabled={!canAdvanceStage}
        >
          다음 페이지
        </Button>
      </div>
    </section>
  ),
};

export default stage6;
