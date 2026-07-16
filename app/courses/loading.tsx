export default function Loading() {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-8 pt-20 animate-pulse">
      <div className="mb-10">
        <div className="h-10 w-48 bg-surface rounded-md mb-4" />
        <div className="h-6 w-96 bg-surface rounded-md" />
      </div>
      <div className="h-[72px] mb-8 bg-surface rounded-lg w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col bg-surface border border-border rounded-lg p-6 h-[340px]">
            <div className="w-full aspect-video bg-background rounded-md mb-4" />
            <div className="h-6 w-3/4 bg-background rounded-md mb-4" />
            <div className="h-4 w-full bg-background rounded-md mb-2" />
            <div className="h-4 w-2/3 bg-background rounded-md mb-6" />
            <div className="mt-auto h-5 w-24 bg-background rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
