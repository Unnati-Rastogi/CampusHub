import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, BookOpen, Building2, Sparkles, Star, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { clubs } from '../data/clubs';
import { events } from '../data/events';
import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const stats = [
  { label: 'Active Clubs', value: '24+', icon: BookOpen, color: 'text-teal-500' },
  { label: 'Events this Month', value: '38', icon: CalendarDays, color: 'text-violet-500' },
  { label: 'Student Members', value: '1,200+', icon: Users, color: 'text-amber-500' },
  { label: 'Halls & Venues', value: '6', icon: Building2, color: 'text-rose-400' },
];

export default function HomePage() {
  const featuredClubs = clubs.slice(0, 4);
  const featuredEvents = events.filter(e => e.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-sand-50 via-white to-teal-50/30 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-teal-900/10 pt-16">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-100/40 dark:bg-teal-900/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-100/30 dark:bg-violet-900/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-50/20 dark:bg-amber-900/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial="hidden"
                animate="visible"
                custom={0}
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/50 text-teal-600 dark:text-teal-400 text-xs font-medium mb-6"
              >
                <Sparkles className="w-3 h-3" />
                Your campus, all in one place
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                custom={1}
                variants={fadeUp}
                className="font-display font-700 text-5xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-gray-50 leading-[1.1] tracking-tight mb-6"
              >
                Campus life,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-400">
                  simplified
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={2}
                variants={fadeUp}
                className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg"
              >
                Discover clubs you'll love, never miss a campus event, and book halls effortlessly — CampusHub brings everything together for students and club reps.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={3}
                variants={fadeUp}
                className="flex flex-wrap gap-3"
              >
                <Link to="/clubs" className="btn-primary text-sm px-6 py-3">
                  Explore Clubs <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/events" className="btn-secondary text-sm px-6 py-3">
                  View Events <CalendarDays className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial="hidden"
                animate="visible"
                custom={4}
                variants={fadeUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
              >
                {stats.map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center sm:text-left">
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-0.5">
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="font-display font-700 text-xl text-gray-900 dark:text-gray-50">
                          {stat.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</p>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right: Card Collage */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {clubs.slice(0, 4).map((club, i) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: i % 2 === 0 ? 0 : 16 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="card p-3 group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                >
                  <div className="h-24 rounded-xl overflow-hidden mb-3">
                    <img src={club.banner} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={club.logo} alt="" className="w-7 h-7 rounded-lg bg-white" />
                    <div>
                      <p className="text-xs font-600 text-gray-900 dark:text-gray-50 leading-tight">{club.name}</p>
                      <p className="text-[10px] text-gray-400">{club.memberCount} members</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-10 bg-white dark:bg-charcoal-900 border-y border-sand-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400', title: 'Club Directory', desc: 'Browse all 24+ active clubs with rich profiles, recent activities, and contact info.' },
              { icon: CalendarDays, color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400', title: 'Event Feed', desc: "See today's events, upcoming happenings, and featured shows — all in real time." },
              { icon: Building2, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', title: 'Hall Booking', desc: 'Check hall availability and request bookings with a streamlined approval workflow.' },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-sand-50 dark:hover:bg-charcoal-800 transition-colors duration-200">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-gray-900 dark:text-gray-50 text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="py-16 bg-sand-50/50 dark:bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">Popular</span>
              </div>
              <h2 className="section-title">Explore Clubs</h2>
              <p className="section-subtitle mt-1">A few of the amazing clubs you can be part of</p>
            </div>
            <Link to="/clubs" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
              See all clubs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link to="/clubs" className="btn-secondary">
              See all clubs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-white dark:bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">Happening Soon</span>
              </div>
              <h2 className="section-title">Featured Events</h2>
              <p className="section-subtitle mt-1">Don't miss these highlights from across campus</p>
            </div>
            <Link to="/events" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
              All events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-700 dark:to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-black/10 blur-2xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="font-display font-700 text-3xl sm:text-4xl text-white mb-4">
            Ready to get involved?
          </h2>
          <p className="text-teal-100 text-base leading-relaxed mb-8">
            Sign in to follow clubs, get event notifications, and — if you're a club rep — manage events and request hall bookings directly.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-700 font-medium text-sm hover:bg-teal-50 transition-colors shadow-sm">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/clubs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-medium text-sm hover:bg-white/20 transition-colors">
              Browse as Guest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
