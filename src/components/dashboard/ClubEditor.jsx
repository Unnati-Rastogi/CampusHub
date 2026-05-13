import { useState } from 'react';
import { Save, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';
import { updateClub } from '../../services/clubService';

const AVAILABLE_TAGS = ['Coding', 'Robotics', 'Photography', 'Dance', 'Music', 'Sports', 'Acting', 'Literature', 'Performing Arts', 'Engineering', 'Writing', 'Art', 'Hackathon', 'Open Source', 'Visual Media', 'Athletics', 'Health', 'Theatre', 'Debate'];

export default function ClubEditor({ club, onSave }) {
  const [form, setForm] = useState({
    name:          club.name          || '',
    tagline:       club.tagline       || '',
    description:   club.description   || '',
    logo:          club.logo          || '',
    banner:        club.banner        || '',
    contactEmail:  club.contactEmail  || '',
    memberCount:   club.memberCount   || '',
    tags:          club.tags          || [],
    socialLinks:   club.socialLinks   || { instagram: '', github: '', website: '', youtube: '', spotify: '' },
  });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setSaved(false);
  };

  const handleSocialChange = (platform, value) => {
    setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: value } }));
    setSaved(false);
  };

  const toggleTag = (tag) => {
    setForm(p => ({
      ...p,
      tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag],
    }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateClub(club.id, {
        ...form,
        memberCount: Number(form.memberCount),
      });
      setSaved(true);
      onSave?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Club Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-base" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tagline</label>
          <input name="tagline" value={form.tagline} onChange={handleChange} className="input-base" placeholder="A short catchy line" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-base resize-none" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Logo URL</label>
          <input name="logo" value={form.logo} onChange={handleChange} className="input-base" placeholder="https://..." />
          {form.logo && <img src={form.logo} alt="logo preview" className="mt-2 w-12 h-12 rounded-2xl object-cover border border-petal-100 dark:border-grape-700" onError={e => e.target.style.display='none'} />}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Banner URL</label>
          <input name="banner" value={form.banner} onChange={handleChange} className="input-base" placeholder="https://..." />
          {form.banner && <img src={form.banner} alt="banner preview" className="mt-2 w-full h-16 rounded-2xl object-cover border border-petal-100 dark:border-grape-700" onError={e => e.target.style.display='none'} />}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Contact Email</label>
          <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} className="input-base" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Member Count</label>
          <input type="number" name="memberCount" value={form.memberCount} onChange={handleChange} className="input-base" min="0" />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_TAGS.map(tag => (
            <button type="button" key={tag} onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                form.tags.includes(tag)
                  ? 'bg-petal-600 text-white border-petal-600'
                  : 'bg-white/60 dark:bg-grape-800/50 text-gray-600 dark:text-gray-400 border-petal-200/60 dark:border-grape-700/40 hover:border-petal-400'
              }`}>{tag}</button>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Social Links</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {Object.keys(form.socialLinks).map(platform => (
            <div key={platform} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize w-16 flex-shrink-0">{platform}</span>
              <input value={form.socialLinks[platform] || ''} onChange={e => handleSocialChange(platform, e.target.value)}
                placeholder={`https://...`} className="input-base flex-1 text-xs py-1.5" />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-bloom-600 dark:text-bloom-400 bg-bloom-50 dark:bg-bloom-900/20 p-3 rounded-2xl">{error}</p>}

      <button type="submit" disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-petal-500 to-bloom-500 text-white text-sm font-bold shadow-petal hover:opacity-90 transition-all disabled:opacity-60">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
    </form>
  );
}
