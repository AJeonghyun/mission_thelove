import type { Stage } from '../lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const difficultyTone = {
  easy: 'bg-emerald-100 text-emerald-700',
  normal: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
} as const;

const statusTone = {
  locked: 'text-zinc-400',
  available: 'text-zinc-900',
  cleared: 'text-emerald-700',
} as const;

export default function StageCard({ stage }: { stage: Stage }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-start justify-between">
        {stage.difficulty ? (
          <Badge
            className={`border-transparent ${difficultyTone[stage.difficulty]}`}
          >
            {stage.difficulty}
          </Badge>
        ) : (
          <span />
        )}
        {stage.status && (
          <span className={`text-xs font-semibold ${statusTone[stage.status]}`}>
            {stage.status}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg sm:text-xl">{stage.title}</CardTitle>
        {stage.summary && (
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">
            {stage.summary}
          </p>
        )}
        {stage.estimatedMinutes !== undefined && (
          <div className="mt-4 text-xs text-zinc-500 sm:text-sm">
            {stage.estimatedMinutes} min
          </div>
        )}
      </CardContent>
    </Card>
  );
}
