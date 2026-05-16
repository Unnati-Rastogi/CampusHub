import { useState } from 'react';
import { Star, Loader2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addEventReview } from '../services/eventService';
import StudentAuthModal from './StudentAuthModal';
import { useToast } from '../context/ToastContext';
import { sendEmailVerification } from 'firebase/auth';

export default function ReviewForm({ eventId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, profile } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!user.emailVerified) {
      toast.warning(
        'Verify your email',
        'Please check your inbox and verify your email to post a review.'
      );
      // Optionally resend email
      try {
        await sendEmailVerification(user);
        toast.info('Verification link sent again.');
      } catch (err) {
        console.error(err);
      }
      return;
    }

    if (profile?.role !== 'student' && profile?.role !== 'club_rep') {
      toast.error('Access Denied', 'Only students can post reviews.');
      return;
    }
    
    // We expect students to have a USN. If club_rep, maybe allow anyway or require student.
    // The requirement says "only after their mail is verified and their usn"
    if (!profile?.usn && profile?.role === 'student') {
      toast.error('USN Required', 'Your profile is missing a USN.');
      return;
    }

    if (rating === 0) {
      toast.error('Rating required', 'Please select a star rating.');
      return;
    }

    setLoading(true);
    try {
      await addEventReview(eventId, {
        userId: user.uid,
        userName: profile?.displayName || user.displayName || 'Student',
        rating,
        comment: comment.trim()
      });
      toast.success('Review Submitted', 'Thank you for your feedback!');
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      toast.error('Failed to submit review', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-white/50 dark:bg-grape-800/40 border border-petal-100/40 dark:border-grape-700/40 mt-6">
        <h3 className="font-display font-bold text-gray-900 dark:text-gray-50 mb-3">Leave a Review</h3>
        
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoverRating || rating)
                    ? 'fill-sand-400 text-sand-400'
                    : 'text-gray-300 dark:text-gray-600'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
            {rating > 0 ? `${rating} out of 5` : 'Rate this event'}
          </span>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          placeholder="Share your thoughts about this event..."
          className="input-base resize-none mb-4"
          required
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-petal-600 hover:bg-petal-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Review
          </button>
        </div>
      </form>

      <StudentAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
