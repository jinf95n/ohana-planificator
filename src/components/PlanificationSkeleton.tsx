/**
 * Elegant minimal skeleton loader shown while the planificación is generated.
 * Matches the dark form aesthetic.
 */
export const PlanificationSkeleton = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-ink rounded-3xl p-8 sm:p-10 shadow-card-pro border border-ink-border animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded-full skeleton-shimmer" />
          <div className="h-2.5 w-1/3 rounded-full skeleton-shimmer" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-3 rounded-full skeleton-shimmer w-full" />
        <div className="h-3 rounded-full skeleton-shimmer w-11/12" />
        <div className="h-3 rounded-full skeleton-shimmer w-4/5" />

        <div className="h-px bg-ink-border my-6" />

        <div className="h-3 rounded-full skeleton-shimmer w-1/2" />
        <div className="h-3 rounded-full skeleton-shimmer w-full" />
        <div className="h-3 rounded-full skeleton-shimmer w-10/12" />
        <div className="h-3 rounded-full skeleton-shimmer w-9/12" />

        <div className="h-px bg-ink-border my-6" />

        <div className="h-3 rounded-full skeleton-shimmer w-2/5" />
        <div className="h-3 rounded-full skeleton-shimmer w-11/12" />
        <div className="h-3 rounded-full skeleton-shimmer w-7/12" />
      </div>

      <p className="mt-8 text-center text-cream/60 text-sm font-serif-elegant italic">
        Ohana está preparando tu clase del día…
      </p>
    </div>
  );
};
