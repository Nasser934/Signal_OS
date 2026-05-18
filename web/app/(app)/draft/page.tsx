import { DraftScorer } from './_components/DraftScorer';
import { LoopRail, PageHeader } from '@/components/app-ui';

export default function DraftPage() {
  return (
    <>
      <PageHeader
        eyebrow="Draft studio"
        title="Score before you post"
        description="Turn a rough idea into a stronger post, see the weak point immediately, and carry the best version into publishing."
      />
      <LoopRail active="Score" />
      <DraftScorer />
    </>
  );
}
