import { useState } from 'react';
import { Building2, CheckCircle2, Info, Send, AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { halls } from '../data/halls';
import { clubs } from '../data/clubs';
import HallCard from '../components/HallCard';
import Modal from '../components/Modal';

function BookingForm({ hall, onClose }) {
  const [form, setForm] = useState({ club: '', event: '', date: '', startTime: '', endTime: '', purpose: '', attendees: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  if (submitted) {
    return (
      <div className="text-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-mint-400 to-sky-400 flex items-center justify-center mx-auto mb-5 shadow-glow-mint"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-2">Request Submitted!</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Booking request for <span className="font-semibold text-petal-600">{hall.name}</span> sent successfully.
        </p>
        <p className="text-xs text-gray-400 mb-6">You'll be notified when a teacher reviews your request.</p>
        <div className="p-4 rounded-2xl bg-petal-50/60 dark:bg-grape-800/50 border border-petal-100/60 dark:border-grape-700/40 text-left text-xs space-y-2 mb-6">
          {[['Hall', hall.name], ['Club', form.club || '—'], ['Date', form.date || '—'], ['Time', `${form.startTime} – ${form.endTime}`]].map(([k, v]) => (
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
    <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
      {/* Hall info */}
      <div className="p-3.5 rounded-2xl bg-petal-50/60 dark:bg-grape-800/60 border border-petal-100/60 dark:border-grape-700/40 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petal-400 to-bloom-400 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{hall.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{hall.location} · Capacity: {hall.capacity}</p>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-sand-50/60 dark:bg-sand-900/20 border border-sand-200/50 dark:border-sand-800/30">
        <AlertTriangle className="w-4 h-4 text-sand-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sand-700 dark:text-sand-400">Requests require Teacher/Authority approval before confirmation.</p>
      </div>

      {/* Club */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Club Name *</label>
        <select name="club" value={form.club} onChange={handleChange} required className="input-base">
          <option value="">Select your club</option>
          {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Event name */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Event / Purpose *</label>
        <input name="event" value={form.event} onChange={handleChange} required placeholder="e.g. Annual Hackathon 2025" className="input-base" />
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Date *</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required className="input-base" />
      </div>

      {/* Time */}
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

      {/* Attendees */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Expected Attendees</label>
        <input type="number" name="attendees" value={form.attendees} onChange={handleChange} placeholder={`Max: ${hall.capacity}`} max={hall.capacity} className="input-base" />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Additional Notes</label>
        <textarea name="purpose" value={form.purpose} onChange={handleChange} rows={3} placeholder="Special requirements or notes…" className="input-base resize-none" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-petal-500 to-bloom-500 text-white text-sm font-bold shadow-petal hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200">
          <Send className="w-4 h-4" /> Submit Request
        </button>
      </div>
    </form>
  );
}

export default function HallBookingPage() {
  const [selectedHall, setSelectedHall] = useState(null);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const displayedHalls = filterAvailable ? halls.filter(h => h.isAvailable) : halls;
  const availableCount = halls.filter(h => h.isAvailable).length;

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="blob w-72 h-72 -top-16 right-0 bg-petal-100 dark:bg-petal-900/20" />
        <div className="blob w-56 h-56 top-4 left-1/3 bg-mint-100/60 dark:bg-mint-900/15 opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
            <div>
              <span className="section-label mb-2 block">
                <Building2 className="w-3.5 h-3.5" /> Venues
              </span>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-gray-50 leading-tight">
                Hall<br />
                <span className="text-gradient">Booking</span>
              </h1>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-mint-50/80 dark:bg-mint-900/20 border border-mint-200/60 dark:border-mint-800/30">
              <span className="w-2 h-2 rounded-full bg-mint-400 animate-pulse" />
              <span className="text-sm font-bold text-mint-700 dark:text-mint-400">
                {availableCount}/{halls.length} available
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-2xl glass flex items-start gap-3 mb-5">
            <Info className="w-4 h-4 text-petal-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-bold text-petal-600 dark:text-petal-400">Booking Flow:</span>{' '}
              Club Rep submits → Teacher/Authority approves → Booking confirmed. Students cannot access hall booking.
            </p>
          </div>

          {/* Filter toggle */}
          <div className="flex gap-2">
            {['All Halls', 'Available Only'].map((label, i) => (
              <button key={label} onClick={() => setFilterAvailable(i === 1)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                  filterAvailable === (i === 1)
                    ? 'bg-petal-600 text-white border-petal-600 shadow-petal'
                    : 'bg-white/60 dark:bg-grape-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 border-petal-200/60 dark:border-grape-600/40'
                }`}
              >{label}</button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-petal-200 dark:via-grape-700 to-transparent" />
      </div>

      {/* Hall grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedHalls.map((hall, i) => (
            <motion.div key={hall.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <HallCard hall={hall} onRequestBooking={setSelectedHall} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={!!selectedHall} onClose={() => setSelectedHall(null)} title="Request Hall Booking" size="md">
        {selectedHall && <BookingForm hall={selectedHall} onClose={() => setSelectedHall(null)} />}
      </Modal>
    </div>
  );
}
