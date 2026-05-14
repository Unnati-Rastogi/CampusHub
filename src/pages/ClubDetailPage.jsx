import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Share2, GitFork, Globe, Play, Calendar, ExternalLink, BookOpen, Image, Bot, QrCode, Lock } from 'lucide-react';
import { useClub } from '../hooks/useClubs';
import { useEvents } from '../hooks/useEvents';
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
  Hackathon:   'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  Workshop:    'bg-mint-100 dark:bg-mint-900/30 text-mint-700 dark:text-mint-300',
  Event:       'bg-petal-100 dark:bg-petal-900/30 text-petal-600 dark:text-petal-300',
  Exhibition:  'bg-sand-100 dark:bg-sand-900/30 text-sand-700 dark:text-sand-300',
  Competition: 'bg-bloom-100 dark:bg-bloom-900/30 text-bloom-700 dark:text-bloom-300',
  Performance: 'bg-petal-100 dark:bg-petal-900/30 text-petal-600 dark:text-petal-300',
  Tournament:  'bg-sand-100 dark:bg-sand-900/30 text-sand-700 dark:text-sand-300',
  Concert:     'bg-petal-100 dark:bg-petal-900/30 text-petal-600 dark:text-petal-300',
  Publication: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

const activityTypeDots = {
  Hackathon:   'bg-sky-400',
  Workshop:    'bg-mint-400',
  Event:       'bg-petal-400',
  Exhibition:  'bg-sand-400',
  Competition: 'bg-bloom-400',
  Performance: 'bg-petal-400',
  Tournament:  'bg-sand-400',
  Concert:     'bg-petal-400',
  Publication: 'bg-gray-400',
};

import { formatDate } from '../lib/utils';

function ClubDetailSkeleton() {
  return (
    <div className="min-h-screen pt-16 animate-pulse">
      <div className="h-72 bg-gray-200 dark:bg-grape-700" />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 -mt-12">
        <div className="glass-card p-6 mb-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gray-200 dark:bg-grape-700 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-grape-700 rounded-full w-1/2" />
              <div className="h-4 bg-gray-100 dark:bg-grape-800 rounded-full w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function ClubDetailPage() {
  const { slug } = useParams();
  const { club, loading } = useClub(slug);
  const { events: clubEvents } = useEvents({ clubId: slug });

  if (loading) return <ClubDetailSkeleton />;

  if (!club) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-petal-50 dark:bg-grape-800 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-9 h-9 text-petal-200 dark:text-grape-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-2">Club not found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This club may have been removed or the URL is incorrect.</p>
          <Link to="/clubs" className="btn-primary">Back to Clubs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden bg-gradient-to-br from-petal-200 to-bloom-200 dark:from-grape-700 dark:to-grape-800">
        {club.banner && (
          <img
            src={club.banner}
            alt={`${club.name} banner`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link to="/clubs" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Clubs
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header card */}
        <div className="-mt-12 relative z-10 glass-card p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img
              src={club.logo}
              alt={club.name}
              className="w-20 h-20 rounded-3xl border-4 border-white dark:border-grape-800 shadow-petal bg-white flex-shrink-0"
              loading="lazy"
              decoding="async"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-gray-50 leading-tight">{club.name}</h1>
                  <p className="text-petal-500 dark:text-petal-400 italic text-sm mt-0.5">{club.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {club.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
                </div>
              </div>
              <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-petal-400" />{club.memberCount} members</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-petal-400" />Est. {club.foundedYear}</span>
                <a href={`mailto:${club.contactEmail}`} className="flex items-center gap-1.5 hover:text-petal-600 dark:hover:text-petal-400 transition-colors">
                  <Mail className="w-4 h-4 text-petal-400" />{club.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 pb-14">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-3">About</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{club.description}</p>
            </div>

            {/* Activity Timeline */}
            {club.recentActivities?.length > 0 ? (
              <div className="glass-card p-6">
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-5">Activity Timeline</h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-petal-200 via-petal-200/50 to-transparent dark:from-grape-600 dark:via-grape-700/50" />
                  <div className="space-y-1">
                    {club.recentActivities.map((activity, idx) => {
                      const dotColor = activityTypeDots[activity.type] || 'bg-gray-400';
                      return (
                        <div key={activity.id} className="relative flex items-start gap-4 pl-12 py-3 group">
                          {/* Timeline dot */}
                          <div className={`absolute left-[17px] top-[18px] w-2.5 h-2.5 rounded-full ${dotColor} ring-2 ring-white dark:ring-grape-900 z-10 group-hover:scale-125 transition-transform`} />

                          <div className="flex-1 flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-petal-50/60 dark:hover:bg-grape-700/30 transition-colors -mx-2 px-4">
                            <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-gray-50">{activity.title}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(activity.date)}
                              </p>
                            </div>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${activityTypeColors[activity.type] || 'bg-gray-100 text-gray-600'}`}>
                              {activity.type}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6">
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-3">Activity Timeline</h2>
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-petal-200 dark:text-grape-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No recent activities recorded</p>
                </div>
              </div>
            )}



            {/* Upcoming Events */}
            {clubEvents.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-4">Upcoming Events</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {clubEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* President */}
            {club.president && (
              <div className="glass-card p-5">
                <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3">Student President</h3>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sand-400 to-bloom-400 flex items-center justify-center text-white font-bold text-sm shadow-petal">
                    {club.president.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{club.president.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{club.president.year} · {club.president.department}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Faculty Coordinator */}
            <div className="glass-card p-5">
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3">Faculty Coordinator</h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-petal-400 to-bloom-400 flex items-center justify-center text-white font-bold text-sm shadow-petal">
                  {club.facultyCoordinator?.split(' ').at(-1)?.[0] || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{club.facultyCoordinator}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Faculty Coordinator</p>
                </div>
              </div>
            </div>

            {/* Connect */}
            <div className="glass-card p-5">
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3">Connect</h3>
              <div className="space-y-2">
                <a href={`mailto:${club.contactEmail}`} className="flex items-center gap-2.5 p-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-petal-50 dark:hover:bg-grape-700/50 hover:text-petal-600 dark:hover:text-petal-400 transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-petal-100/60 dark:bg-grape-700 flex items-center justify-center group-hover:bg-petal-200 dark:group-hover:bg-petal-900/30 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-petal-500" />
                  </div>
                  <span className="text-xs truncate">{club.contactEmail}</span>
                </a>
                {Object.entries(club.socialLinks || {}).map(([platform, url]) => {
                  const Icon = socialIcons[platform] || ExternalLink;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-petal-50 dark:hover:bg-grape-700/50 hover:text-petal-600 dark:hover:text-petal-400 transition-all group capitalize">
                      <div className="w-8 h-8 rounded-xl bg-petal-100/60 dark:bg-grape-700 flex items-center justify-center group-hover:bg-petal-200 dark:group-hover:bg-petal-900/30 transition-colors">
                        <Icon className="w-3.5 h-3.5 text-petal-500" />
                      </div>
                      <span className="text-xs">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* At a Glance */}
            <div className="glass-card p-5">
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3">At a Glance</h3>
              <div className="space-y-2.5">
                {[
                  ['Members',    club.memberCount],
                  ['Founded',    club.foundedYear],
                  ['Activities', club.recentActivities?.length || 0],
                  ['Events',     clubEvents.length],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{k}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-50">{v}</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
