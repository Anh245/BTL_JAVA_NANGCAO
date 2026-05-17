import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-noir border border-gold/30 px-4 py-3">
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne mb-1">{label} guests</p>
      <p className="font-playfair text-gold text-lg">{payload[0]?.value}
        <span className="text-xs text-champagne ml-1">tables</span>
      </p>
    </div>
  );
};

export default function PartySizeChart({ reservations }) {
  const data = useMemo(() => {
    const counts = {};
    for (let i = 1; i <= 12; i++) counts[i] = 0;
    reservations.forEach(r => {
      const size = Math.min(r.party_size || 1, 12);
      counts[size] = (counts[size] || 0) + 1;
    });
    return Object.entries(counts)
      .filter(([, v]) => v > 0 || true)
      .map(([size, value]) => ({ label: `${size}`, value }))
      .slice(0, 10);
  }, [reservations]);

  const avgSize = reservations.length > 0
    ? (reservations.reduce((s, r) => s + (r.party_size || 1), 0) / reservations.length).toFixed(1)
    : 0;

  return (
    <div className="border border-gold/15 bg-[#0d0d0d] p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-1">Quy Mô Nhóm</p>
          <h3 className="font-playfair text-xl text-bone">Party Size</h3>
        </div>
        <div className="text-right">
          <div className="font-playfair text-3xl text-gold">{avgSize}</div>
          <div className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-0.5">TB khách/bàn</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: 'Inter', fontSize: 10, fill: '#A39072' }}
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
            {data.map((_, i) => (
              <Cell key={i} fill={i % 2 === 0 ? '#D4AF37' : '#C9A84C'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}