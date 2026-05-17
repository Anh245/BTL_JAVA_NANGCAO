import { useState } from 'react';
import { motion } from 'framer-motion';
import SiteHeader from '../components/reservation/SiteHeader';
import HeroSection from '../components/reservation/HeroSection';
import QuickBookBar from '../components/reservation/QuickBookBar';
import TableMapSection from '../components/reservation/TableMapSection';
import MenuSection from '../components/reservation/MenuSection';
import ReservationForm from '../components/reservation/ReservationForm';
import AvailabilityCalendar from '../components/reservation/AvailabilityCalendar';

export default function Home() {
  const [selectedZone, setSelectedZone] = useState('');
  const [prefill, setPrefill] = useState({});

  const handleQuickBook = (data) => {
    setPrefill(data);
  };

  const handleZoneSelect = (zoneId) => {
    setSelectedZone(zoneId);
    setPrefill(prev => ({ ...prev, table_zone: zoneId }));
  };

  return (
    <div className="bg-obsidian min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <HeroSection />

      {/* Quick Book Bar — floating */}
      <QuickBookBar onQuickBook={handleQuickBook} />

      {/* Menu */}
      <MenuSection />

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="hairline-gold" />
      </div>

      {/* Table Map */}
      <div id="tables">
        <TableMapSection onZoneSelect={handleZoneSelect} selectedZone={selectedZone} />
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="hairline-gold" />
      </div>

      {/* Availability Calendar */}
      <div id="availability" className="bg-[#070707]">
        <AvailabilityCalendar onSelectDate={(date) => setPrefill(prev => ({ ...prev, date }))} />
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="hairline-gold" />
      </div>

      {/* Reservation Form */}
      <section id="reservation" className="py-32 px-6 bg-[#070707]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-4">The Reservation Sanctum</p>
            <div className="hairline-gold w-20 mx-auto mb-6" />
            <h2 className="font-playfair text-4xl md:text-5xl text-bone">Secure Your Evening</h2>
            <p className="font-playfair italic text-champagne mt-4 text-lg max-w-md mx-auto">
              Three steps to an unforgettable night.
            </p>
          </div>

          <ReservationForm prefill={prefill} key={JSON.stringify(prefill)} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold/10 py-16 px-6 bg-obsidian">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-playfair text-2xl text-bone mb-2">AURELIAN</p>
          <div className="hairline-gold w-16 mx-auto mb-6" />
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-champagne/50 mb-4">
            12 Rue de la Paix · Paris · +33 1 23 45 67 89
          </p>
          <p className="font-playfair italic text-champagne/30 text-sm">
            Open nightly, 18:00 – 23:00 · Reservations required
          </p>
          <div className="mt-8 hairline-gold w-16 mx-auto" />
          {/* Spacer for floating bar */}
          <div className="h-24" />
        </div>
      </footer>
    </div>
  );
}