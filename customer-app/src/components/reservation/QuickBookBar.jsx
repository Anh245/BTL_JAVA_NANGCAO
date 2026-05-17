import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, ChevronDown } from 'lucide-react';

const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

export default function QuickBookBar({ onQuickBook }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [expanded, setExpanded] = useState(false);

  const handleCheck = () => {
    if (date && time && guests) {
      onQuickBook({ date, time, party_size: parseInt(guests) });
      document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setExpanded(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <motion.div
        layout
        className="glass-noir max-w-4xl mx-auto rounded-sm overflow-hidden"
      >
        {/* Collapsed Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 divide-y md:divide-y-0 md:divide-x divide-gold/20">
          {/* Date */}
          <div className="flex items-center gap-3 px-5 py-4 flex-1">
            <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="flex-1">
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-champagne block mb-1">Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="bg-transparent text-bone text-sm font-inter w-full outline-none placeholder-champagne/50 cursor-pointer"
              />
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 px-5 py-4 flex-1">
            <Clock className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="flex-1">
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-champagne block mb-1">Time</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="bg-transparent text-bone text-sm font-inter w-full outline-none cursor-pointer"
              >
                <option value="" className="bg-obsidian">Select time</option>
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t} className="bg-obsidian">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 px-5 py-4 flex-1">
            <Users className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="flex-1">
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-champagne block mb-1">Guests</label>
              <select
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="bg-transparent text-bone text-sm font-inter w-full outline-none cursor-pointer"
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-obsidian">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <div className="px-4 py-3">
            <button
              onClick={handleCheck}
              className="shimmer-btn w-full md:w-auto font-inter text-xs tracking-[0.25em] uppercase px-8 py-4 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300 whitespace-nowrap"
            >
              Check Availability
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}