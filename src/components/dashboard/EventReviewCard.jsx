import { useState } from 'react';
import { CheckCircle2, XCircle, Calendar, MessageSquare, Loader2, Info } from 'lucide-react';
import { updateEvent } from '../../services/eventService';
import StatusBadge from '../StatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/utils';

export default function EventReviewCard({ event }) {
  const [note, setNote] = useState(event.statusMessage || '');
  const [showNote, setShowNote] = useState(false);
  const [processing, setProcessing] = useState(null);
  const toast = useToast();

  const handle = async (status) => {
    if (status === 'rejected' && !note.trim()) {
      toast.warning('Note Required', 'Please provide a reason for rejecting the event.');
      setShowNote(true);
      return;
    }

    setProcessing(status);
    try {
      await updateEvent(event.id, { status, statusMessage: note.trim() });
      if (status === 'approved') {
        toast.success('Event Approved', `"${event.title}" is now public.`);
      } else {
        toast.warning('Event Rejected', `"${event.title}" has been rejected.`);
      }
    } catch (err) {
      toast.error('Action Failed', err.message || 'Could not update event status.');
    } finally {
      setProcessing(null);
      if (status === 'approved') {
        setNote('');
        setShowNote(false);
      }
    }
  };

  const isPending = event.status === 'pending' || !event.status;

  return (
    <div className={`p-5 rounded-3xl border transition-all ${
      isPending
        ? 'bg-white/60 dark:bg-grape-800/60 border-petal-100/60 dark:border-grape-700/40 shadow-card'
        : 'bg-white/30 dark:bg-grape-900/30 border-white/40 dark:border-grape-700/20 opacity-80'
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display font-bold text-base text-gray-900 dark:text-gray-50">{event.title}</h3>
            <StatusBadge status={event.status || 'approved'} />
          </div>
          <p className="text-sm text-petal-600 dark:text-petal-400 font-semibold">{event.clubName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {[
          [Calendar, 'Date', formatDate(event.date)],
          [Info, 'Category', event.category],
          [Info, 'Venue', event.venue || '—'],
        ].map(([Icon, label, value]) => (
          <div key={label} className="p-2.5 rounded-xl bg-petal-50/60 dark:bg-grape-900/40">
            <div className="flex items-center gap-1 mb-0.5">
              <Icon className="w-3 h-3 text-petal-400" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{value}</p>
          </div>
        ))}
      </div>

      {event.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 p-2.5 rounded-xl bg-gray-50 dark:bg-grape-900/40 line-clamp-2">
          {event.description}
        </p>
      )}

      {event.statusMessage && !isPending && (
        <p className="text-xs text-sand-700 dark:text-sand-400 mb-3">
          <span className="font-semibold">Review note:</span> {event.statusMessage}
        </p>
      )}

      {isPending && (
        <div className="space-y-3">
          {showNote && (
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Review Note (required for rejection)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Add a note for the club rep…"
                className="input-base resize-none text-xs"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowNote(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-grape-800 transition-all">
              <MessageSquare className="w-3.5 h-3.5" /> {showNote ? 'Hide note' : 'Add note'}
            </button>
            <button onClick={() => handle('rejected')} disabled={!!processing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-bloom-50 dark:bg-bloom-900/20 text-bloom-700 dark:text-bloom-300 border border-bloom-200 dark:border-bloom-800 hover:bg-bloom-100 transition-all disabled:opacity-60">
              {processing === 'rejected' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
              Reject
            </button>
            <button onClick={() => handle('approved')} disabled={!!processing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-mint-50 dark:bg-mint-900/20 text-mint-700 dark:text-mint-300 border border-mint-200 dark:border-mint-800 hover:bg-mint-100 transition-all disabled:opacity-60">
              {processing === 'approved' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
