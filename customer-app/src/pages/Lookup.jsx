import SiteHeader from '../components/reservation/SiteHeader';
import ReservationLookup from '../components/lookup/ReservationLookup';

export default function Lookup() {
  return (
    <div className="bg-obsidian min-h-screen">
      <SiteHeader />
      <div className="pt-24">
        <ReservationLookup />
      </div>
    </div>
  );
}
