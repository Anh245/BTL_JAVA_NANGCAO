import { motion } from 'framer-motion';
import StatCards from './StatCards';
import ReservationsByDayChart from './charts/ReservationsByDayChart';
import ZoneDistributionChart from './charts/ZoneDistributionChart';
import ConversionFunnelChart from './charts/ConversionFunnelChart';
import OccasionChart from './charts/OccasionChart';
import PartySizeChart from './charts/PartySizeChart';
import TimeSlotChart from './charts/TimeSlotChart';

export default function AnalyticsDashboard({ reservations }) {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-3">Analytics · Intelligence</p>
        <div className="hairline-gold w-16 mb-6" />
        <h2 className="font-playfair text-3xl text-bone">Thống Kê Tổng Quan</h2>
        <p className="font-playfair italic text-champagne mt-2">
          Dữ liệu thời gian thực từ {reservations.length} lượt đặt bàn.
        </p>
      </div>

      {/* KPI Cards */}
      <StatCards reservations={reservations} />

      {/* Row 1 — Area + Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <ReservationsByDayChart reservations={reservations} />
        </div>
        <div>
          <ConversionFunnelChart reservations={reservations} />
        </div>
      </div>

      {/* Row 2 — Pie + Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ZoneDistributionChart reservations={reservations} />
        <OccasionChart reservations={reservations} />
      </div>

      {/* Row 3 — Party Size + Time Slot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PartySizeChart reservations={reservations} />
        <TimeSlotChart reservations={reservations} />
      </div>
    </div>
  );
}