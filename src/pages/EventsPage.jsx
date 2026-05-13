import { useState, useMemo } from 'react';
import { CalendarDays, Flame, Clock, Star, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { events, todayEvents, upcomingEvents, featuredEvents } from '../data/events';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';

const categories = ['All', 'Hackathon', 'Performance', 'Competition', 'Workshop', 'Theatre', 'Sports', 'Literary'];

function SectionHeader({ icon: Icon, label, color, count }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h2 className="font-display font-700 text-lg text-gray-900 dark:text-gray-50">{label}</h2>
        {count !== undefined && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{count} event{count !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return events.filter(event => {
      const matchSearch =
        !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.clubName.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || event.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const filteredToday = filtered.filter(e => e.isToday);
  const filteredFeatured = filtered.filter(e => e.isFeatured && !e.isToday);
  const filteredUpcoming = filtered.filter(e => !e.isToday && !e.isFeatured);

  const isFiltering = search || activeCategory !== 'All';

  return (
    <div className="min-h-screen pt-16 bg-sand-50 dark:bg-charcoal-950">
      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-sand-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl mb-6">
            <h1 className="font-display font-700 text-3xl sm:text-4xl text-gray-900 dark:text-gray-50 mb-2">
              Campus Events
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Stay up to date with everything happening around campus
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by event name, club, or venue…"
              className="flex-1 max-w-md"
            />
            {isFiltering && (
              <button
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-sand-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-600 transition-all bg-white dark:bg-charcoal-800"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white dark:bg-charcoal-800 text-gray-600 dark:text-gray-400 border-sand-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-sand-100 dark:bg-charcoal-800 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-7 h-7 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="font-display font-700 text-gray-900 dark:text-gray-50 mb-2">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn-secondary mt-4">
              Reset filters
            </button>
          </div>
        )}

        {/* Today's Events */}
        {filteredToday.length > 0 && (
          <section>
            <SectionHeader
              icon={Flame}
              label="Today's Events"
              color="bg-rose-50 dark:bg-rose-900/30 text-rose-500"
              count={filteredToday.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredToday.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Events */}
        {filteredFeatured.length > 0 && (
          <section>
            <SectionHeader
              icon={Star}
              label="Featured Events"
              color="bg-amber-50 dark:bg-amber-900/30 text-amber-500"
              count={filteredFeatured.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFeatured.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {filteredUpcoming.length > 0 && (
          <section>
            <SectionHeader
              icon={CalendarDays}
              label="Upcoming Events"
              color="bg-teal-50 dark:bg-teal-900/30 text-teal-500"
              count={filteredUpcoming.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUpcoming.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
