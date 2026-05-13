import { useState } from 'react';
import { Building2, CheckCircle2, Info, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHalls } from '../hooks/useHalls';
import { useAuth } from '../context/AuthContext';
import { HallCardSkeleton } from '../components/LoadingSkeleton';
import { createBookingRequest, validateDate } from '../services/bookingService';
import HallCard from '../components/HallCard';
import Modal from '../components/Modal';
import { clubs as seedClubs } from '../data/clubs';

function BookingForm({ hall, onClose }) {
  const { user, profile, clubId } = useAuth();
  const [form, setForm] = useState({ eventName: '', date: '', startTime: '', endTime: '', attendees: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const dateCheck = validateDate(form.date);
    if (!dateCheck.valid) { setError(dateCheck.error); return; }
    if (!form.startTime || !form.endTime) { setError('Start and end time are required.'); return; }
    if (form.startTime >= form.endTime)   { setError('End time must be after start time.'); return; }

    setSubmitting(true);
    try {
      await createBookingRequest({
        hallId:    hall.id,
        hallName:  hall.name,
        clubId:    clubId || 'unknown',
        clubName:  profile?.clubName || 'My Club',
        repId:     user.uid,
        repName:   profile?.displayName || user.email,
        eventName: form.eventName,
        date:      form.date,
        startTime: form.startTime,
        endTime:   form.endTime,
        attendees: form.attendees,
        notes:     form.notes,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-mint-400 to-sky-400 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-2">Request Submitted!</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Booking request for <span className="font-semibold text-petal-600">{hall.name}</span> sent.
        </p>
        <p className="text-xs text-gray-400 mb-6">You'll be notified when an authority reviews your request.</p>
        <div className="p-4 rounded-2xl bg-petal-50/60 dark:bg-grape-800/50 border border-petal-100/60 dark:border-grape-700/40 text-left text-xs space-y-2 mb-6">
          {[['Hall', hall.name], ['Date', form.date], ['Time', `${form.startTime} – ${form.endTime}`], ['Status', 'Pending review']].map(([k, v]) => (
            <div key={k} className="flex gap-3 text-gray-600 dark:text-gray-400">
              <span className="font-semibold w-14 text-gray-500 flex-shrink-0">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-secondary">Close</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-petal-50/60 dark:bg-grape-800/60 border border-petal-100/60 dark:border-grape-700/40 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petal-400 to-bloom-400 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{hall.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{hall.location} · Capacity: {hall.capacity}</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-sand-50/60 dark:bg-sand-900/20 border border-sand-200/50 dark:border-sand-800/30">
        <AlertTriangle className="w-4 h-4 text-sand-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sand-700 dark:text-sand-400">Only future dates allowed. Same-day and past bookings are blocked.</p>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-bloom-50 dark:bg-bloom-900/20 border border-bloom-200 dark:border-bloom-800 text-xs text-bloom-700 dark:text-bloom-300">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Event / Purpose *</label>
        <input name="eventName" value={form.eventName} onChange={handleChange} required placeholder="e.g. Annual Hackathon 2025" className="input-base" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Date * <span className="text-gray-400 font-normal">(must be tomorrow or later)</span></label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required min={minDateStr} className="input-base" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Start Time *</label>
          <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required className="input-base" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">End Time *</label>
          <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required className="input-base" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Expected Attendees</label>
        <input type="number" name="attendees" value={form.attendees} onChange={handleChange} placeholder={`Max: ${hall.capacity}`} max={hall.capacity} min="1" className="input-base" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Additional Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Special requirements or setup notes…" className="input-base resize-none" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-petal-500 to-bloom-500 text-white text-sm font-bold shadow-petal hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : <><Send className="w-4 h-4" /> Submit Request</>}
        </button>
      </div>
    </form>
  );
}

export default function HallBookingPage() {
  const { halls, loading } = useHalls();
  const [selectedHall, setSelectedHall] = useState(null);
  const [filterAvailable, setFilterAvailable] = useState(false);

  const displayedHalls = filterAvailable ? halls.filter(h => h.isAvailable !== false) : halls;
  const availableCount = halls.filter(h => h.isAvailable !== false).length;

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="blob w-72 h-72 -top-16 right-0 bg-petal-100 dark:bg-petal-900/20" />
        <div className="blob w-56 h-56 top-4 left-1/3 bg-mint-100/60 dark:bg-mint-900/15 opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
            <div>
              <span className="section-label mb-2 block"><Building2 className="w-3.5 h-3.5 inline mr-1" />Venues</span>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-gray-50 leading-tight">
                Hall<br /><span className="text-gradient">Booking</span>
              </h1>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-mint-50/80 dark:bg-mint-900/20 border border-mint-200/60 dark:border-mint-800/30">
              <span className="w-2 h-2 rounded-full bg-mint-400 animate-pulse" />
              <span className="text-sm font-bold text-mint-700 dark:text-mint-400">{availableCount}/{halls.length} available</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass flex items-start gap-3 mb-5">
            <Info className="w-4 h-4 text-petal-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-bold text-petal-600 dark:text-petal-400">Booking Flow:</span>{' '}
              You submit a request → Authority approves → Booking confirmed. No same-day or past bookings.
            </p>
          </div>

          <div className="flex gap-2">
            {['All Halls', 'Available Only'].map((label, i) => (
              <button key={label} onClick={() => setFilterAvailable(i === 1)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                  filterAvailable === (i === 1)
                    ? 'bg-petal-600 text-white border-petal-600 shadow-petal'
                    : 'bg-white/60 dark:bg-grape-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 border-petal-200/60 dark:border-grape-600/40'
                }`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-petal-200 dark:via-grape-700 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <HallCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedHalls.map((hall, i) => (
              <motion.div key={hall.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <HallCard hall={hall} onRequestBooking={setSelectedHall} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedHall} onClose={() => setSelectedHall(null)} title="Request Hall Booking" size="md">
        {selectedHall && <BookingForm hall={selectedHall} onClose={() => setSelectedHall(null)} />}
      </Modal>
    </div>
  );
}
