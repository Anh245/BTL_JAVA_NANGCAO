import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const TIME_SLOTS = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-noir border border-gold/30 px-4 py-3">
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne mb-1">{label}</p>
      <p className="font-playfair text-gold text-lg">{payload[0]?.value}
        <span className="text-xs text-champagne ml-1">bookings</span>
      </p>
    </div>
  );
};

export default function TimeSlotChart({ reservations }) {
  const data = useMemo(() => {
    const counts = {};
    TIME_SLOTS.forEach(t => { counts[t] = 0; });
    reservations.forEach(r => {
      if (r.time && counts[r.time] !== undefined) counts[r.time]++;
    });
    return TIME_SLOTS.map(t => ({ label: t, value: counts[t] }));
  }, [reservations]);

  const peakSlot = data.reduce((max, d) => d.value > max.value ? d : max, { value: 0 });

  return (
    <div className="border border-gold/15 bg-[#0d0d0d] p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-1">Giờ Cao Điểm</p>
          <h3 className="font-playfair text-xl text-bone">Khung Giờ Đặt Bàn</h3>
        </div>
        {peakSlot.value > 0 && (
          <div className="text-right">
            <div className="font-playfair text-xl text-gold">{peakSlot.label}</div>
            <div className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mt-0.5">Giờ đông nhất</div>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: 'Inter', fontSize: 9, fill: '#A39072' }}
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
              <Cell
                key={i}
                fill={entry.label === peakSlot.label ? '#D4AF37' : 'rgba(212,175,55,0.25)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}