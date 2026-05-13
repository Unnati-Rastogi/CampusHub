import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { clubs } from '../data/clubs';
import ClubCard from '../components/ClubCard';
import SearchBar from '../components/SearchBar';

const allTags = ['Coding', 'Robotics', 'Photography', 'Dance', 'Music', 'Sports', 'Acting', 'Literature', 'Performing Arts', 'Engineering', 'Writing'];

export default function ClubsPage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const filtered = useMemo(() => {
    return clubs.filter(club => {
      const matchSearch = !search ||
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description.toLowerCase().includes(search.toLowerCase()) ||
        club.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchTag = !activeTag || club.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [search, activeTag]);

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="blob w-80 h-80 -top-20 -right-20 bg-petal-200 dark:bg-petal-900/30 opacity-60" />
        <div className="blob w-64 h-64 top-0 left-1/3 bg-bloom-100 dark:bg-bloom-900/20 opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-8">
          <div className="max-w-2xl mb-8">
            <span className="section-label mb-2 block">
              <Users className="w-3.5 h-3.5" /> {clubs.length} clubs
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-gray-50 leading-tight mb-2">
              Find your<br />
              <span className="text-gradient">community</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              From hackathons to dance stages — there's a club for every passion.
            </p>
          </div>

          {/* Search + clear */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name, tag, or interest…"
              className="flex-1 max-w-md"
            />
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl
                  bg-white/60 dark:bg-grape-800/60 backdrop-blur-sm
                  border border-petal-200 dark:border-grape-600
                  text-sm font-semibold text-gray-600 dark:text-gray-400
                  hover:border-bloom-400 hover:text-bloom-600 transition-all"
              >
                <X className="w-4 h-4" /> Clear "{activeTag}"
              </button>
            )}
          </div>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-petal-600 text-white border-petal-600 shadow-petal'
                    : 'bg-white/60 dark:bg-grape-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 border-petal-200/60 dark:border-grape-600/40 hover:border-petal-400 hover:text-petal-700 dark:hover:text-petal-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Subtle bottom border */}
        <div className="h-px bg-gradient-to-r from-transparent via-petal-200 dark:via-grape-700 to-transparent" />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-petal-50 dark:bg-grape-800 flex items-center justify-center mx-auto mb-5 shadow-petal">
              <SlidersHorizontal className="w-8 h-8 text-petal-300 dark:text-grape-600" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-gray-50 mb-2">No clubs found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Try adjusting your search or filter</p>
            <button onClick={() => { setSearch(''); setActiveTag(null); }} className="btn-primary">Reset filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 font-medium">
              {filtered.length} {filtered.length === 1 ? 'club' : 'clubs'}
              {activeTag && <> · <span className="text-petal-600 dark:text-petal-400">{activeTag}</span></>}
              {search && <> · "{search}"</>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((club, i) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                >
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
