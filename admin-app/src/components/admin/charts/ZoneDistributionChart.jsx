import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const ZONE_LABELS = {
  window: 'Window Table',
  vip_room: 'VIP Room',
  terrace: 'Terrace',
  main_hall: 'Main Hall',
  private_dining: 'Private Dining',
  '': 'No Preference',
};

const GOLD_PALETTE = [
  '#D4AF37', '#C9A84C', '#B8962E', '#A07C20', '#8A6914',
  '#6B4F0A',
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, percent } = payload[0];
  return (
    <div className="glass-noir border border-gold/30 px-4 py-3">
      <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne mb-1">{name}</p>
      <p className="font-playfair text-gold text-lg">{value} <span className="text-xs text-champagne">{(percent * 100).toFixed(0)}%</span></p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="font-inter text-[10px] tracking-[0.1em] text-champagne uppercase">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function ZoneDistributionChart({ reservations }) {
  const data = useMemo(() => {
    const counts = {};
    reservations.forEach(r => {
      const zone = r.table_zone || '';
      counts[zone] = (counts[zone] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([zone, value]) => ({ name: ZONE_LABELS[zone] || zone, value }))
      .sort((a, b) => b.value - a.value);
  }, [reservations]);

  if (data.length === 0) {
    return (
      <div className="border border-gold/15 bg-[#0d0d0d] p-6 flex flex-col justify-between" style={{ minHeight: 320 }}>
        <div className="mb-6">
          <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-1">Phân Bổ Khu Vực</p>
          <h3 className="font-playfair text-xl text-bone">Loại Bàn Đặt</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="font-playfair italic text-champagne/40">Chưa có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gold/15 bg-[#0d0d0d] p-6">
      <div className="mb-6">
        <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-gold mb-1">Phân Bổ Khu Vực</p>
        <h3 className="font-playfair text-xl text-bone">Loại Bàn Đặt</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={GOLD_PALETTE[i % GOLD_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}