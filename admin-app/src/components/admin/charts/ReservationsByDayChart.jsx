import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-noir border border-gold/30 px-4 py-3">
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne mb-1">{label}</p>
      <p className="font-playfair text-gold text-lg">{payload[0]?.value} <span className="text-xs text-champagne">bookings</span></p>
    </div>
  );
};

export default function ReservationsByDayChart({ reservations }) {
  const data = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = subDays(new Date(), 13 - i);
      const key = format(d, 'yyyy-MM-dd');
      const label = format(d, 'MMM d');
      const count = reservations.filter(r => r.date === key).length;
      return { label, count, date: key };
    });
    return days;
  }, [reservations]);

  return (
    <div className="border border-gold/15 bg-[#0d0d0d] p-6">
      <div className="mb-6">
        <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-1">Theo Ngày</p>
        <h3 className="font-playfair text-xl text-bone">Lượt Đặt Bàn 14 Ngày</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: 'Inter', fontSize: 10, fill: '#A39072', letterSpacing: '0.05em' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontFamily: 'Inter', fontSize: 10, fill: '#A39072' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#D4AF37"
            strokeWidth={1.5}
            fill="url(#goldGrad)"
            dot={{ fill: '#D4AF37', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#D4AF37', r: 5, stroke: '#0A0A0A', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}