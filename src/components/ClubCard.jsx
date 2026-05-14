import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight } from 'lucide-react';
import TagBadge from './TagBadge';

function ClubCard({ club }) {
  return (
    <Link
      to={`/clubs/${club.slug}`}
      className="group block rounded-3xl overflow-hidden
        bg-white/60 dark:bg-grape-800/50
        backdrop-blur-md
        border border-white/70 dark:border-grape-700/40
        shadow-card hover:shadow-card-hover
        hover:-translate-y-2
        transition-all duration-300"
    >
      {/* Banner */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-petal-100 to-bloom-100 dark:from-grape-700 dark:to-grape-800">
        {club.banner && (
          <img
            src={club.banner}
            alt={`${club.name} banner`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Arrow icon top-right */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>

        {/* Founded year bottom-right */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs text-white/70 font-medium">Est. {club.foundedYear}</span>
        </div>
      </div>

      {/* Logo bridge */}
      <div className="relative px-4 -mt-6 mb-0">
        <img
          src={club.logo}
          alt={`${club.name} logo`}
          className="w-12 h-12 rounded-2xl border-2 border-white dark:border-grape-800 shadow-petal bg-white"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <h3 className="font-display font-bold text-base text-gray-900 dark:text-gray-50 leading-snug mb-0.5 group-hover:text-petal-700 dark:group-hover:text-petal-300 transition-colors">
          {club.name}
        </h3>
        <p className="text-xs text-petal-500 dark:text-petal-400 font-medium italic mb-2">{club.tagline}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {club.description}
        </p>

        {/* Tags */}
        {club.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {club.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-petal-100/50 dark:border-grape-700/40">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-3.5 h-3.5 text-petal-400" />
            <span><span className="font-semibold text-gray-700 dark:text-gray-200">{club.memberCount}</span> members</span>
          </div>
          <span className="text-xs font-medium text-petal-500 dark:text-petal-400 group-hover:underline transition-all">
            View club →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default memo(ClubCard);
