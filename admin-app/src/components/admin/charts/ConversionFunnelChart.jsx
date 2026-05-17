import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-noir border border-gold/30 px-4 py-3">
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne mb-1">{label}</p>
      <p className="font-playfair text-gold text-lg">{payload[0]?.value}
        <span className="text-xs text-champagne ml-1">reservations</span>
      </p>
    </div>
  );
};

export default function ConversionFunnelChart({ reservations }) {
  const data = useMemo(() => {
    const total = reservations.length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    return [
      { label: 'Total', value: total, color: '#A39072' },
      { label: 'Confirmed', value: confirmed, color: '#D4AF37' },
      { label: 'Pending', value: pending, color: '#C9A84C' },
      { label: 'Cancelled', value: cancelled, color: '#7f1d1d' },
    ];
  }, [reservations]);

  const conversionRate = reservations.length > 0
    ? ((reservations.filter(r => r.status === 'confirmed').length / reservations.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="border border-gold/15 bg-[#0d0d0d] p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-1">Tỷ Lệ Chuyển Đổi</p>
          <h3 className="font-playfair text-xl text-bone">Conversion Funnel</h3>
        </div>
        <div className="text-right">
          <div className="font-playfair text-3xl text-gold">{conversionRate}%</div>
          <div className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-0.5">Tỷ lệ xác nhận</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: 'Inter', fontSize: 10, fill: '#A39072', letterSpacing: '0.05em' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'Inter', fontSize: 10, fill: '#A39072' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,175,55,0.04)' }} />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}