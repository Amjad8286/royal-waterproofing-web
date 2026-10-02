import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import type { TeamMember } from "@/types/content";

/** Initials instead of photos until real team photos exist — never stock faces. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col rounded-sm border border-concrete-300 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-sm bg-navy-900 font-heading text-2xl font-bold tracking-wider text-white"
        >
          {member.initials}
        </span>
        <PlaceholderBadge show={member.placeholder} />
      </div>
      <h3 className="mt-5 font-heading text-h4 text-navy-900">{member.name}</h3>
      <p className="text-sm font-semibold text-royal-700">{member.role}</p>
      <p className="mt-3 text-[0.9375rem] text-ink-muted">{member.bio}</p>
    </article>
  );
}
