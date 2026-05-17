import { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';

const OCCASION_LABELS = {
  none: 'Regular',
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  business: 'Business',
  proposal: 'Proposal',
  other: 'Other',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-noir border border-gold/30 px-4 py-3">
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne mb-1">{payload[0]?.subject}</p>
      <p className="font-playfair text-gold text-lg">{payload[0]?.value}</p>
    </div>
  );
};

export default function OccasionChart({ reservations }) {
  const data = useMemo(() => {
    const counts = {};
    Object.keys(OCCASION_LABELS).forEach(k => { counts[k] = 0; });
    reservations.forEach(r => {
      const occ = r.occasion || 'none';
      if (counts[occ] !== undefined) counts[occ]++;
    });
    return Object.entries(OCCASION_LABELS).map(([key, label]) => ({
      subject: label,
      value: counts[key] || 0,
    }));
  }, [reservations]);

  return (
    <div className="border border-gold/15 bg-[#0d0d0d] p-6">
      <div className="mb-4">
        <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-1">Dịp Đặc Biệt</p>
        <h3 className="font-playfair text-xl text-bone">Loại Dịp</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(212,175,55,0.12)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontFamily: 'Inter', fontSize: 10, fill: '#A39072', letterSpacing: '0.05em' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            dataKey="value"
            stroke="#D4AF37"
            strokeWidth={1.5}
            fill="#D4AF37"
            fillOpacity={0.15}
            dot={{ fill: '#D4AF37', r: 3, strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}