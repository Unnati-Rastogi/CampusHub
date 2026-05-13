import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Share2, GitFork, Globe, Play, Calendar, MapPin, ExternalLink, BookOpen } from 'lucide-react';
import { clubs } from '../data/clubs';
import { events } from '../data/events';
import TagBadge from '../components/TagBadge';
import EventCard from '../components/EventCard';

const socialIcons = {
  instagram: Share2,
  github: GitFork,
  website: Globe,
  twitter: Share2,
  youtube: Play,
  spotify: Play,
};

const activityTypeColors = {
  Hackathon: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Workshop: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Event: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Exhibition: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Competition: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Performance: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Tournament: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Concert: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Publication: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ClubDetailPage() {
  const { slug } = useParams();
  const club = clubs.find(c => c.slug === slug);

  if (!club) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-sand-50 dark:bg-charcoal-950">
        <div className="text-center">
          <h2 className="font-display font-700 text-2xl text-gray-900 dark:text-gray-50 mb-3">Club not found</h2>
          <Link to="/clubs" className="btn-primary">Back to Clubs</Link>
        </div>
      </div>
    );
  }

  const clubEvents = events.filter(e => e.clubId === club.id);

  return (
    <div className="min-h-screen pt-16 bg-sand-50 dark:bg-charcoal-950">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
        <img
          src={club.banner}
          alt={`${club.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link
            to="/clubs"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Clubs
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Club identity card */}
        <div className="card -mt-12 relative z-10 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img
              src={club.logo}
              alt={`${club.name} logo`}
              className="w-20 h-20 rounded-2xl border-4 border-white dark:border-charcoal-850 shadow-md bg-white flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display font-700 text-2xl sm:text-3xl text-gray-900 dark:text-gray-50 leading-tight">
                    {club.name}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm mt-0.5">{club.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {club.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-400" />
                  {club.memberCount} members
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  Est. {club.foundedYear}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <a href={`mailto:${club.contactEmail}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    {club.contactEmail}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pb-12">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="card p-6">
              <h2 className="font-display font-700 text-lg text-gray-900 dark:text-gray-50 mb-3">About</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{club.description}</p>
            </div>

            {/* Recent Activities */}
            <div className="card p-6">
              <h2 className="font-display font-700 text-lg text-gray-900 dark:text-gray-50 mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {club.recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-sand-50 dark:hover:bg-charcoal-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sand-50 dark:bg-charcoal-800 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-50">{activity.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(activity.date)}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${activityTypeColors[activity.type] || 'bg-gray-100 text-gray-600'}`}>
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Club Events */}
            {clubEvents.length > 0 && (
              <div>
                <h2 className="font-display font-700 text-lg text-gray-900 dark:text-gray-50 mb-4">Upcoming Events</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {clubEvents.map(event => (
                    <EventCard key={event.id} event={event} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Faculty Coordinator */}
            <div className="card p-5">
              <h3 className="font-display font-700 text-sm text-gray-900 dark:text-gray-50 mb-3">Faculty Coordinator</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-700 text-sm">
                  {club.facultyCoordinator.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{club.facultyCoordinator}</p>
                  <p className="text-xs text-gray-400">Faculty Coordinator</p>
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="card p-5">
              <h3 className="font-display font-700 text-sm text-gray-900 dark:text-gray-50 mb-3">Connect</h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${club.contactEmail}`}
                  className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-sand-50 dark:bg-charcoal-800 flex items-center justify-center group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  {club.contactEmail}
                </a>
                {Object.entries(club.socialLinks || {}).map(([platform, url]) => {
                  const Icon = socialIcons[platform] || ExternalLink;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group capitalize"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sand-50 dark:bg-charcoal-800 flex items-center justify-center group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      {platform}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick stats */}
            <div className="card p-5">
              <h3 className="font-display font-700 text-sm text-gray-900 dark:text-gray-50 mb-3">At a Glance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Members</span>
                  <span className="text-sm font-600 text-gray-900 dark:text-gray-50">{club.memberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Founded</span>
                  <span className="text-sm font-600 text-gray-900 dark:text-gray-50">{club.foundedYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Recent Activities</span>
                  <span className="text-sm font-600 text-gray-900 dark:text-gray-50">{club.recentActivities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Upcoming Events</span>
                  <span className="text-sm font-600 text-gray-900 dark:text-gray-50">{clubEvents.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
