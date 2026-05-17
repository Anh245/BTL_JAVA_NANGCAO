import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { guestApi, tableApi, reservationApi } from '@/api/apiClient';
import { User, Mail, Phone, Calendar, Clock, Users, MessageSquare, Star } from 'lucide-react';

const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
const OCCASIONS = [
  { value: 'none', label: 'No Special Occasion' },
  { value: 'birthday', label: 'Birthday Celebration' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'business', label: 'Business Dinner' },
  { value: 'proposal', label: 'Marriage Proposal' },
  { value: 'other', label: 'Other' },
];

const STEP_LABELS = ['Personal', 'Preferences', 'Confirm'];

export default function ReservationForm({ prefill = {} }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guest_notes: '',
    date: prefill.date || '',
    time: prefill.time || '',
    party_size: prefill.party_size || 2,
    table_zone: prefill.table_zone || '',
    occasion: 'none',
    special_requests: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    // 1. Create or find guest
    const guest = await guestApi.create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      notes: form.guest_notes,
    });
    // 2. Find table by zone if selected
    let tableId = null;
    if (form.table_zone) {
      const tables = await tableApi.filter({ zone: form.table_zone, available: true });
      if (tables.length > 0) tableId = tables[0].id;
    }
    // 3. Create reservation linked to guest (and optionally table)
    await reservationApi.create({
      guestId: guest.id,
      ...(tableId ? { tableId } : {}),
      date: form.date,
      time: form.time,
      partySize: form.party_size,
      occasion: form.occasion,
      specialRequests: form.special_requests,
      status: 'pending',
    });
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = "w-full bg-transparent border-b border-gold/30 text-bone font-playfair text-base py-3 px-1 outline-none focus:border-gold transition-colors duration-300 placeholder-champagne/40";
  const selectClass = "w-full bg-[#0d0d0d] border-b border-gold/30 text-bone font-inter text-sm py-3 px-1 outline-none focus:border-gold transition-colors duration-300";

  // Confirmation Seal
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-20">
        <motion.div
          className="seal-animation flex flex-col items-center"
        >
          {/* Gold Seal */}
          <div className="w-32 h-32 rounded-full border-2 border-gold flex items-center justify-center gold-glow mb-8 relative">
            <div className="absolute inset-2 rounded-full border border-gold/40" />
            <div className="text-center">
              <div className="font-inter text-[8px] tracking-[0.3em] uppercase text-gold block">Reserved</div>
              <Star className="w-6 h-6 text-gold mx-auto mt-1" />
              <div className="font-inter text-[8px] tracking-[0.3em] uppercase text-gold block mt-1">✦ ✦ ✦</div>
            </div>
          </div>

          <div className="text-center max-w-md">
            <h3 className="font-playfair text-3xl text-bone mb-4">Your Table Awaits</h3>
            <div className="hairline-gold w-16 mx-auto mb-6" />
            <p className="font-playfair italic text-champagne text-lg leading-relaxed mb-4">
              Your reservation has been received, <em className="text-bone">{form.name}</em>. We will confirm your booking via email shortly.
            </p>
            <p className="font-inter text-xs text-champagne/60 tracking-wider">
              {form.date} · {form.time} · {form.party_size} Guests
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-16 gap-0">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                  done ? 'border-gold bg-gold' : active ? 'border-gold' : 'border-gold/20'
                }`}>
                  {done ? (
                    <span className="text-obsidian font-inter text-xs font-bold">✓</span>
                  ) : (
                    <span className={`font-inter text-xs ${active ? 'text-gold' : 'text-champagne/40'}`}>{num}</span>
                  )}
                </div>
                <span className={`font-inter text-[10px] tracking-[0.2em] uppercase mt-2 ${active ? 'text-gold' : 'text-champagne/40'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`w-20 h-px mx-4 mb-6 transition-all duration-500 ${done ? 'bg-gold' : 'bg-gold/15'}`} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 max-w-xl mx-auto"
          >
            <div className="text-center mb-10">
              <h3 className="font-playfair text-2xl text-bone">Personal Details</h3>
              <p className="font-playfair italic text-champagne mt-2">How shall we address you?</p>
            </div>

            <div className="relative">
              <User className="absolute left-1 top-4 w-4 h-4 text-champagne/50" />
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={inputClass + " pl-8"}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-1 top-4 w-4 h-4 text-champagne/50" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={inputClass + " pl-8"}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-1 top-4 w-4 h-4 text-champagne/50" />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className={inputClass + " pl-8"}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.email || !form.phone}
              className="shimmer-btn w-full font-inter text-sm tracking-[0.25em] uppercase py-5 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed mt-8"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 max-w-xl mx-auto"
          >
            <div className="text-center mb-10">
              <h3 className="font-playfair text-2xl text-bone">Reservation Preferences</h3>
              <p className="font-playfair italic text-champagne mt-2">Set the scene for your evening.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <Calendar className="absolute left-1 top-4 w-4 h-4 text-champagne/50" />
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => set('date', e.target.value)}
                  className={inputClass + " pl-8"}
                />
                <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-1">Date</label>
              </div>

              <div className="relative">
                <Clock className="absolute left-1 top-4 w-4 h-4 text-champagne/50" />
                <select value={form.time} onChange={e => set('time', e.target.value)} className={selectClass + " pl-8"}>
                  <option value="" className="bg-obsidian">Select time</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-obsidian">{t}</option>)}
                </select>
                <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-1">Time</label>
              </div>
            </div>

            <div className="relative">
              <Users className="absolute left-1 top-4 w-4 h-4 text-champagne/50" />
              <select value={form.party_size} onChange={e => set('party_size', parseInt(e.target.value))} className={selectClass + " pl-8"}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                  <option key={n} value={n} className="bg-obsidian">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
              <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-1">Party Size</label>
            </div>

            <div>
              <select value={form.table_zone} onChange={e => set('table_zone', e.target.value)} className={selectClass}>
                <option value="" className="bg-obsidian">No zone preference</option>
                <option value="window" className="bg-obsidian">Window Table</option>
                <option value="vip_room" className="bg-obsidian">VIP Room</option>
                <option value="terrace" className="bg-obsidian">Terrace</option>
                <option value="main_hall" className="bg-obsidian">Main Hall</option>
                <option value="private_dining" className="bg-obsidian">Private Dining</option>
              </select>
              <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-1">Preferred Zone</label>
            </div>

            <div>
              <select value={form.occasion} onChange={e => set('occasion', e.target.value)} className={selectClass}>
                {OCCASIONS.map(o => <option key={o.value} value={o.value} className="bg-obsidian">{o.label}</option>)}
              </select>
              <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-1">Special Occasion</label>
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-1 top-3 w-4 h-4 text-champagne/50" />
              <textarea
                placeholder="Special requests for this booking..."
                value={form.special_requests}
                onChange={e => set('special_requests', e.target.value)}
                rows={3}
                className={inputClass + " pl-8 resize-none"}
              />
              <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-1">Special Requests</label>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 font-inter text-sm tracking-[0.2em] uppercase py-4 border border-gold/30 text-champagne hover:border-gold hover:text-gold transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.date || !form.time}
                className="shimmer-btn flex-1 font-inter text-sm tracking-[0.25em] uppercase py-4 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Review
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <div className="text-center mb-10">
              <h3 className="font-playfair text-2xl text-bone">Confirm Your Reservation</h3>
              <p className="font-playfair italic text-champagne mt-2">Please review the details below.</p>
            </div>

            <div className="border border-gold/20 divide-y divide-gold/10 mb-10">
              {[
                { label: 'Guest', value: form.name },
                { label: 'Email', value: form.email },
                { label: 'Phone', value: form.phone || '—' },
                { label: 'Date', value: form.date },
                { label: 'Time', value: form.time },
                { label: 'Party Size', value: `${form.party_size} Guests` },
                { label: 'Zone', value: form.table_zone ? form.table_zone.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'No preference' },
                { label: 'Occasion', value: OCCASIONS.find(o => o.value === form.occasion)?.label || '—' },
                { label: 'Special Requests', value: form.special_requests || '—' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-start px-6 py-4">
                  <span className="font-inter text-[11px] tracking-[0.2em] uppercase text-champagne">{row.label}</span>
                  <span className="font-playfair text-bone text-right max-w-xs">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 font-inter text-sm tracking-[0.2em] uppercase py-4 border border-gold/30 text-champagne hover:border-gold hover:text-gold transition-all duration-300"
              >
                Amend
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="shimmer-btn flex-1 font-inter text-sm tracking-[0.25em] uppercase py-4 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Reserving...' : 'Confirm Reservation'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}