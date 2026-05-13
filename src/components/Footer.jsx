import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Globe2, Share2, Link2, Heart } from 'lucide-react';

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

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-charcoal-900 border-t border-sand-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-700 text-lg text-gray-900 dark:text-gray-50 tracking-tight">
                Campus<span className="text-teal-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
              Your all-in-one campus companion. Discover clubs, stay updated on events, and manage hall bookings — all in one place.
            </p>
            <div className="flex items-center gap-3">
              {[Share2, Link2, Globe2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-600 uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-sand-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} CampusHub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-400" /> for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
