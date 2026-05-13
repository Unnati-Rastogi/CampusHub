import { Users, Wifi, Wind, Monitor, Volume2, Lightbulb, CheckCircle2, Clock } from 'lucide-react';

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
    <div className="group rounded-3xl overflow-hidden
      bg-white/60 dark:bg-grape-800/50
      backdrop-blur-md
      border border-white/70 dark:border-grape-700/40
      shadow-card hover:shadow-card-hover hover:-translate-y-1.5
      transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hall.image}
          alt={hall.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          {hall.isAvailable ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-500/90 backdrop-blur-sm text-white text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              Occupied
            </span>
          )}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-display font-bold text-white text-lg leading-tight">{hall.name}</h3>
          <p className="text-white/60 text-xs mt-0.5">{hall.location}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Capacity */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-petal-400" />
            <span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{hall.capacity.toLocaleString()}</span>
              {' '}capacity
            </span>
          </div>
          {hall.currentBooking && (
            <div className="flex items-center gap-1 text-xs font-medium text-sand-600 dark:text-sand-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{hall.currentBooking.time}</span>
            </div>
          )}
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Facilities</p>
          <div className="flex flex-wrap gap-1.5">
            {hall.facilities.map(facility => {
              const Icon = facilityIcons[facility] || CheckCircle2;
              return (
                <span key={facility}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full
                    bg-petal-50/80 dark:bg-grape-800/80
                    text-gray-600 dark:text-gray-400 text-xs font-medium
                    border border-petal-100/60 dark:border-grape-700/50"
                >
                  <Icon className="w-3 h-3 text-petal-400" />
                  {facility}
                </span>
              );
            })}
          </div>
        </div>

        {/* Current booking */}
        {hall.currentBooking && (
          <div className="mb-4 p-3 rounded-2xl bg-sand-50/80 dark:bg-sand-900/20 border border-sand-200/50 dark:border-sand-800/30">
            <p className="text-xs text-sand-700 dark:text-sand-400">
              <span className="font-semibold">In use:</span> {hall.currentBooking.event} by {hall.currentBooking.clubName}
            </p>
          </div>
        )}

        {/* Upcoming */}
        {hall.upcomingBookings.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Upcoming</p>
            {hall.upcomingBookings.slice(0, 2).map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-petal-400 flex-shrink-0" />
                <span>{b.event} · {b.date}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onRequestBooking(hall)}
          disabled={!hall.isAvailable}
          className={`w-full py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
            hall.isAvailable
              ? 'bg-gradient-to-r from-petal-500 to-bloom-500 text-white hover:opacity-90 hover:-translate-y-0.5 shadow-petal hover:shadow-petal-lg'
              : 'bg-gray-100 dark:bg-grape-800/60 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          {hall.isAvailable ? 'Request Booking' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
