export function ClubCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white/60 dark:bg-grape-800/50 border border-white/70 dark:border-grape-700/40 shadow-card animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-grape-700" />
      <div className="p-4 pt-6">
        <div className="h-4 bg-gray-200 dark:bg-grape-700 rounded-full w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 dark:bg-grape-800 rounded-full w-1/2 mb-4" />
        <div className="flex gap-1.5 mb-4">
          <div className="h-5 w-16 bg-gray-100 dark:bg-grape-800 rounded-full" />
          <div className="h-5 w-12 bg-gray-100 dark:bg-grape-800 rounded-full" />
        </div>
        <div className="h-3 bg-gray-100 dark:bg-grape-800 rounded-full w-full mb-1" />
        <div className="h-3 bg-gray-100 dark:bg-grape-800 rounded-full w-2/3" />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white/60 dark:bg-grape-800/50 border border-white/70 dark:border-grape-700/40 shadow-card animate-pulse">
      <div className="h-44 bg-gray-200 dark:bg-grape-700" />
      <div className="p-4">
        <div className="h-3 bg-gray-200 dark:bg-grape-700 rounded-full w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-grape-700 rounded-full w-3/4 mb-1" />
        <div className="h-4 bg-gray-100 dark:bg-grape-800 rounded-full w-1/2 mb-3" />
        <div className="space-y-1.5 mt-4">
          <div className="h-3 bg-gray-100 dark:bg-grape-800 rounded-full w-full" />
          <div className="h-3 bg-gray-100 dark:bg-grape-800 rounded-full w-3/4" />
          <div className="h-3 bg-gray-100 dark:bg-grape-800 rounded-full w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function HallCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white/60 dark:bg-grape-800/50 border border-white/70 dark:border-grape-700/40 shadow-card animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-grape-700" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-grape-700 rounded-full w-2/3 mb-3" />
        <div className="flex flex-wrap gap-1.5 mb-4">
          {[1,2,3].map(i => <div key={i} className="h-5 w-16 bg-gray-100 dark:bg-grape-800 rounded-full" />)}
        </div>
        <div className="h-10 bg-gray-200 dark:bg-grape-700 rounded-2xl mt-4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 dark:bg-grape-700 rounded-full" style={{ width: `${60 + (i * 10) % 30}%` }} />
        </td>
      ))}
    </tr>
  );
}
