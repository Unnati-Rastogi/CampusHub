import { useState, useMemo } from 'react';
import { CalendarDays, Flame, Star, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvents } from '../hooks/useEvents';
import { EventCardSkeleton } from '../components/LoadingSkeleton';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';

const categories = ['All', 'Hackathon', 'Performance', 'Competition', 'Workshop', 'Theatre', 'Sports', 'Literary'];

function SectionHeader({ icon: Icon, label, color, count }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color} shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="font-display font-bold text-xl text-gray-900 dark:text-gray-50">{label}</h2>
        {count !== undefined && <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{count} event{count !== 1 ? 's' : ''}</p>}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const [search, setSearch]        = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => events.filter(event => {
    const matchSearch = !search ||
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.clubName?.toLowerCase().includes(search.toLowerCase()) ||
      event.venue?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || event.category === activeCategory;
    return matchSearch && matchCat;
  }), [events, search, activeCategory]);

  const filteredToday    = filtered.filter(e => e.isToday);
  const filteredFeatured = filtered.filter(e => e.isFeatured && !e.isToday);
  const filteredUpcoming = filtered.filter(e => !e.isToday && !e.isFeatured);
  const isFiltering = search || activeCategory !== 'All';

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="blob w-72 h-72 -top-16 right-0 bg-bloom-100 dark:bg-bloom-900/20" />
        <div className="blob w-56 h-56 top-8 left-1/4 bg-petal-100 dark:bg-petal-900/20 opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-8">
          <div className="max-w-2xl mb-8">
            <span className="section-label mb-2 block"><CalendarDays className="w-3.5 h-3.5 inline mr-1" />What's on</span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-gray-50 leading-tight mb-2">
              Campus<br /><span className="text-gradient">Events</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Stay in the loop with everything happening around you</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <SearchBar value={search} onChange={setSearch} placeholder="Search events, clubs, or venues…" className="flex-1 max-w-md" />
            {isFiltering && (
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-grape-800/60 backdrop-blur-sm border border-petal-200 dark:border-grape-600 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:border-bloom-400 hover:text-bloom-600 transition-all">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-petal-600 text-white border-petal-600 shadow-petal'
                    : 'bg-white/60 dark:bg-grape-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 border-petal-200/60 dark:border-grape-600/40 hover:border-petal-400 hover:text-petal-700 dark:hover:text-petal-300'
                }`}>{cat}</button>
            ))}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-petal-200 dark:via-grape-700 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 space-y-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-petal-50 dark:bg-grape-800 flex items-center justify-center mx-auto mb-5">
              <SlidersHorizontal className="w-8 h-8 text-petal-300 dark:text-grape-600" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-gray-50 mb-2">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn-primary">Reset</button>
          </div>
        ) : (
          <>
            {filteredToday.length > 0 && (
              <section>
                <SectionHeader icon={Flame} label="Today's Events" color="bg-gradient-to-br from-bloom-400 to-sand-400 text-white" count={filteredToday.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredToday.map((event, i) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            {filteredFeatured.length > 0 && (
              <section>
                <SectionHeader icon={Star} label="Featured Events" color="bg-gradient-to-br from-sand-400 to-bloom-400 text-white" count={filteredFeatured.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredFeatured.map((event, i) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            {filteredUpcoming.length > 0 && (
              <section>
                <SectionHeader icon={CalendarDays} label="Upcoming Events" color="bg-gradient-to-br from-petal-400 to-sky-400 text-white" count={filteredUpcoming.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredUpcoming.map((event, i) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
