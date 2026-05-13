import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Globe2, Share2, Link2, Heart, Sparkles } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Clubs Directory', to: '/clubs' },
    { label: 'Campus Events', to: '/events' },
    { label: 'Hall Booking', to: '/halls' },
    { label: 'Sign In', to: '/login' },
  ],
  Explore: [
    { label: 'Coding & Tech', to: '/clubs?tag=Coding' },
    { label: 'Performing Arts', to: '/clubs?tag=Dance' },
    { label: 'Sports & Athletics', to: '/clubs?tag=Sports' },
    { label: 'Literature & Writing', to: '/clubs?tag=Literature' },
  ],
  Support: [
    { label: 'About CampusHub', to: '#' },
    { label: 'Contact Us', to: '#' },
    { label: 'Report an Issue', to: '#' },
    { label: 'Privacy Policy', to: '#' },
  ],
};

const socials = [Share2, Link2, Globe2, Mail];

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white/40 dark:bg-grape-900/60 backdrop-blur-md" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-petal-200 dark:via-grape-700 to-transparent" />
      <div className="blob w-64 h-64 -top-16 right-1/4 bg-petal-100/60 dark:bg-petal-900/15 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 w-fit group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-petal-400 to-bloom-500 flex items-center justify-center shadow-petal group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-gray-50">
                Campus<span className="text-gradient">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
              Your all-in-one campus companion — clubs, events, and hall bookings, beautifully unified.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center
                    text-gray-400 dark:text-gray-500
                    bg-white/60 dark:bg-grape-800/60 backdrop-blur-sm
                    border border-petal-100 dark:border-grape-700
                    hover:bg-petal-50 dark:hover:bg-grape-700
                    hover:text-petal-600 dark:hover:text-petal-400
                    hover:border-petal-200 hover:-translate-y-0.5
                    transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-petal-600 dark:hover:text-petal-400 transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-petal-100/60 dark:border-grape-700/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} CampusHub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-bloom-400 fill-bloom-400 mx-0.5" /> for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
