import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reservationApi } from '@/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Bell } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isToday, isBefore, startOfDay } from 'date-fns';
import WaitlistModal from './WaitlistModal';

const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
const MAX_PER_SLOT = 4; // max concurrent reservations per time slot
const TOTAL_SLOTS = TIME_SLOTS.length;
const FULL_THRESHOLD = 0.9; // 90% booked = "full"

export default function AvailabilityCalendar({ onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [waitlistEntry, setWaitlistEntry] = useState(null); // { date, time }

  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations-calendar'],
    queryFn: () => reservationApi.filter({ status: 'pending,confirmed' }),
    staleTime: 30000,
  });

  // Build a map: { 'YYYY-MM-DD': { '18:00': count, ... } }
  const bookingMap = useMemo(() => {
    const map = {};
    reservations.forEach(r => {
      if (!r.date || !r.time) return;
      if (r.status === 'cancelled') return;
      if (!map[r.date]) map[r.date] = {};
      map[r.date][r.time] = (map[r.date][r.time] || 0) + 1;
    });
    return map;
  }, [reservations]);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startWeekday = getDay(startOfMonth(currentMonth)); // 0=Sun

  const getDayStatus = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    const dayBookings = bookingMap[key] || {};
    const totalBooked = Object.values(dayBookings).reduce((sum, c) => sum + c, 0);
    const totalCapacity = TOTAL_SLOTS * MAX_PER_SLOT;
    const ratio = totalBooked / totalCapacity;
    const fullyBooked = Object.values(dayBookings).every(c => c >= MAX_PER_SLOT) && Object.keys(dayBookings).length >= TOTAL_SLOTS;
    return { ratio, fullyBooked, totalBooked, dayBookings };
  };

  const getSlotStatus = (time) => {
    if (!selectedDate) return { count: 0, isFull: false };
    const key = format(selectedDate, 'yyyy-MM-dd');
    const count = bookingMap[key]?.[time] || 0;
    return { count, isFull: count >= MAX_PER_SLOT, available: MAX_PER_SLOT - count };
  };

  const today = startOfDay(new Date());

  const handleDayClick = (date) => {
    if (isBefore(date, today)) return;
    setSelectedDate(date);
    if (onSelectDate) onSelectDate(format(date, 'yyyy-MM-dd'));
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-4">Live Availability</p>
          <div className="hairline-gold w-20 mx-auto mb-6" />
          <h2 className="font-playfair text-4xl text-bone">Reserve Your Date</h2>
          <p className="font-playfair italic text-champagne mt-3 text-lg">
            Select an evening to view real-time slot availability.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Calendar */}
          <div className="border border-gold/15 bg-[#0d0d0d]">
            {/* Month Nav */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
              <button
                onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                disabled={isSameMonth(currentMonth, new Date())}
                className="p-1.5 text-champagne hover:text-gold transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-playfair text-xl text-bone">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <button
                onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="p-1.5 text-champagne hover:text-gold transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-gold/10">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-3 text-center font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/40">
                  {d}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for first week offset */}
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square border-r border-b border-gold/5" />
              ))}

              {daysInMonth.map((date, i) => {
                const isPast = isBefore(date, today);
                const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                const { ratio, fullyBooked, totalBooked } = isPast ? {} : getDayStatus(date);
                const colIndex = (startWeekday + i) % 7;
                const isLastCol = colIndex === 6;

                let dotColor = null;
                if (!isPast) {
                  if (fullyBooked) dotColor = 'bg-red-500';
                  else if (ratio > 0.5) dotColor = 'bg-yellow-500';
                  else if (totalBooked > 0) dotColor = 'bg-gold';
                }

                return (
                  <button
                    key={format(date, 'yyyy-MM-dd')}
                    onClick={() => handleDayClick(date)}
                    disabled={isPast}
                    className={`relative aspect-square flex flex-col items-center justify-center border-b border-gold/5 transition-all duration-200
                      ${isLastCol ? '' : 'border-r'}
                      ${isPast ? 'opacity-25 cursor-not-allowed' : 'hover:bg-gold/5 cursor-pointer'}
                      ${isSelected ? 'bg-gold/10 ring-1 ring-gold/40 ring-inset' : ''}
                      ${isToday(date) ? 'ring-1 ring-gold/20 ring-inset' : ''}
                    `}
                  >
                    <span className={`font-inter text-sm ${
                      isSelected ? 'text-gold font-semibold' :
                      isToday(date) ? 'text-gold' :
                      isPast ? 'text-champagne/30' :
                      'text-bone'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    {dotColor && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor}`} />
                    )}
                    {fullyBooked && !isPast && (
                      <span className="font-inter text-[7px] text-red-400 tracking-wider mt-0.5">FULL</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 px-6 py-4 border-t border-gold/10">
              {[
                { color: 'bg-gold', label: 'Available' },
                { color: 'bg-yellow-500', label: 'Filling Up' },
                { color: 'bg-red-500', label: 'Fully Booked' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="font-inter text-[10px] tracking-[0.15em] uppercase text-champagne/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slot Panel */}
          <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div
                key={format(selectedDate, 'yyyy-MM-dd')}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="border border-gold/15 bg-[#0d0d0d]"
              >
                <div className="px-6 py-5 border-b border-gold/10">
                  <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Selected Evening</p>
                  <h4 className="font-playfair text-2xl text-bone">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h4>
                </div>

                <div className="divide-y divide-gold/8">
                  {TIME_SLOTS.map(slot => {
                    const { count, isFull, available } = getSlotStatus(slot);
                    return (
                      <div
                        key={slot}
                        className={`flex items-center justify-between px-6 py-4 transition-colors ${
                          isFull ? 'opacity-50' : 'hover:bg-gold/4'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className={`w-3.5 h-3.5 ${isFull ? 'text-red-400/60' : 'text-gold'}`} />
                          <span className="font-inter text-sm text-bone">{slot}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Capacity bar */}
                          <div className="flex gap-1">
                            {Array.from({ length: MAX_PER_SLOT }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-4 rounded-sm transition-colors ${
                                  i < count
                                    ? isFull ? 'bg-red-500/70' : count >= MAX_PER_SLOT * 0.5 ? 'bg-yellow-500/80' : 'bg-gold/60'
                                    : 'bg-gold/10'
                                }`}
                              />
                            ))}
                          </div>
                          {isFull ? (
                            <button
                              onClick={() => setWaitlistEntry({ date: selectedDate, time: slot })}
                              className="flex items-center gap-1 font-inter text-[10px] tracking-[0.1em] uppercase px-2 py-1 border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                            >
                              <Bell className="w-2.5 h-2.5" />
                              Waitlist
                            </button>
                          ) : (
                            <span className="font-inter text-xs min-w-[60px] text-right text-champagne/60">
                              {available} left
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-6 py-5 border-t border-gold/10">
                  <a
                    href="#reservation"
                    className="shimmer-btn block w-full text-center font-inter text-xs tracking-[0.25em] uppercase py-4 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300"
                  >
                    Book This Evening
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gold/10 bg-[#0d0d0d] flex flex-col items-center justify-center py-20 px-8 text-center"
              >
                <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-gold/40" />
                </div>
                <p className="font-playfair italic text-champagne text-lg">Select a date</p>
                <p className="font-inter text-xs text-champagne/40 tracking-wider mt-2">
                  to view real-time slot availability
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {waitlistEntry && (
          <WaitlistModal
            date={waitlistEntry.date}
            time={waitlistEntry.time}
            onClose={() => setWaitlistEntry(null)}
            onSuccess={() => setWaitlistEntry(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}