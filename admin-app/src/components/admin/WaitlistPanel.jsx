import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waitlistApi } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, XCircle, Clock, RefreshCw, Mail } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  waiting:   { label: 'Waiting',   className: 'border-gold/50 text-gold pulse-gold',         icon: Clock },
  notified:  { label: 'Notified',  className: 'border-blue-400/50 text-blue-400',             icon: Bell },
  confirmed: { label: 'Confirmed', className: 'border-bone/40 text-bone',                     icon: CheckCircle },
  expired:   { label: 'Expired',   className: 'border-champagne/20 text-champagne/40',        icon: XCircle },
};

export default function WaitlistPanel() {
  const [filterStatus, setFilterStatus] = useState('waiting');
  const queryClient = useQueryClient();

  const { data: waitlist = [], isLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: () => waitlistApi.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => waitlistApi.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waitlist'] }),
  });

  const notifyMutation = useMutation({
    mutationFn: async (entry) => {
      // Email notification (placeholder - implement actual email service)
      console.log(`Notify ${entry.email}: table available for ${entry.time} on ${entry.date}`);
      await waitlistApi.update(entry.id, { status: 'notified' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waitlist'] }),
  });

  const filtered = filterStatus === 'all' ? waitlist : waitlist.filter(w => w.status === filterStatus);

  const counts = {
    all: waitlist.length,
    waiting: waitlist.filter(w => w.status === 'waiting').length,
    notified: waitlist.filter(w => w.status === 'notified').length,
    confirmed: waitlist.filter(w => w.status === 'confirmed').length,
    expired: waitlist.filter(w => w.status === 'expired').length,
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {['all', 'waiting', 'notified', 'confirmed', 'expired'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`font-inter text-xs tracking-[0.15em] uppercase px-4 py-2.5 border transition-all duration-200 ${
              filterStatus === s
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-gold/20 text-champagne hover:border-gold/40'
            }`}
          >
            {s} {counts[s] > 0 && <span className="ml-1 opacity-60">({counts[s]})</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-gold/15 overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_140px_100px_80px_100px_180px] gap-4 px-6 py-4 bg-[#0d0d0d] border-b border-gold/15">
          {['Guest', 'Date & Time', 'Party', 'Status', 'Notes', 'Actions'].map(h => (
            <span key={h} className="font-inter text-[10px] tracking-[0.3em] uppercase text-champagne/50">{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-5 h-5 text-gold animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-playfair italic text-champagne">No waitlist entries.</p>
          </div>
        ) : (
          filtered.map((entry, i) => {
            const cfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG.waiting;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-1 md:grid-cols-[1fr_140px_100px_80px_100px_180px] gap-4 px-6 py-5 border-b border-gold/8 hover:bg-gold/3 transition-colors group"
              >
                <div>
                  <div className="font-playfair text-bone">{entry.name}</div>
                  <div className="font-inter text-xs text-champagne/50 mt-0.5">{entry.email}</div>
                  {entry.phone && <div className="font-inter text-xs text-champagne/40">{entry.phone}</div>}
                </div>

                <div>
                  <div className="font-inter text-sm text-bone">
                    {entry.date ? format(new Date(entry.date), 'MMM d') : '—'}
                  </div>
                  <div className="font-inter text-xs text-champagne/50 mt-0.5">{entry.time}</div>
                </div>

                <div className="font-inter text-sm text-champagne">{entry.partySize} guests</div>

                <div>
                  <span className={`font-inter text-[10px] tracking-[0.1em] uppercase px-2 py-1 border flex items-center gap-1 w-fit ${cfg.className}`}>
                    <Icon className="w-2.5 h-2.5" />
                    {cfg.label}
                  </span>
                </div>

                <div className="font-inter text-xs text-champagne/50 truncate">{entry.notes || '—'}</div>

                <div className="flex items-center gap-2 flex-wrap">
                  {entry.status === 'waiting' && (
                    <button
                      onClick={() => notifyMutation.mutate(entry)}
                      disabled={notifyMutation.isPending}
                      title="Notify guest by email"
                      className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border border-blue-400/30 text-blue-400 hover:border-blue-400/60 transition-colors disabled:opacity-40"
                    >
                      <Mail className="w-3 h-3" />
                      Notify
                    </button>
                  )}
                  {(entry.status === 'waiting' || entry.status === 'notified') && (
                    <button
                      onClick={() => updateMutation.mutate({ id: entry.id, status: 'confirmed' })}
                      title="Mark as confirmed"
                      className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border border-bone/20 text-bone hover:border-bone/40 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Confirm
                    </button>
                  )}
                  {entry.status !== 'expired' && entry.status !== 'confirmed' && (
                    <button
                      onClick={() => updateMutation.mutate({ id: entry.id, status: 'expired' })}
                      title="Mark as expired"
                      className="p-1 text-champagne/30 hover:text-red-400 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/30 text-right mt-4">
          {filtered.length} entries
        </p>
      )}
    </div>
  );
}