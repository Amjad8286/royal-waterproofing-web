import { cn } from "@/lib/utils";

/** The assistant's avatar: the logo's two waves on a navy disc, like the app icon's tile. Decorative. */
export function ChatAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900", className)}
    >
      <span className="wave-mark h-[0.5625rem] w-6">
        <span />
        <span />
      </span>
    </span>
  );
}
