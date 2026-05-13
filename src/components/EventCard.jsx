import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowRight, Star } from 'lucide-react';
import TagBadge from './TagBadge';

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventCard({ event, variant = 'default' }) {
  const isCompact = variant === 'compact';

  return (
    <div className="card-hover group relative overflow-hidden">
      {/* Featured badge */}
      {event.isFeatured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-600">
          <Star className="w-3 h-3 fill-current" />
          Featured
        </div>
      )}

      {/* Today badge */}
      {event.isToday && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500 text-white text-xs font-600">
          Today
        </div>
      )}

      {/* Poster */}
      <div className={`overflow-hidden ${isCompact ? 'h-40' : 'h-48'} rounded-t-2xl relative`}>
        <img
          src={event.poster}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-700 text-gray-900 dark:text-gray-50 text-sm leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2 flex-1">
            {event.title}
          </h3>
          <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 transition-colors flex-shrink-0 mt-0.5" />
        </div>

        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-2">{event.clubName}</p>

        {!isCompact && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {event.tags?.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* Meta */}
        <div className="space-y-1.5 pt-3 border-t border-sand-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-teal-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-teal-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-teal-400" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
