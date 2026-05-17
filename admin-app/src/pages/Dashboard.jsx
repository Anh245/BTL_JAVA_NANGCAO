import AdminDashboard from '../components/reservation/AdminDashboard';
import { authApi } from '@/api/apiClient';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="bg-obsidian min-h-screen">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-noir py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="font-playfair text-xl text-bone tracking-wider">AURELIAN</span>
            <span className="font-inter text-[9px] tracking-[0.5em] uppercase text-gold">Admin Console</span>
          </div>
          <button
            onClick={() => authApi.logout()}
            className="flex items-center gap-2 font-inter text-[10px] tracking-[0.3em] uppercase text-champagne/50 hover:text-gold transition-colors duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đăng Xuất
          </button>
        </div>
      </header>
      <div className="pt-24">
        <AdminDashboard />
      </div>
    </div>
  );
}
