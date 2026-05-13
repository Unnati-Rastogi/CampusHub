const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: 'bg-sand-100 dark:bg-sand-900/30',   text: 'text-sand-700 dark:text-sand-300',   dot: 'bg-sand-400'   },
  approved:  { label: 'Approved',  bg: 'bg-mint-100 dark:bg-mint-900/30',   text: 'text-mint-700 dark:text-mint-300',   dot: 'bg-mint-500'   },
  rejected:  { label: 'Rejected',  bg: 'bg-bloom-100 dark:bg-bloom-900/30', text: 'text-bloom-700 dark:text-bloom-300', dot: 'bg-bloom-500'  },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100 dark:bg-gray-800',      text: 'text-gray-500 dark:text-gray-400',  dot: 'bg-gray-400'   },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${textSize} ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
