import StageCard from './StageCard';
import type { Stage } from '../lib/types';

export default function StageGrid({ stages }: { stages: Stage[] }) {
  return (
    <div className="flex w-full flex-col gap-6">
      {stages.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
}
