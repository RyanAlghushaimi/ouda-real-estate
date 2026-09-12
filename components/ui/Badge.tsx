import type { ReactNode } from "react";

type Tone = "ink" | "brass" | "pine" | "line";

const toneClasses: Record<Tone, string> = {
  ink: "bg-ink/85 text-white",
  brass: "bg-brass text-white",
  pine: "bg-pine text-white",
  line: "bg-card text-ink-soft",
};

export function Badge({ tone = "line", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
