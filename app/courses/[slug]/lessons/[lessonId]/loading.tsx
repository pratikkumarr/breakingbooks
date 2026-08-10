export default function Loading() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 pt-8 animate-pulse">
      <div className="mb-6 h-5 w-32 bg-surface rounded" />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="aspect-video w-full rounded-xl bg-surface border border-border" />

          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="h-8 w-64 bg-background rounded-md" />
            <div className="h-11 w-40 bg-background rounded-md" />
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="h-6 w-32 bg-background rounded-md mb-4" />
            <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-background">
              <div className="w-10 h-10 rounded bg-surface border border-border" />
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-24 bg-surface rounded" />
                <div className="h-3 w-16 bg-surface rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
