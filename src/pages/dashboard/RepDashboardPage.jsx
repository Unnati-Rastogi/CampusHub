import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Plus, LayoutDashboard, ChevronRight, Edit3, Trash2, Loader2, AlertCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useClub } from '../../hooks/useClubs';
import { useEvents } from '../../hooks/useEvents';
import { useMyBookings } from '../../hooks/useBookings';
import { deleteEvent } from '../../services/eventService';
import ClubEditor from '../../components/dashboard/ClubEditor';
import { ClubPreviewContent } from '../../components/dashboard/ClubPreviewModal';
import EventEditor from '../../components/dashboard/EventEditor';
import BookingRequestTable from '../../components/dashboard/BookingRequestTable';
import HallCalendar from '../../components/dashboard/HallCalendar';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import { formatTime } from '../../lib/utils';

const TABS = [
  { id: 'overview',  label: 'Overview',     icon: LayoutDashboard },
  { id: 'club',      label: 'Club Profile', icon: Edit3 },
  { id: 'preview',   label: 'Preview',      icon: Eye },
  { id: 'events',    label: 'Events',       icon: Calendar },
  { id: 'bookings',  label: 'Bookings',     icon: Building2 },
  { id: 'calendar',  label: 'Calendar',     icon: Calendar },
];

export default function RepDashboardPage() {
  const { user, profile, clubId } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingEvent, setEditingEvent]  = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [deletingId, setDeletingId]      = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const { club, loading: clubLoading } = useClub(clubId);
  const { events, loading: eventsLoading } = useEvents({ clubId, allStatuses: true });
  const { bookings, loading: bookingsLoading } = useMyBookings(user?.uid);

  const pendingCount  = bookings.filter(b => b.status === 'pending').length;
  const approvedCount = bookings.filter(b => b.status === 'approved').length;

  const unbookedEvents = [];
  const mismatchedEvents = [];

  events.forEach(e => {
    if (e.status !== 'approved') return;
    
    let eDate = '';
    if (typeof e.date === 'string') {
      eDate = e.date.split('T')[0];
    } else if (e.date?.toDate) {
      eDate = e.date.toDate().toISOString().split('T')[0];
    } else if (e.date) {
      eDate = new Date(e.date).toISOString().split('T')[0];
    }
    
    // Find a booking request (pending or approved) for this date
    const bookingOnDate = bookings.find(b => b.date === eDate && b.status !== 'cancelled');
    
    if (!bookingOnDate) {
      unbookedEvents.push(e);
    } else {
      const venueStr = e.venue || '';
      const bHallStr = bookingOnDate.hallName || '';
      const venueMatches = venueStr.toLowerCase().includes(bHallStr.toLowerCase()) || bHallStr.toLowerCase().includes(venueStr.toLowerCase());
      
      const timeStr = e.time ? e.time.toLowerCase() : '';
      const bStart24 = bookingOnDate.startTime || '';
      const bEnd24 = bookingOnDate.endTime || '';
      const bStart12 = formatTime(bStart24).toLowerCase();
      const bEnd12 = formatTime(bEnd24).toLowerCase();
      
      const stripStr = s => s.replace(/0|:| /g, '');
      const timeMatches = 
        timeStr.includes(bStart24) || timeStr.includes(bEnd24) ||
        timeStr.includes(bStart12) || timeStr.includes(bEnd12) ||
        stripStr(timeStr).includes(stripStr(bStart12)) ||
        stripStr(timeStr).includes(stripStr(bEnd12));
      
      if (!venueMatches || (e.time && !timeMatches)) {
        mismatchedEvents.push({ event: e, booking: bookingOnDate, reason: !venueMatches ? 'Venue mismatch' : 'Time mismatch' });
      }
    }
  });

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setDeletingId(eventToDelete.id);
    try { await deleteEvent(eventToDelete.id); } finally { setDeletingId(null); setEventToDelete(null); }
  };

  const displayName = profile?.displayName || user?.email || 'Rep';

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="blob w-80 h-80 -top-20 -right-20 bg-petal-200 dark:bg-petal-900/30 opacity-50" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="section-label mb-1">Club Representative</p>
              <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-gray-50">
                Welcome, {displayName.split(' ')[0]}
              </h1>
              {club && <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{club.name}</p>}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-petal-600 text-white shadow-petal'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-petal-50 dark:hover:bg-grape-800'
                  }`}>
                  <Icon className="w-4 h-4" /> {tab.label}
                  {tab.id === 'bookings' && pendingCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-sand-400 text-white text-[10px] font-bold flex items-center justify-center">{pendingCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-petal-200 dark:via-grape-700 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <AnimatePresence mode="wait">

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-6">
            {!clubId && (
              <div className="flex items-start gap-3 p-5 rounded-3xl bg-sand-50/80 dark:bg-sand-900/20 border border-sand-200/50 dark:border-sand-800/30">
                <AlertCircle className="w-5 h-5 text-sand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sand-700 dark:text-sand-300 text-sm">No club assigned yet</p>
                  <p className="text-xs text-sand-600 dark:text-sand-400 mt-0.5">An Authority will assign your club shortly. Once assigned, you can manage events and book halls.</p>
                </div>
              </div>
            )}

            {unbookedEvents.length > 0 && (
              <div className="flex items-start gap-3 p-5 rounded-3xl bg-bloom-50/80 dark:bg-bloom-900/20 border border-bloom-200/50 dark:border-bloom-800/30">
                <AlertCircle className="w-5 h-5 text-bloom-600 dark:text-bloom-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="font-bold text-bloom-800 dark:text-bloom-300 text-sm">Hall Booking Required</p>
                  <p className="text-xs text-bloom-700/80 dark:text-bloom-400/80 mt-0.5">
                    You have {unbookedEvents.length} approved {unbookedEvents.length === 1 ? 'event' : 'events'} that do not have a hall booked. 
                    <br/><span className="font-semibold italic">Event: {unbookedEvents[0].title}</span>
                  </p>
                </div>
                <button onClick={() => navigate('/halls')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bloom-600 text-white text-xs font-bold shadow-sm hover:bg-bloom-700 transition-colors">
                  Book Hall <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {mismatchedEvents.length > 0 && (
              <div className="flex items-start gap-3 p-5 rounded-3xl bg-sand-50/80 dark:bg-sand-900/20 border border-sand-200/50 dark:border-sand-800/30">
                <AlertCircle className="w-5 h-5 text-sand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-sand-800 dark:text-sand-300 text-sm">Booking Mismatch</p>
                  <p className="text-xs text-sand-700/80 dark:text-sand-400/80 mt-0.5">
                    The details of your event <span className="font-semibold italic">"{mismatchedEvents[0].event.title}"</span> don't match its hall booking ({mismatchedEvents[0].reason}). Please ensure they align.
                  </p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Club Members', value: club?.memberCount || '—', color: 'from-petal-400 to-bloom-400' },
                { label: 'Total Events', value: events.length, color: 'from-sky-400 to-mint-400' },
                { label: 'Pending Bookings', value: pendingCount, color: 'from-sand-400 to-bloom-400' },
                { label: 'Approved Bookings', value: approvedCount, color: 'from-mint-400 to-sky-400' },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <div className={`text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br ${stat.color} mb-0.5`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Edit Club Profile', desc: 'Update your club info', tab: 'club', color: 'petal' },
                { label: 'Create Event', desc: 'Add a new campus event', tab: 'events', color: 'sky' },
                { label: 'Book a Hall', desc: 'Request a venue', path: '/halls', color: 'mint' },
              ].map(action => (
                <button key={action.label}
                  onClick={() => action.tab ? setActiveTab(action.tab) : navigate(action.path)}
                  className="glass-card p-5 text-left hover:shadow-card-hover hover:-translate-y-1 transition-all group"
                >
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-50 mb-1">{action.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{action.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-petal-600 dark:text-petal-400 group-hover:gap-2 transition-all">
                    Go <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>



            {/* Recent bookings */}
            {bookings.length > 0 && (
              <div className="glass-card p-5">
                <h2 className="font-display font-bold text-base text-gray-900 dark:text-gray-50 mb-4">Recent Booking Requests</h2>
                <BookingRequestTable bookings={bookings.slice(0, 3)} loading={bookingsLoading} />
                {bookings.length > 3 && (
                  <button onClick={() => setActiveTab('bookings')} className="mt-3 text-xs text-petal-600 dark:text-petal-400 font-bold hover:underline">
                    View all {bookings.length} requests →
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Club Profile tab */}
        {activeTab === 'club' && (
          <motion.div key="club" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-5">Edit Club Profile</h2>
              {clubLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 dark:bg-grape-800 rounded-2xl" />)}
                </div>
              ) : club ? (
                <ClubEditor club={club} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Club data not found. Make sure you're assigned to a club.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Preview tab */}
        {activeTab === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            <div className="bg-white/40 dark:bg-black/10 rounded-3xl p-4 sm:p-6 shadow-sm border border-petal-100/30 dark:border-grape-800/30">
              {clubLoading ? (
                <div className="animate-pulse h-96 bg-gray-100 dark:bg-grape-800 rounded-2xl" />
              ) : club ? (
                <ClubPreviewContent club={club} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Club data not found. Make sure you're assigned to a club.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Events tab */}
        {activeTab === 'events' && (
          <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50">Your Events</h2>
              {clubId && (
                <button onClick={() => setCreatingEvent(true)} className="btn-primary text-sm py-2">
                  <Plus className="w-4 h-4" /> New Event
                </button>
              )}
            </div>

            {eventsLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-grape-800 animate-pulse" />)}</div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 glass-card">
                <Calendar className="w-10 h-10 text-petal-300 dark:text-grape-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No events yet</p>
                <p className="text-sm text-gray-400 mb-4">Create your first event to get started</p>
                {clubId && <button onClick={() => setCreatingEvent(true)} className="btn-primary text-sm">Create Event</button>}
              </div>
            ) : (
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-grape-900/40 border border-petal-100/40 dark:border-grape-700/30 hover:border-petal-200 transition-all">
                    {event.poster && (
                      <img src={event.poster} alt="" className="w-16 h-12 object-cover rounded-xl flex-shrink-0" loading="lazy" decoding="async" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm text-gray-900 dark:text-gray-50 truncate">{event.title}</p>
                        <StatusBadge status={event.status || 'approved'} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.category} · {event.date || '—'} · {event.venue || '—'}</p>
                      {event.status === 'rejected' && event.statusMessage && (
                        <p className="text-xs text-bloom-600 dark:text-bloom-400 mt-1">Reason: {event.statusMessage}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingEvent(event)} aria-label={`Edit ${event.title}`} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-petal-600 hover:bg-petal-50 dark:hover:bg-petal-900/20 transition-all">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEventToDelete(event)} aria-label={`Delete ${event.title}`} disabled={deletingId === event.id} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-bloom-600 hover:bg-bloom-50 dark:hover:bg-bloom-900/20 transition-all">
                        {deletingId === event.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50">My Booking Requests</h2>
              {clubId && (
                <button onClick={() => navigate('/halls')} className="btn-primary text-sm py-2">
                  <Plus className="w-4 h-4" /> Book Hall
                </button>
              )}
            </div>
            <BookingRequestTable bookings={bookings} loading={bookingsLoading} />
          </motion.div>
        )}

        {/* Calendar tab */}
        {activeTab === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            <HallCalendar />
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Event create/edit modal */}
      <Modal isOpen={creatingEvent || !!editingEvent} onClose={() => { setCreatingEvent(false); setEditingEvent(null); }} title={editingEvent ? 'Edit Event' : 'Create New Event'} size="lg">
        <EventEditor
          clubId={clubId}
          clubName={club?.name || ''}
          event={editingEvent}
          onSave={() => { setCreatingEvent(false); setEditingEvent(null); }}
          onCancel={() => { setCreatingEvent(false); setEditingEvent(null); }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        destructive={true}
      />
    </div>
  );
}
