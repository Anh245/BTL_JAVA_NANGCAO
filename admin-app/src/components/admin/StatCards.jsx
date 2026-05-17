import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCards({ reservations }) {
  const total = reservations.length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const cancelled = reservations.filter(r => r.status === 'cancelled').length;
  const convRate = total > 0 ? ((confirmed / total) * 100).toFixed(1) : 0;
  const totalGuests = reservations.reduce((s, r) => s + (r.party_size || 0), 0);

  const cards = [
    {
      label: 'Tổng Đặt Bàn',
      value: total,
      sub: 'tất cả trạng thái',
      color: 'text-bone',
      border: 'border-gold/20',
    },
    {
      label: 'Đã Xác Nhận',
      value: confirmed,
      sub: `${convRate}% conversion`,
      color: 'text-gold',
      border: 'border-gold/40',
      highlight: true,
    },
    {
      label: 'Chờ Duyệt',
      value: pending,
      sub: 'cần xử lý',
      color: 'text-brass',
      border: 'border-brass/30',
    },
    {
      label: 'Đã Huỷ',
      value: cancelled,
      sub: `${total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0}% tỷ lệ huỷ`,
      color: 'text-red-400',
      border: 'border-red-900/40',
    },
    {
      label: 'Tổng Khách',
      value: totalGuests,
      sub: 'lượt khách dự kiến',
      color: 'text-bone',
      border: 'border-gold/15',
    },
    {
      label: 'TB Nhóm',
      value: total > 0 ? (totalGuests / total).toFixed(1) : '—',
      sub: 'khách / bàn',
      color: 'text-champagne',
      border: 'border-gold/15',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-10">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className={`border ${card.border} bg-[#0d0d0d] p-5 ${card.highlight ? 'ring-1 ring-gold/20' : ''}`}
        >
          <div className={`font-playfair text-3xl ${card.color} mb-1`}>{card.value}</div>
          <div className="font-inter text-[10px] tracking-[0.2em] uppercase text-bone/80 leading-tight">{card.label}</div>
          <div className="font-inter text-[9px] text-champagne/40 mt-1 tracking-wide">{card.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}