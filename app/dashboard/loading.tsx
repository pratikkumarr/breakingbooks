export default function Loading() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-8 pt-20 animate-pulse">
      <div className="mb-10">
        <div className="h-10 w-48 bg-surface rounded-md mb-4" />
        <div className="h-6 w-64 bg-surface rounded-md" />
      </div>
      <div className="bg-surface border border-border rounded-lg p-6 h-[400px]" />
    </div>
  );
}
