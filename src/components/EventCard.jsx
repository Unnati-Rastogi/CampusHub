import { MapPin, Clock, Calendar, Flame, Star } from 'lucide-react';
import TagBadge from './TagBadge';

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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

export default function EventCard({ event, variant = 'default' }) {
  const isCompact = variant === 'compact';
  const gradient = categoryGradients[event.category] || defaultGradient;

  return (
    <div className="group relative rounded-3xl overflow-hidden
      bg-white/60 dark:bg-grape-800/50
      backdrop-blur-md
      border border-white/70 dark:border-grape-700/40
      shadow-card hover:shadow-card-hover
      hover:-translate-y-2
      transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
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
      </div>

      {/* Poster */}
      <div className={`relative overflow-hidden ${isCompact ? 'h-36' : 'h-44'}`}>
        <img
          src={event.poster}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
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
        <div className="flex flex-wrap gap-1.5 mb-3">
          {event.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>

        {/* Meta */}
        <div className="space-y-1.5 pt-3 border-t border-petal-100/40 dark:border-grape-700/40">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-petal-400 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 text-petal-400 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-bloom-400 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
