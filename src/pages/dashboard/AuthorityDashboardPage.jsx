import { useState } from 'react';
import { Building2, Calendar, LayoutDashboard, CheckCircle2, Clock, Filter, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useAllBookings } from '../../hooks/useBookings';
import { useHalls } from '../../hooks/useHalls';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import BookingReviewCard from '../../components/dashboard/BookingReviewCard';
import HallCalendar from '../../components/dashboard/HallCalendar';
import Modal from '../../components/Modal';
import { runSeed, seedClubs, seedHalls } from '../../lib/seed';

const TABS = [
  { id: 'requests',  label: 'Booking Requests', icon: Building2 },
  { id: 'calendar',  label: 'Hall Calendar',    icon: Calendar },
  { id: 'halls',     label: 'Manage Halls',     icon: Building2 },
];

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'];

function HallEditorRow({ hall }) {
  const [form, setForm] = useState({ name: hall.name, capacity: hall.capacity, location: hall.location });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'halls', hall.id), { ...form, capacity: Number(form.capacity) });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white/50 dark:bg-grape-900/40 border border-petal-100/40 dark:border-grape-700/30">
      <div className="flex items-center gap-3 mb-3">
        <img src={hall.image} alt="" className="w-12 h-10 object-cover rounded-xl flex-shrink-0" />
        <div className="grid sm:grid-cols-3 gap-2 flex-1">
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-base py-1.5 text-sm" placeholder="Hall name" />
          <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="input-base py-1.5 text-sm" placeholder="Capacity" />
          <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="input-base py-1.5 text-sm" placeholder="Location" />
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-petal-50 dark:bg-petal-900/20 text-petal-700 dark:text-petal-300 text-xs font-bold hover:bg-petal-100 transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5 text-mint-500" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function AuthorityDashboardPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab]     = useState('requests');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [seeding, setSeeding]         = useState(false);
  const [seedMsg, setSeedMsg]         = useState('');

  const { bookings, loading: bookingsLoading } = useAllBookings();
  const { halls, loading: hallsLoading }       = useHalls();

  const filtered = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  const pendingCount  = bookings.filter(b => b.status === 'pending').length;
  const approvedCount = bookings.filter(b => b.status === 'approved').length;

  const handleSeed = async () => {
    const clearFirst = confirm('Clear existing clubs and halls before seeding? (Recommended for a clean start)');
    if (!confirm(`This will seed Firestore with ${seedClubs.length} clubs and ${seedHalls.length} halls. Continue?`)) return;
    
    setSeeding(true);
    setSeedMsg('');
    try {
      const res = await runSeed(db, { clearFirst });
      setSeedMsg(`✅ Seeded ${res.clubs} clubs and ${res.halls} halls successfully!`);
    } catch (err) {
      setSeedMsg(`❌ Error: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const displayName = profile?.displayName || user?.email || 'Authority';

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="blob w-80 h-80 -top-20 right-0 bg-petal-100 dark:bg-petal-900/20 opacity-50" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <p className="section-label mb-1">Authority / Teacher</p>
              <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-gray-50">
                Admin Panel
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{displayName}</p>
            </div>

            {/* Seed button */}
            <div className="text-right">
              <button onClick={handleSeed} disabled={seeding}
                className="text-xs px-4 py-2 rounded-2xl bg-gray-100 dark:bg-grape-800 text-gray-600 dark:text-gray-400 font-semibold hover:bg-petal-50 hover:text-petal-700 transition-all disabled:opacity-60">
                {seeding ? 'Seeding…' : 'Seed Database'}
              </button>
              {seedMsg && <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{seedMsg}</p>}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Pending', value: pendingCount, color: 'from-sand-400 to-bloom-400' },
              { label: 'Approved', value: approvedCount, color: 'from-mint-400 to-sky-400' },
              { label: 'Total Requests', value: bookings.length, color: 'from-petal-400 to-bloom-400' },
              { label: 'Halls', value: halls.length, color: 'from-sky-400 to-mint-400' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-3 text-center">
                <div className={`text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
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
                  <Icon className="w-4 h-4" />{tab.label}
                  {tab.id === 'requests' && pendingCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-sand-400 text-white text-[10px] font-bold flex items-center justify-center">{pendingCount}</span>
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

        {/* Booking Requests */}
        {activeTab === 'requests' && (
          <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4">
            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-gray-400" />
              {STATUS_FILTERS.map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${
                    statusFilter === f
                      ? 'bg-petal-600 text-white border-petal-600 shadow-petal'
                      : 'bg-white/60 dark:bg-grape-800/50 text-gray-600 dark:text-gray-400 border-petal-200/60 dark:border-grape-600/40 hover:border-petal-400'
                  }`}>
                  {f === 'all' ? 'All' : f}
                  {f === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
                </button>
              ))}
            </div>

            {bookingsLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-36 rounded-3xl bg-gray-100 dark:bg-grape-800 animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <CheckCircle2 className="w-10 h-10 text-mint-400 mx-auto mb-3" />
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {statusFilter === 'pending' ? 'No pending requests' : 'No requests found'}
                </p>
                <p className="text-sm text-gray-400">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(booking => (
                  <BookingReviewCard key={booking.id} booking={booking} reviewerId={user?.uid} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Calendar */}
        {activeTab === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            <HallCalendar />
          </motion.div>
        )}

        {/* Manage Halls */}
        {activeTab === 'halls' && (
          <motion.div key="halls" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50">Manage Halls</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Edit name, capacity, and location</p>
            </div>
            {hallsLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-grape-800 animate-pulse" />)}</div>
            ) : halls.map(hall => (
              <HallEditorRow key={hall.id} hall={hall} />
            ))}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
