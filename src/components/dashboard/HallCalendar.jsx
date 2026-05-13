import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useHallBookings } from '../../hooks/useBookings';
import { useHalls } from '../../hooks/useHalls';
import StatusBadge from '../StatusBadge';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function HallCalendar() {
  const today  = new Date();
  const [view, setView]       = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedHall, setSelectedHall] = useState('all');
  const [selectedDay, setSelectedDay]   = useState(null);

  const { halls } = useHalls();
  const { bookings, loading } = useHallBookings(selectedHall === 'all' ? null : selectedHall);

  // Build a map: dateStr → [bookings]
  const bookingsByDate = useMemo(() => {
    const map = {};
    for (const b of bookings) {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    }
    return map;
  }, [bookings]);

  const daysInMonth  = getDaysInMonth(view.year, view.month);
  const firstWeekday = getFirstDayOfMonth(view.year, view.month);

  const prevMonth = () => setView(v => {
    const d = new Date(v.year, v.month - 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const nextMonth = () => setView(v => {
    const d = new Date(v.year, v.month + 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const selectedDateStr = selectedDay
    ? `${view.year}-${String(view.month + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`
    : null;
  const selectedBookings = selectedDateStr ? (bookingsByDate[selectedDateStr] || []) : [];

  const getDayClass = (dayNum) => {
    const dateStr = `${view.year}-${String(view.month + 1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
    const dayBookings = bookingsByDate[dateStr] || [];
    const isToday = dateStr === toDateStr(today);
    const isSelected = dayNum === selectedDay;
    const hasApproved = dayBookings.some(b => b.status === 'approved');
    const hasPending  = dayBookings.some(b => b.status === 'pending');

    let bg = 'hover:bg-petal-50 dark:hover:bg-grape-800';
    if (isSelected) bg = 'bg-petal-600 text-white';
    else if (isToday) bg = 'bg-petal-100 dark:bg-petal-900/30 text-petal-700 dark:text-petal-300 font-bold';
    else if (hasApproved) bg = 'bg-mint-50 dark:bg-mint-900/20 hover:bg-mint-100';
    else if (hasPending) bg = 'bg-sand-50 dark:bg-sand-900/20 hover:bg-sand-100';

    return `relative flex flex-col items-center justify-start p-1.5 rounded-xl cursor-pointer transition-all text-sm ${bg}`;
  };

  return (
    <div className="space-y-4">
      {/* Hall filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Hall:</span>
        {[{ id: 'all', name: 'All Halls' }, ...halls].map(h => (
          <button key={h.id} onClick={() => setSelectedHall(h.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              selectedHall === h.id
                ? 'bg-petal-600 text-white border-petal-600'
                : 'bg-white/60 dark:bg-grape-800/50 text-gray-600 dark:text-gray-400 border-petal-200/60 dark:border-grape-700/40 hover:border-petal-400'
            }`}>{h.name}</button>
        ))}
      </div>

      {/* Calendar header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50">
            {MONTHS[view.month]} {view.year}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-petal-50 dark:hover:bg-grape-800 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-petal-50 dark:hover:bg-grape-800 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstWeekday }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = `${view.year}-${String(view.month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const dayBookings = bookingsByDate[dateStr] || [];
            return (
              <div key={day} className={getDayClass(day)} onClick={() => setSelectedDay(day === selectedDay ? null : day)}>
                <span className="text-xs">{day}</span>
                {dayBookings.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {dayBookings.slice(0, 3).map((b, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${
                        b.status === 'approved' ? 'bg-mint-500' :
                        b.status === 'pending'  ? 'bg-sand-400' : 'bg-bloom-400'
                      }`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-petal-100/40 dark:border-grape-700/40">
          {[['bg-mint-500', 'Approved'], ['bg-sand-400', 'Pending'], ['bg-bloom-400', 'Other']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} /> {label}
            </div>
          ))}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="glass-card p-4">
          <h4 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-petal-500" />
            {MONTHS[view.month]} {selectedDay}, {view.year}
          </h4>
          {selectedBookings.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No bookings on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-grape-900/40 border border-petal-100/40 dark:border-grape-700/30">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{b.eventName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{b.clubName} · {b.hallName} · {b.startTime}–{b.endTime}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
