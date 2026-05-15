import { useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { createEvent, updateEvent } from '../../services/eventService';
import { useToast } from '../../context/ToastContext';
import { useHalls } from '../../hooks/useHalls';

const CATEGORIES = ['Hackathon', 'Performance', 'Competition', 'Workshop', 'Theatre', 'Sports', 'Literary', 'Other'];

export default function EventEditor({ clubId, clubName, event, onSave, onCancel }) {
  const isEdit = Boolean(event);
  const toast = useToast();
  const { halls } = useHalls();

  const [form, setForm] = useState({
    title:       event?.title       || '',
    description: event?.description || '',
    venue:       event?.venue       || '',
    hallId:      event?.hallId      || '',
    date:        event?.date        || '',
    time:        event?.time        || '',
    category:    event?.category    || 'Workshop',
    isFeatured:  event?.isFeatured  || false,
    poster:      event?.poster      || '',
    tags:        event?.tags        || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving]     = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm(p => ({ ...p, tags: [...p.tags, t] }));
    setTagInput('');
  };

  const removeTag = (tag) => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 15-day rule validation
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 15) {
      toast.error('Validation Error', 'Events must be requested at least 15 days in advance.');
      return;
    }

    if (isEdit && event.status === 'approved') {
      const originalDate = new Date(event.date);
      originalDate.setHours(0, 0, 0, 0);
      if (selectedDate < originalDate) {
        toast.error('Validation Error', 'You cannot change an approved event to an earlier date.');
        return;
      }
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateEvent(event.id, { ...form, status: event.status === 'approved' ? 'approved' : 'pending' });
        toast.success('Event Updated', `"${form.title}" has been updated.`);
      } else {
        await createEvent({ ...form, clubId, clubName });
        toast.success('Event Requested', `"${form.title}" has been submitted for approval.`);
      }
      onSave?.();
    } catch (err) {
      toast.error('Save Failed', err.message || 'Could not save the event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Event Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required className="input-base" placeholder="e.g. Annual Hackathon 2025" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-base resize-none" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-base">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Venue</label>
          <input 
            list="hall-options"
            name="venue" 
            value={form.venue} 
            onChange={handleChange} 
            className="input-base" 
            placeholder="Select a hall or type a custom venue" 
          />
          <datalist id="hall-options">
            {halls?.map(h => <option key={h.id} value={h.name} />)}
          </datalist>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Date *</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="input-base" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Time</label>
          <input name="time" value={form.time} onChange={handleChange} className="input-base" placeholder="e.g. 9:00 AM – 5:00 PM" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Poster URL</label>
        <input name="poster" value={form.poster} onChange={handleChange} className="input-base" placeholder="https://..." />
        {form.poster && (
          <img
            src={form.poster}
            alt="preview"
            className="mt-2 w-full h-24 object-cover rounded-2xl border border-petal-100 dark:border-grape-700"
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add a tag…"
            className="input-base flex-1 py-1.5 text-xs"
          />
          <button type="button" onClick={addTag} className="px-3 py-1.5 rounded-xl bg-petal-100 dark:bg-petal-900/30 text-petal-700 dark:text-petal-300 text-xs font-bold">Add</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-petal-100 dark:bg-petal-900/30 text-petal-700 dark:text-petal-300 text-xs font-semibold">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-bloom-600 transition-colors">×</button>
            </span>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 rounded accent-petal-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Feature this event on the homepage</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-petal-500 to-bloom-500 text-white text-sm font-bold shadow-petal hover:opacity-90 transition-all disabled:opacity-60">
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? 'Updating…' : 'Creating…'}</>
            : <><CheckCircle2 className="w-4 h-4" />{isEdit ? 'Update Event' : 'Create Event'}</>
          }
        </button>
      </div>
    </form>
  );
}
