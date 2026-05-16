import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Star, Flame, Timer } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getEventReviews } from '../services/eventService';
import { formatDate, formatTime } from '../lib/utils';
import TagBadge from '../components/TagBadge';
import PageLoader from '../components/PageLoader';
import ReviewForm from '../components/ReviewForm';

const categoryGradients = {
  Hackathon:   'from-sky-400 to-petal-500',
  Performance: 'from-bloom-400 to-petal-500',
  Competition: 'from-sand-400 to-bloom-500',
  Workshop:    'from-mint-400 to-sky-500',
  Theatre:     'from-bloom-400 to-sand-400',
  Sports:      'from-mint-400 to-sky-400',
  Literary:    'from-petal-400 to-bloom-400',
};
const defaultGradient = 'from-petal-400 to-bloom-400';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Failed to load event", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const data = await getEventReviews(id);
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  if (loading) return <PageLoader />;

  if (!event) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-petal-50 dark:bg-grape-800 flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-9 h-9 text-petal-200 dark:text-grape-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-2">Event not found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This event may have been removed.</p>
          <Link to="/events" className="btn-primary">Back to Events</Link>
        </div>
      </div>
    );
  }

  const gradient = categoryGradients[event.category] || defaultGradient;
  const isPastEvent = event.date ? new Date(event.date) < new Date(new Date().setHours(0,0,0,0)) : false;

  return (
    <div className="min-h-screen pt-16 pb-16">
      {/* Banner */}
      <div className={`relative h-56 sm:h-72 lg:h-96 overflow-hidden bg-gradient-to-br ${gradient}`}>
        {event.poster ? (
          <img
            src={event.poster}
            alt={`${event.title} banner`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <Calendar className="w-32 h-32 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-6 left-6 z-10">
          <Link to="/events" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 text-sm font-medium transition-colors border border-white/20 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Header card */}
        <div className="-mt-16 relative z-10 glass-card p-6 sm:p-8 mb-6 shadow-petal">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-bold text-petal-600 dark:text-petal-400 mb-1">{event.clubName}</p>
              <h1 className="font-display font-bold text-2xl sm:text-4xl text-gray-900 dark:text-gray-50 leading-tight mb-3">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-sm`}>
                  {event.category}
                </span>
                {event.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-petal-100/40 dark:border-grape-700/40">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-petal-50 dark:bg-petal-900/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-petal-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Date</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{formatDate(event.date, false, 'TBA')}</p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Time</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{formatTime(event.time)}</p>
                  </div>
                </div>
              )}

              {(event.venue || event.location) && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-mint-50 dark:bg-mint-900/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-mint-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Venue</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{event.venue || event.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-3">About this Event</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Post Event Details */}
            {isPastEvent && (event.winners || (event.postEventImages && event.postEventImages.length > 0)) && (
              <div className="glass-card p-6 border-2 border-sand-200/50 dark:border-sand-800/30">
                <h2 className="font-display font-bold text-lg text-sand-800 dark:text-sand-300 mb-4 flex items-center gap-2">
                  Event Results
                  <Star className="w-4 h-4 text-sand-400 fill-current" />
                </h2>
                
                {event.winners && (
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Winners</h3>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm font-medium">
                      {event.winners}
                    </p>
                  </div>
                )}

                {event.postEventImages && event.postEventImages.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {event.postEventImages.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                          <img src={img} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
                Reviews
                <span className="bg-petal-100 dark:bg-petal-900/30 text-petal-700 dark:text-petal-300 px-2 py-0.5 rounded-full text-xs">{reviews.length}</span>
              </h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {reviewsLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-petal-400" /></div>
                ) : reviews.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="pb-4 border-b border-gray-100 dark:border-grape-800/50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-50">{review.userName}</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-sand-400 text-sand-400' : 'text-gray-300 dark:text-gray-700'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {isPastEvent && (
                <ReviewForm eventId={id} onReviewAdded={loadReviews} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
