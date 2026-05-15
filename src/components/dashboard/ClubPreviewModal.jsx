import { useState } from 'react';
import { Users, Mail, Share2, GitFork, Globe, Play, Calendar, ExternalLink, BookOpen } from 'lucide-react';
import Modal from '../Modal';
import TagBadge from '../TagBadge';
import ClubCard from '../ClubCard';
import { formatDate } from '../../lib/utils';

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

export default function ClubPreviewModal({ isOpen, onClose, club }) {
  const [view, setView] = useState('page'); // 'card' or 'page'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Public Preview" size="4xl">
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-grape-800 rounded-xl w-max mb-6 mx-auto">
        <button
          onClick={() => setView('page')}
          className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
            view === 'page'
              ? 'bg-white dark:bg-grape-900 shadow-sm text-gray-900 dark:text-gray-50'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Profile Page
        </button>
        <button
          onClick={() => setView('card')}
          className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
            view === 'card'
              ? 'bg-white dark:bg-grape-900 shadow-sm text-gray-900 dark:text-gray-50'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Club Card
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-petal-100/40 dark:border-grape-700/30 bg-gray-50/30 dark:bg-black/20">
        
        {view === 'card' && (
          <div className="p-10 flex items-center justify-center min-h-[400px]">
            <div className="w-full max-w-sm">
              <ClubCard club={club} preview={true} />
            </div>
            <div className="absolute bottom-4 text-center w-full text-xs text-gray-400">
              This is how your club will appear on the general Clubs grid.
            </div>
          </div>
        )}

        {view === 'page' && (
          <div className="h-[600px] overflow-y-auto">
            {/* Banner */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-petal-200 to-bloom-200 dark:from-grape-700 dark:to-grape-800">
              {club.banner && (
                <img src={club.banner} alt={`${club.name} banner`} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            </div>

            <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-10">
              {/* Header card */}
              <div className="-mt-12 relative z-10 glass-card p-5 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <img
                    src={club.logo || 'https://via.placeholder.com/150'}
                    alt={club.name}
                    className="w-20 h-20 rounded-3xl border-4 border-white dark:border-grape-800 shadow-petal bg-white flex-shrink-0 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-gray-50 leading-tight">{club.name || 'Your Club Name'}</h1>
                        <p className="text-petal-500 dark:text-petal-400 italic text-sm mt-0.5">{club.tagline || 'Your catchy tagline goes here'}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {club.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-petal-400" />{club.memberCount || 0} members</span>
                      <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-petal-400" />Est. {club.foundedYear || new Date().getFullYear()}</span>
                      <a href={`mailto:${club.contactEmail}`} className="flex items-center gap-1.5 hover:text-petal-600 dark:hover:text-petal-400 transition-colors pointer-events-none">
                        <Mail className="w-4 h-4 text-petal-400" />{club.contactEmail || 'email@example.com'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-5">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-5">
                  {/* About */}
                  <div className="glass-card p-6">
                    <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-3">About</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                      {club.description || 'Club description will appear here.'}
                    </p>
                  </div>

                  {/* Activity Timeline (Mock for preview) */}
                  <div className="glass-card p-6 opacity-60">
                    <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-3">Activity Timeline</h2>
                    <div className="text-center py-8">
                      <Calendar className="w-10 h-10 text-petal-200 dark:text-grape-700 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 dark:text-gray-500">Live timeline will appear here</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* President */}
                  {club.president?.name && (
                    <div className="glass-card p-5">
                      <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3">Student President</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sand-400 to-bloom-400 flex items-center justify-center text-white font-bold text-sm shadow-petal uppercase">
                          {club.president.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{club.president.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{club.president.year} · {club.president.department}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Faculty Coordinator */}
                  {club.facultyCoordinator && (
                    <div className="glass-card p-5">
                      <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3">Faculty Coordinator</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-petal-400 to-bloom-400 flex items-center justify-center text-white font-bold text-sm shadow-petal uppercase">
                          {club.facultyCoordinator.split(' ').at(-1)?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{club.facultyCoordinator}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Faculty Coordinator</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Connect */}
                  <div className="glass-card p-5">
                    <h3 className="font-display font-bold text-sm text-gray-900 dark:text-gray-50 mb-3">Connect</h3>
                    <div className="space-y-2 pointer-events-none">
                      <a href="#" className="flex items-center gap-2.5 p-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-petal-50 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-petal-100/60 flex items-center justify-center transition-colors">
                          <Mail className="w-3.5 h-3.5 text-petal-500" />
                        </div>
                        <span className="text-xs truncate">{club.contactEmail || 'email@example.com'}</span>
                      </a>
                      {Object.entries(club.socialLinks || {}).map(([platform, url]) => {
                        if (!url) return null;
                        const Icon = socialIcons[platform] || ExternalLink;
                        return (
                          <a key={platform} href="#" className="flex items-center gap-2.5 p-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-petal-50 transition-all group capitalize">
                            <div className="w-8 h-8 rounded-xl bg-petal-100/60 flex items-center justify-center transition-colors">
                              <Icon className="w-3.5 h-3.5 text-petal-500" />
                            </div>
                            <span className="text-xs">{platform}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
