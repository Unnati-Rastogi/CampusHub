import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, Flame, Star, Timer } from 'lucide-react';
import TagBadge from './TagBadge';

import { formatDate, formatTime } from '../lib/utils';

/**
 * Returns a human-readable countdown label for an event date string.
 * e.g. "Today", "Tomorrow", "In 3 days", "In 2h 15m"
 */
function useCountdown(dateStr) {
  return useMemo(() => {
    if (!dateStr) return null;
    const now = new Date();
    const eventDate = new Date(dateStr);
    if (isNaN(eventDate)) return null;

    const diffMs = eventDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) return null; // past events — no countdown

    if (diffDays === 0) {
      const diffH = Math.floor(diffMs / (1000 * 60 * 60));
      const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (diffH > 0) return `In ${diffH}h ${diffM}m`;
      if (diffM > 0) return `In ${diffM}m`;
      return 'Starting now';
    }
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays <= 14) return 'Next week';
    return null; // don't show countdown for far-future events
  }, [dateStr]);
}

const categoryGradients = {
  Hackathon:   'from-sky-400 to-petal-500',
  Performance: 'from-bloom-400 to-petal-500',
  Competition: 'from-sand-400 to-bloom-500',
  Workshop:    'from-mint-400 to-sky-500',
  Theatre:     'from-bloom-400 to-sand-400',
  Sports:      'from-mint-400 to-sky-400',
  Literary:    'from-petal-400 to-bloom-400',
};
const defaultGradient = 'from-petal-400 to-bloom-400';

function EventCard({ event, variant = 'default' }) {
  const isCompact = variant === 'compact';
  const gradient = categoryGradients[event.category] || defaultGradient;
  const countdown = useCountdown(event.date);
  const hasPoster = !!event.poster && event.poster !== '';

  return (
    <Link to={`/events/${event.id}`}
      className="group relative rounded-3xl overflow-hidden
        bg-white/60 dark:bg-grape-800/50
        backdrop-blur-md
        border border-white/70 dark:border-grape-700/40
        shadow-card hover:shadow-card-hover
        hover:-translate-y-2
        transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
        {event.isToday && (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-bloom-500 text-white text-xs font-bold shadow-bloom">
            <Flame className="w-3 h-3" /> Today
          </span>
        )}
        {event.isFeatured && (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand-400 text-white text-xs font-bold">
            <Star className="w-3 h-3 fill-current" /> Featured
          </span>
        )}
        {countdown && !event.isToday && (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-semibold">
            <Timer className="w-3 h-3" /> {countdown}
          </span>
        )}
      </div>

      {/* Poster / Fallback */}
      <div className={`relative overflow-hidden ${isCompact ? 'h-36' : 'h-44'}`}>
        {hasPoster ? (
          <img
            src={event.poster || event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        ) : (
          // Gradient fallback when no poster
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-white/30 text-6xl font-display font-bold select-none">
              {(event.title || 'E')[0]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Category chip */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-sm`}>
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-semibold text-petal-600 dark:text-petal-400 mb-1">{event.clubName}</p>
        <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 leading-snug mb-2 line-clamp-2 group-hover:text-petal-700 dark:group-hover:text-petal-300 transition-colors">
          {event.title}
        </h3>

        {!isCompact && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
          </div>
        )}

        {/* Meta */}
        <div className="space-y-1.5 pt-3 border-t border-petal-100/40 dark:border-grape-700/40">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-petal-400 flex-shrink-0" />
            <span>{formatDate(event.date, false, 'TBA')}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 text-petal-400 flex-shrink-0" />
              <span>{formatTime(event.time)}</span>
            </div>
          )}
          {(event.venue || event.location) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-bloom-400 flex-shrink-0" />
              <span className="truncate">{event.venue || event.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(EventCard);
