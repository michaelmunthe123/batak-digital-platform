import type { ContributionStatus } from "@/lib/community-types";
import { contributionStatusLabel } from "@/lib/community-workflow";

export function CommunityStatusBadge({ status }: { status: ContributionStatus }) {
  return (
    <span className="inline-flex rounded-full border border-stone-300 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-700">
      {contributionStatusLabel(status)}
    </span>
  );
}
