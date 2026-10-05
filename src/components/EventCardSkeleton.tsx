export default function EventCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-ink/10 bg-white motion-safe:animate-pulse dark:border-paper/10 dark:bg-nightcard"
      aria-hidden="true"
    >
      <div className="h-48 bg-ink/10 dark:bg-paper/10" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-ink/10 dark:bg-paper/10" />
        <div className="h-3 w-full rounded bg-ink/10 dark:bg-paper/10" />
        <div className="h-3 w-1/3 rounded bg-ink/10 dark:bg-paper/10" />
        <div className="h-3 w-1/2 rounded bg-ink/10 dark:bg-paper/10" />
        <div className="mt-4 h-10 rounded-lg bg-ink/10 dark:bg-paper/10" />
      </div>
    </div>
  );
}
