import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentEventCalendar({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);

  const { days, monthName, year } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const days = [];
    // Padding before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      days.push({ day: i, dateStr, events: dayEvents });
    }

    return { days, monthName, year };
  }, [currentDate, events]);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-card p-4 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-50 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-petal-500" />
          {monthName} {year}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-gray-50 dark:bg-grape-900/40 hover:bg-gray-100 dark:hover:bg-grape-800 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-gray-50 dark:bg-grape-900/40 hover:bg-gray-100 dark:hover:bg-grape-800 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((dayObj, i) => {
          if (!dayObj) return <div key={`empty-${i}`} className="h-16 sm:h-24 rounded-2xl bg-gray-50/50 dark:bg-grape-900/10" />;
          
          const hasEvents = dayObj.events.length > 0;
          const isToday = dayObj.dateStr === new Date().toISOString().split('T')[0];

          return (
            <button
              key={dayObj.day}
              onClick={() => hasEvents && setSelectedDateEvents({ dateStr: dayObj.dateStr, events: dayObj.events })}
              className={`relative h-16 sm:h-24 rounded-2xl p-1 sm:p-2 border transition-all flex flex-col items-start justify-start ${
                hasEvents
                  ? 'bg-petal-50/50 dark:bg-petal-900/10 border-petal-200 dark:border-petal-800/40 hover:bg-petal-100 dark:hover:bg-petal-900/30 hover:border-petal-300 dark:hover:border-petal-700 cursor-pointer'
                  : 'bg-white/40 dark:bg-grape-800/20 border-transparent hover:bg-gray-50 dark:hover:bg-grape-800/40 cursor-default'
              } ${isToday ? 'ring-2 ring-petal-400 dark:ring-petal-600 ring-offset-2 dark:ring-offset-grape-900' : ''}`}
            >
              <span className={`text-xs sm:text-sm font-bold ${
                isToday ? 'text-petal-600 dark:text-petal-400' : 'text-gray-700 dark:text-gray-300'
              }`}>{dayObj.day}</span>
              
              {/* Event Dots */}
              <div className="mt-auto w-full flex flex-wrap gap-1">
                {dayObj.events.slice(0, 3).map((e, idx) => (
                  <div key={idx} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-petal-500 dark:bg-petal-400" />
                ))}
                {dayObj.events.length > 3 && (
                  <span className="text-[8px] sm:text-[10px] text-gray-500 leading-none">+{dayObj.events.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Events Modal */}
      <AnimatePresence>
        {selectedDateEvents && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-grape-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-grape-800">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50">
                  Events on {new Date(selectedDateEvents.dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                <button onClick={() => setSelectedDateEvents(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-grape-800 text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto space-y-4">
                {selectedDateEvents.events.map(event => (
                  <div key={event.id} className="p-4 rounded-2xl bg-petal-50/50 dark:bg-grape-800/40 border border-petal-100/50 dark:border-grape-700/50">
                    <p className="text-[10px] font-bold tracking-wider text-petal-500 uppercase mb-1">{event.category}</p>
                    <h4 className="font-bold text-gray-900 dark:text-gray-50 mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-petal-400" /> {event.time || 'Time TBD'}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-petal-400" /> {event.venue || 'Venue TBD'}</span>
                      <span className="flex items-center gap-1.5 mt-1 pt-1 border-t border-gray-200 dark:border-grape-700">Organized by {event.clubName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
