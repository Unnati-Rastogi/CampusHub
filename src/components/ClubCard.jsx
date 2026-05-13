import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import TagBadge from './TagBadge';

export default function ClubCard({ club }) {
  return (
    <Link
      to={`/clubs/${club.slug}`}
      className="card-hover group block overflow-hidden"
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden rounded-t-2xl">
        <img
          src={club.banner}
          alt={`${club.name} banner`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Logo */}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <img
            src={club.logo}
            alt={`${club.name} logo`}
            className="w-12 h-12 rounded-xl border-2 border-white dark:border-charcoal-850 shadow-md bg-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-700 text-gray-900 dark:text-gray-50 text-base leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {club.name}
          </h3>
          <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 transition-colors flex-shrink-0 mt-0.5" />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-3">{club.tagline}</p>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {club.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {club.tags.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-sand-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <span>{club.memberCount} members</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">Est. {club.foundedYear}</span>
        </div>
      </div>
    </Link>
  );
}
