import { Users, Wifi, Wind, Monitor, Volume2, Lightbulb, CheckCircle2, XCircle, Clock } from 'lucide-react';

const facilityIcons = {
  'AC': Wind,
  'Projector': Monitor,
  'Sound System': Volume2,
  'Stage Lighting': Lightbulb,
  'High-Speed WiFi': Wifi,
  'Wheelchair Access': CheckCircle2,
  'Whiteboards': Monitor,
  'Recording Equipment': Monitor,
  'Podium': Monitor,
  'Green Room': CheckCircle2,
  'Flexible Seating': CheckCircle2,
  'Recording': Monitor,
  'Natural Lighting': Lightbulb,
  'Lawn Seating': CheckCircle2,
  'Standing Desks': CheckCircle2,
  'Open Stage': CheckCircle2,
};

export default function HallCard({ hall, onRequestBooking }) {
  return (
    <div className="card group overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          src={hall.image}
          alt={hall.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {hall.isAvailable ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/90 backdrop-blur-sm text-white text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/90 backdrop-blur-sm text-white text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Occupied
            </span>
          )}
        </div>

        {/* Hall name overlay */}
        <div className="absolute bottom-3 left-4">
          <h3 className="font-display font-700 text-white text-lg leading-tight">{hall.name}</h3>
          <p className="text-white/70 text-xs">{hall.location}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Capacity */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-teal-500" />
            <span><span className="font-600 text-gray-900 dark:text-gray-100">{hall.capacity.toLocaleString()}</span> capacity</span>
          </div>
          {hall.currentBooking && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{hall.currentBooking.time}</span>
            </div>
          )}
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Facilities</p>
          <div className="flex flex-wrap gap-1.5">
            {hall.facilities.map(facility => {
              const Icon = facilityIcons[facility] || CheckCircle2;
              return (
                <span
                  key={facility}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand-50 dark:bg-charcoal-800 text-gray-600 dark:text-gray-400 text-xs border border-sand-100 dark:border-gray-700"
                >
                  <Icon className="w-3 h-3 text-teal-400" />
                  {facility}
                </span>
              );
            })}
          </div>
        </div>

        {/* Current Booking Note */}
        {hall.currentBooking && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <span className="font-medium">Currently in use:</span> {hall.currentBooking.event} by {hall.currentBooking.clubName}
            </p>
          </div>
        )}

        {/* Upcoming Bookings */}
        {hall.upcomingBookings.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Upcoming</p>
            <div className="space-y-1">
              {hall.upcomingBookings.slice(0, 2).map((b, i) => (
                <div key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0" />
                  <span>{b.event} · {b.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onRequestBooking(hall)}
          disabled={!hall.isAvailable}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            hall.isAvailable
              ? 'bg-teal-500 text-white hover:bg-teal-600 hover:shadow-md hover:-translate-y-0.5'
              : 'bg-gray-100 dark:bg-charcoal-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          {hall.isAvailable ? 'Request Booking' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
