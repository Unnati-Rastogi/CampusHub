import { useState } from 'react';
import { Building2, CheckCircle2, XCircle, CalendarDays, Clock, Info, Send, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { halls } from '../data/halls';
import { clubs } from '../data/clubs';
import HallCard from '../components/HallCard';
import Modal from '../components/Modal';

function BookingForm({ hall, onClose }) {
  const [form, setForm] = useState({
    club: '',
    event: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-teal-500" />
        </div>
        <h3 className="font-display font-700 text-xl text-gray-900 dark:text-gray-50 mb-2">Request Submitted!</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Your booking request for <span className="font-medium text-gray-700 dark:text-gray-300">{hall.name}</span> has been sent.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          You'll receive a notification once a teacher/authority reviews your request.
        </p>
        <div className="p-3 rounded-xl bg-sand-50 dark:bg-charcoal-800 border border-sand-100 dark:border-gray-700 text-left text-xs space-y-1.5 mb-6">
          <div className="flex gap-2 text-gray-600 dark:text-gray-400">
            <span className="font-medium w-20 flex-shrink-0">Club:</span>
            <span>{form.club || 'Your Club'}</span>
          </div>
          <div className="flex gap-2 text-gray-600 dark:text-gray-400">
            <span className="font-medium w-20 flex-shrink-0">Hall:</span>
            <span>{hall.name}</span>
          </div>
          <div className="flex gap-2 text-gray-600 dark:text-gray-400">
            <span className="font-medium w-20 flex-shrink-0">Date:</span>
            <span>{form.date}</span>
          </div>
          <div className="flex gap-2 text-gray-600 dark:text-gray-400">
            <span className="font-medium w-20 flex-shrink-0">Time:</span>
            <span>{form.startTime} – {form.endTime}</span>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hall info */}
      <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 flex items-center gap-3">
        <Building2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-teal-800 dark:text-teal-300">{hall.name}</p>
          <p className="text-xs text-teal-600 dark:text-teal-400">{hall.location} · Capacity: {hall.capacity}</p>
        </div>
      </div>

      {/* Warning */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          This is a mock UI. Booking requests require Teacher/Authority approval before confirmation.
        </p>
      </div>

      {/* Club */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Club Name *</label>
        <select
          name="club"
          value={form.club}
          onChange={handleChange}
          required
          className="input-base"
        >
          <option value="">Select your club</option>
          {clubs.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Event Name */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Event / Purpose *</label>
        <input
          name="event"
          value={form.event}
          onChange={handleChange}
          required
          placeholder="e.g. Annual Hackathon 2025"
          className="input-base"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date *</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="input-base"
        />
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Time *</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="input-base"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Time *</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className="input-base"
          />
        </div>
      </div>

      {/* Expected Attendees */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expected Attendees</label>
        <input
          type="number"
          name="attendees"
          value={form.attendees}
          onChange={handleChange}
          placeholder={`Max capacity: ${hall.capacity}`}
          max={hall.capacity}
          className="input-base"
        />
      </div>

      {/* Additional info */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Additional Notes</label>
        <textarea
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          rows={3}
          placeholder="Any special requirements or notes for the booking authority…"
          className="input-base resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" className="btn-primary flex-1">
          <Send className="w-4 h-4" />
          Submit Request
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
    <div className="min-h-screen pt-16 bg-sand-50 dark:bg-charcoal-950">
      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-sand-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="font-display font-700 text-3xl sm:text-4xl text-gray-900 dark:text-gray-50 mb-2">
                Hall Booking
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Browse available halls and auditoriums. Request a booking for your club event.
              </p>
            </div>

            {/* Availability Summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-sm text-teal-700 dark:text-teal-400 font-medium">
                  {availableCount} of {halls.length} available
                </span>
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div className="mt-5 p-4 rounded-xl bg-sand-50 dark:bg-charcoal-800 border border-sand-100 dark:border-gray-700 flex items-start gap-3">
            <Info className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-medium">Booking Flow:</span> Club Representative submits a request → Teacher/Authority reviews and approves → Booking is confirmed. Students cannot access or submit booking requests.
            </p>
          </div>

          {/* Filter */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilterAvailable(false)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                !filterAvailable
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white dark:bg-charcoal-800 text-gray-600 dark:text-gray-400 border-sand-200 dark:border-gray-700'
              }`}
            >
              All Halls
            </button>
            <button
              onClick={() => setFilterAvailable(true)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filterAvailable
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white dark:bg-charcoal-800 text-gray-600 dark:text-gray-400 border-sand-200 dark:border-gray-700'
              }`}
            >
              Available Only
            </button>
          </div>
        </div>
      </div>

      {/* Hall Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedHalls.map((hall, i) => (
            <motion.div
              key={hall.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <HallCard hall={hall} onRequestBooking={setSelectedHall} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={!!selectedHall}
        onClose={() => setSelectedHall(null)}
        title="Request Hall Booking"
        size="md"
      >
        {selectedHall && (
          <BookingForm hall={selectedHall} onClose={() => setSelectedHall(null)} />
        )}
      </Modal>
    </div>
  );
}
