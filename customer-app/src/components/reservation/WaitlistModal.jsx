import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waitlistApi } from '@/api/apiClient';
import { X, Clock, Users, Mail, Phone, User } from 'lucide-react';
import { format } from 'date-fns';

export default function WaitlistModal({ date, time, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', party_size: 2, notes: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await waitlistApi.create({
      ...form,
      date: format(date, 'yyyy-MM-dd'),
      time,
      partySize: form.party_size,
      status: 'waiting',
    });
    setLoading(false);
    setDone(true);
    if (onSuccess) onSuccess();
  };

  const inputClass = "w-full bg-transparent border-b border-gold/30 text-bone font-inter text-sm py-3 px-1 outline-none focus:border-gold transition-colors duration-300 placeholder-champagne/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md border border-gold/20 bg-[#0d0d0d] shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-champagne/40 hover:text-gold transition-colors">
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-6">
              <span className="text-gold text-2xl">✓</span>
            </div>
            <h3 className="font-playfair text-2xl text-bone mb-3">You're on the List</h3>
            <div className="hairline-gold w-12 mx-auto mb-4" />
            <p className="font-playfair italic text-champagne text-base leading-relaxed">
              We'll notify you at <em className="text-bone">{form.email}</em> if a spot opens for {time} on {format(date, 'MMMM d')}.
            </p>
            <button onClick={onClose} className="mt-8 font-inter text-xs tracking-[0.2em] uppercase text-champagne/50 hover:text-champagne transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="px-8 pt-8 pb-6 border-b border-gold/10">
              <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-2">Join Waitlist</p>
              <h3 className="font-playfair text-2xl text-bone">
                {format(date, 'MMMM d')} · {time}
              </h3>
              <p className="font-playfair italic text-champagne/70 text-sm mt-1">
                This slot is fully booked. We'll reach out if a spot opens.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              <div className="relative">
                <User className="absolute left-1 top-3.5 w-3.5 h-3.5 text-champagne/40" />
                <input type="text" placeholder="Full name" required value={form.name} onChange={e => set('name', e.target.value)} className={inputClass + ' pl-7'} />
              </div>
              <div className="relative">
                <Mail className="absolute left-1 top-3.5 w-3.5 h-3.5 text-champagne/40" />
                <input type="email" placeholder="Email address" required value={form.email} onChange={e => set('email', e.target.value)} className={inputClass + ' pl-7'} />
              </div>
              <div className="relative">
                <Phone className="absolute left-1 top-3.5 w-3.5 h-3.5 text-champagne/40" />
                <input type="tel" placeholder="Phone number" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass + ' pl-7'} />
              </div>
              <div className="relative">
                <Users className="absolute left-1 top-3.5 w-3.5 h-3.5 text-champagne/40" />
                <select value={form.party_size} onChange={e => set('party_size', parseInt(e.target.value))} className={inputClass + ' pl-7 bg-[#0d0d0d]'}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n} className="bg-[#0d0d0d]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <input type="text" placeholder="Any notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} className={inputClass} />

              <button
                type="submit"
                disabled={loading}
                className="shimmer-btn w-full font-inter text-xs tracking-[0.25em] uppercase py-4 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300 disabled:opacity-50 mt-2"
              >
                {loading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}