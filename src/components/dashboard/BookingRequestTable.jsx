import { useState } from 'react';
import { Trash2, Edit2, Plus, Calendar, Building2, Clock, AlertCircle } from 'lucide-react';
import { deleteEvent } from '../../services/eventService';
import { cancelBookingRequest } from '../../services/bookingService';
import StatusBadge from '../StatusBadge';

import { formatDate } from '../../lib/utils';

export default function BookingRequestTable({ bookings, loading, onEdit, showRepInfo = false }) {
  const [deleting, setDeleting] = useState(null);
  const [canceling, setCanceling] = useState(null);

  const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setCanceling(id);
      try {
        await cancelBookingRequest(id);
      } catch (err) {
        console.error(err);
      } finally {
        setCanceling(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-grape-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="w-16 h-16 rounded-3xl bg-petal-50 dark:bg-grape-800 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-7 h-7 text-petal-300 dark:text-grape-600" />
        </div>
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No booking requests yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Your hall booking requests will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {bookings.map(booking => (
        <div key={booking.id}
          className="p-4 rounded-2xl bg-white/50 dark:bg-grape-900/40 border border-petal-100/40 dark:border-grape-700/30 hover:border-petal-200 dark:hover:border-grape-600 transition-all"
        >
          <div className="flex flex-wrap items-start gap-3 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-bold text-sm text-gray-900 dark:text-gray-50 truncate">{booking.eventName}</p>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{booking.hallName}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(booking.date)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.startTime}–{booking.endTime}</span>
                {showRepInfo && <span className="text-petal-600 dark:text-petal-400 font-medium">{booking.clubName}</span>}
              </div>
              {booking.reviewNote && (
                <div className="mt-2 flex items-start gap-1.5 text-xs">
                  <AlertCircle className="w-3 h-3 text-sand-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sand-700 dark:text-sand-400">{booking.reviewNote}</span>
                </div>
              )}
              {booking.status !== 'cancelled' && !showRepInfo && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleCancel(booking.id)} disabled={canceling === booking.id}
                    className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors">
                    {canceling === booking.id ? 'Canceling...' : 'Cancel Booking'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
