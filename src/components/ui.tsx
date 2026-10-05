import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex justify-center py-20" role="status">
      <Loader2 className="h-6 w-6 motion-safe:animate-spin" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-ink/25 px-6 py-12 text-center dark:border-paper/25">
      <h2 className="text-xl font-bold">{title}</h2>
      {message && <p className="muted mt-2 text-sm">{message}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="muted mt-1 text-xs">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-ember dark:text-emberlight" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
