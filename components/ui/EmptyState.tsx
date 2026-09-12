import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-2xl">
        ⌂
      </div>
      <h3 className="mt-5 font-display text-xl text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
