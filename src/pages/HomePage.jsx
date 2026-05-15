import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, BookOpen, Building2, Sparkles, Star, Users, TrendingUp, GraduationCap, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useClubs } from '../hooks/useClubs';
import { useEvents } from '../hooks/useEvents';
import { useHalls } from '../hooks/useHalls';
import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';
import { ClubCardSkeleton, EventCardSkeleton } from '../components/LoadingSkeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};



export default function HomePage() {
  const { user, role } = useAuth();
  const { clubs, loading: clubsLoading } = useClubs();
  const { events, loading: eventsLoading } = useEvents();
  const { halls, loading: hallsLoading } = useHalls();

  const totalMembers = clubs.reduce((sum, c) => sum + (Number(c.memberCount) || 0), 0);
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const eventsThisMonth = events.filter(e => {
    const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
    return d >= startOfMonth && d <= endOfMonth;
  }).length;

  const stats = [
    { label: 'Active Clubs',       value: clubsLoading ? '...' : `${clubs.length}+`, icon: BookOpen,     color: 'from-petal-400 to-bloom-400' },
    { label: 'Events this Month',  value: eventsLoading ? '...' : eventsThisMonth,    icon: CalendarDays, color: 'from-mint-400 to-sky-400' },
    { label: 'Student Members',    value: clubsLoading ? '...' : `${totalMembers.toLocaleString()}+`, icon: Users, color: 'from-sand-400 to-bloom-400' },
    { label: 'Halls & Venues',     value: hallsLoading ? '...' : halls.length,        icon: Building2,    color: 'from-sky-400 to-petal-400' },
  ];

  const featuredClubs  = clubs.slice(0, 4);
  const featuredEvents = events.filter(e => e.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-hero-light dark:bg-gradient-hero-dark" />
        <div className="absolute inset-0 bg-noise opacity-30" />

        {/* Decorative blobs */}
        <div className="blob w-[600px] h-[600px] -top-48 -right-48 bg-petal-200 dark:bg-petal-900/30" />
        <div className="blob w-[400px] h-[400px] top-1/3 -left-32 bg-bloom-100 dark:bg-bloom-900/20" />
        <div className="blob w-[300px] h-[300px] bottom-0 right-1/4 bg-sand-100 dark:bg-sand-900/20" />
        <div className="blob w-[500px] h-[500px] -bottom-32 -left-48 bg-sky-100/60 dark:bg-sky-900/10" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{backgroundImage: 'linear-gradient(rgba(100,60,200,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,60,200,1) 1px, transparent 1px)', backgroundSize: '64px 64px'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left column */}
            <div>
              {/* Label */}
              <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-white/60 dark:bg-grape-800/60 backdrop-blur-sm
                  border border-petal-200/60 dark:border-grape-600/40
                  text-petal-600 dark:text-petal-400 text-xs font-bold mb-7 shadow-petal">
                  <span className="w-2 h-2 rounded-full bg-mint-400 animate-pulse" />
                  Your Campus, Reimagined
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial="hidden" animate="visible" custom={1} variants={fadeUp}
                className="font-display font-bold text-[3.25rem] sm:text-[4rem] lg:text-[4.5rem]
                  text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-6"
              >
                Campus life,{' '}
                <span className="relative inline-block">
                  <span className="text-gradient">simplified</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                    <path d="M0 5 Q25 1 50 5 Q75 9 100 5" stroke="url(#underlineGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="underlineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#9b64e3" />
                        <stop offset="100%" stopColor="#f84278" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                <span className="text-gray-400 dark:text-gray-500 text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem]">
                  & actually fun.
                </span>
              </motion.h1>

              <motion.p
                initial="hidden" animate="visible" custom={2} variants={fadeUp}
                className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg"
              >
                One platform to discover clubs you'll love, never miss a campus event, and book halls — no group chats required.
              </motion.p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-12">
                {user ? (
                  <Link to={role === 'authority' ? '/dashboard/authority' : '/dashboard/rep'} className="btn-primary px-8 py-3 text-sm rounded-2xl">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={() => document.getElementById('features-strip')?.scrollIntoView({ behavior: 'smooth' })}
                      className="btn-primary px-8 py-3 text-sm rounded-2xl"
                    >
                      Browse as Student <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link to="/login" className="btn-secondary px-8 py-3 text-sm rounded-2xl">
                      Sign In <LogIn className="w-4 h-4 ml-2" />
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <motion.div
                initial="hidden" animate="visible" custom={4} variants={fadeUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {stats.map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label}
                      className="glass-card p-3 text-center group hover:-translate-y-1 transition-transform duration-300 cursor-default"
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="font-display font-bold text-lg text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right column — floating club cards collage */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden lg:block relative h-[520px]"
            >
              {(clubsLoading ? Array(4).fill({}) : featuredClubs).map((club, i) => {
                const positions = [
                  'top-0 left-4 w-56',
                  'top-8 right-0 w-52',
                  'bottom-4 left-0 w-52',
                  'bottom-0 right-4 w-56',
                ];
                const delays = [0, 0.15, 0.3, 0.45];
                const floatClass = i % 2 === 0 ? 'animate-float' : 'animate-float-slow';

                if (clubsLoading) return (
                  <div key={i} className={`absolute ${positions[i]} ${floatClass}`} style={{ animationDelay: `${i * 0.5}s` }}>
                    <div className="glass-card p-3 animate-pulse">
                      <div className="h-28 rounded-2xl bg-gray-200 dark:bg-grape-800 mb-3" />
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-grape-800" />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-gray-200 dark:bg-grape-800 rounded-full w-1/2" />
                          <div className="h-1.5 bg-gray-100 dark:bg-grape-900 rounded-full w-1/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + delays[i], duration: 0.6 }}
                    className={`absolute ${positions[i]} ${floatClass}`}
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <div className="glass-card p-3 group hover:scale-105 transition-transform duration-300 cursor-pointer shadow-petal">
                      <div className="h-28 rounded-2xl overflow-hidden mb-3">
                        <img src={club.banner} alt={club.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={club.logo} alt="" className="w-8 h-8 rounded-xl shadow-sm bg-white" loading="lazy" decoding="async" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-50 leading-tight">{club.name}</p>
                          <p className="text-[10px] text-petal-500 dark:text-petal-400">{club.memberCount} members</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Central glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-petal-300/40 to-bloom-300/40 dark:from-petal-800/30 dark:to-bloom-800/20 blur-2xl pointer-events-none animate-glow-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-petal-50/80 dark:fill-void-900/80" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ── FEATURES STRIP ─────────────────────────────────── */}
      <section id="features-strip" className="py-12 bg-petal-50/80 dark:bg-void-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: BookOpen,
                gradient: 'from-petal-400 to-bloom-400',
                title: 'Club Directory',
                desc: `Browse ${clubsLoading ? '...' : clubs.length}+ active clubs — from robotics to dance. Find your people.`,
              },
              {
                icon: CalendarDays,
                gradient: 'from-mint-400 to-sky-400',
                title: 'Event Feed',
                desc: "Today's events, upcoming shows, featured highlights — live.",
              },
              {
                icon: Building2,
                gradient: 'from-sand-400 to-bloom-400',
                title: 'Hall Booking',
                desc: 'Check availability, request bookings. Approval in one click.',
              },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="glass-card p-5 flex items-start gap-4 group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center flex-shrink-0 shadow-petal group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 dark:text-gray-50 text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED CLUBS ─────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden">
        <div className="blob w-80 h-80 -top-20 right-0 bg-petal-100 dark:bg-petal-900/20 opacity-60" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-2 block">
                <Star className="w-3.5 h-3.5" /> Popular
              </span>
              <h2 className="section-title">Explore Clubs</h2>
              <p className="section-subtitle mt-1 max-w-md">A few of the amazing communities you can join today</p>
            </div>
            <Link to="/clubs"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-petal-600 dark:text-petal-400 hover:text-petal-700 transition-colors"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {clubsLoading ? (
              Array(4).fill(0).map((_, i) => <ClubCardSkeleton key={i} />)
            ) : (
              featuredClubs.map((club, i) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <ClubCard club={club} />
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link to="/clubs" className="btn-secondary">See all clubs <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden">
        <div className="blob w-96 h-96 -bottom-24 -left-24 bg-bloom-100 dark:bg-bloom-900/15 opacity-60" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-2 block">
                <TrendingUp className="w-3.5 h-3.5" /> Happening Soon
              </span>
              <h2 className="section-title">Featured Events</h2>
              <p className="section-subtitle mt-1">Don't miss these highlights from across campus</p>
            </div>
            <Link to="/events"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-petal-600 dark:text-petal-400 hover:text-petal-700 transition-colors"
            >
              All events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventsLoading ? (
              Array(3).fill(0).map((_, i) => <EventCardSkeleton key={i} />)
            ) : (
              featuredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[2.5rem] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-petal-600 via-bloom-500 to-sand-400" />
            <div className="absolute inset-0 bg-noise opacity-20" />
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-black/10 blur-2xl" />

            <div className="relative z-10 text-center py-16 px-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold mb-6">
                  <GraduationCap className="w-3.5 h-3.5" /> Ready when you are
                </div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 leading-tight">
                  Your campus experience<br />starts here.
                </h2>
                <p className="text-white/80 text-base mb-8 max-w-lg mx-auto leading-relaxed">
                  Sign in to follow clubs, get event reminders, and — if you're a club rep — manage events and hall bookings directly.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {user ? (
                    <Link to={role === 'authority' ? '/dashboard/authority' : '/dashboard/rep'}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white text-petal-700 font-bold text-sm hover:bg-petal-50 transition-colors shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      Go to Dashboard <LayoutDashboard className="w-4 h-4" />
                    </Link>
                  ) : (
                    <>
                      <Link to="/login"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white text-petal-700 font-bold text-sm hover:bg-petal-50 transition-colors shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        Sign In <LogIn className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white/15 text-white border border-white/25 font-bold text-sm hover:bg-white/25 transition-colors"
                      >
                        Browse as Student
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
