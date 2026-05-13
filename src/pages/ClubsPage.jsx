import { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { clubs } from '../data/clubs';
import ClubCard from '../components/ClubCard';
import SearchBar from '../components/SearchBar';
import TagBadge from '../components/TagBadge';

const allTags = ['Coding', 'Robotics', 'Photography', 'Dance', 'Music', 'Sports', 'Acting', 'Literature', 'Performing Arts', 'Engineering', 'Writing'];

export default function ClubsPage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const filtered = useMemo(() => {
    return clubs.filter(club => {
      const matchSearch =
        !search ||
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description.toLowerCase().includes(search.toLowerCase()) ||
        club.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchTag = !activeTag || club.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [search, activeTag]);

  return (
    <div className="min-h-screen pt-16 bg-sand-50 dark:bg-charcoal-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-sand-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            <h1 className="font-display font-700 text-3xl sm:text-4xl text-gray-900 dark:text-gray-50 mb-2">
              Club Directory
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {clubs.length} clubs · Find your community and start exploring
            </p>
          </div>

          {/* Search + Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search clubs by name, tag, or interest…"
              className="flex-1 max-w-md"
            />
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-sand-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-600 transition-all bg-white dark:bg-charcoal-800"
              >
                <X className="w-4 h-4" />
                Clear filter
              </button>
            )}
          </div>

          {/* Tag filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                    : 'bg-white dark:bg-charcoal-800 text-gray-600 dark:text-gray-400 border-sand-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-sand-100 dark:bg-charcoal-800 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-7 h-7 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="font-display font-700 text-gray-900 dark:text-gray-50 mb-2">No clubs found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try adjusting your search or clearing the filter
            </p>
            <button
              onClick={() => { setSearch(''); setActiveTag(null); }}
              className="btn-secondary mt-4"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Showing {filtered.length} {filtered.length === 1 ? 'club' : 'clubs'}
              {activeTag && <> tagged <span className="font-medium text-gray-700 dark:text-gray-300">"{activeTag}"</span></>}
              {search && <> for <span className="font-medium text-gray-700 dark:text-gray-300">"{search}"</span></>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((club, i) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
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
