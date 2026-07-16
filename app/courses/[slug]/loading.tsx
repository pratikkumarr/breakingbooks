export default function Loading() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-8 pt-20 animate-pulse">
      <div className="bg-surface border border-border rounded-lg p-8 mb-8">
        <div className="w-full aspect-video mb-6 rounded-md bg-background" />
        <div className="h-10 w-3/4 bg-background rounded-md mb-6" />
        <div className="h-4 w-full bg-background rounded-md mb-3" />
        <div className="h-4 w-full bg-background rounded-md mb-3" />
        <div className="h-4 w-2/3 bg-background rounded-md mb-8" />
        <div className="h-10 w-32 bg-background rounded-md" />
      </div>
      
      <div>
        <div className="h-8 w-48 bg-surface rounded-md mb-6" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 bg-surface border border-border rounded-lg p-4 h-16">
              <div className="w-8 h-8 rounded-full bg-background" />
              <div className="h-5 w-64 bg-background rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
