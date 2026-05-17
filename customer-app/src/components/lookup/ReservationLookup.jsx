import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reservationApi, guestApi } from '@/api/apiClient';
import { Search, Phone, Calendar, Clock, Users, Edit3, X, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  pending: { label: 'Chờ xác nhận', className: 'border-gold/50 text-gold', icon: Clock },
  confirmed: { label: 'Đã xác nhận', className: 'border-green-500/50 text-green-400', icon: CheckCircle },
  cancelled: { label: 'Đã huỷ', className: 'border-red-800/50 text-red-400', icon: XCircle },
};

const TIME_SLOTS = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];

export default function ReservationLookup() {
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const results = await reservationApi.lookupByPhone(phone.trim());
      setReservations(results);
      // Fetch guest info for each unique guestId
      const guestIds = [...new Set(results.map(r => r.guestId).filter(Boolean))];
      const guestMap = {};
      for (const gid of guestIds) {
        try { guestMap[gid] = await guestApi.getById(gid); } catch {}
      }
      setGuests(guestMap);
    } catch (err) {
      console.error(err);
      setReservations([]);
    }
    setLoading(false);
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditForm({ date: r.date, time: r.time, partySize: r.partySize, specialRequests: r.specialRequests || '' });
  };

  const saveEdit = async (id) => {
    try {
      await reservationApi.updateByPhone(id, phone.trim(), editForm);
      setEditingId(null);
      handleSearch(); // refresh
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    }
  };

  const cancelReservation = async (id) => {
    if (!confirm('Bạn có chắc muốn huỷ đặt bàn này?')) return;
    try {
      await reservationApi.updateByPhone(id, phone.trim(), { status: 'cancelled' });
      handleSearch();
    } catch (err) {
      alert('Huỷ thất bại: ' + err.message);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-gold/30 text-bone font-inter text-sm py-3 px-1 outline-none focus:border-gold transition-colors duration-300 placeholder-champagne/30";

  return (
    <section className="py-32 px-6 bg-[#070707] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-4">Tra Cứu Đặt Bàn</p>
          <div className="hairline-gold w-20 mx-auto mb-6" />
          <h2 className="font-playfair text-4xl text-bone">Quản Lý Đặt Bàn</h2>
          <p className="font-playfair italic text-champagne mt-4 text-lg max-w-md mx-auto">
            Nhập số điện thoại để xem và chỉnh sửa thông tin đặt bàn của bạn.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-12">
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne/50" />
            <input
              type="tel"
              placeholder="Nhập số điện thoại..."
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#0d0d0d] border border-gold/20 text-bone font-inter text-sm pl-10 pr-4 py-4 outline-none focus:border-gold/60 transition-colors duration-300 placeholder-champagne/30"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !phone.trim()}
            className="shimmer-btn font-inter text-xs tracking-[0.2em] uppercase px-8 py-4 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300 disabled:opacity-30 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Tìm
          </button>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
            </motion.div>
          ) : searched && reservations.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 border border-gold/10">
              <p className="font-playfair italic text-champagne text-lg">Không tìm thấy đặt bàn nào với số điện thoại này.</p>
            </motion.div>
          ) : reservations.length > 0 ? (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mb-6">
                Tìm thấy {reservations.length} lượt đặt bàn
              </p>
              {reservations.map((r, i) => {
                const guest = guests[r.guestId] || {};
                const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                const isEditing = editingId === r.id;

                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="border border-gold/15 bg-[#0d0d0d] overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-playfair text-xl text-bone">{guest.name || 'Guest'}</h3>
                          <p className="font-inter text-xs text-champagne/50 mt-1">{guest.email}</p>
                        </div>
                        <span className={`font-inter text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border flex items-center gap-1 ${cfg.className}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-4 mt-6 border-t border-gold/10 pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mb-1">Ngày</label>
                              <input type="date" value={editForm.date || ''} onChange={e => setEditForm({...editForm, date: e.target.value})} className={inputClass} />
                            </div>
                            <div>
                              <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mb-1">Giờ</label>
                              <select value={editForm.time || ''} onChange={e => setEditForm({...editForm, time: e.target.value})} className={inputClass + " bg-[#0d0d0d]"}>
                                {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-[#0d0d0d]">{t}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mb-1">Số khách</label>
                            <select value={editForm.partySize} onChange={e => setEditForm({...editForm, partySize: parseInt(e.target.value)})} className={inputClass + " bg-[#0d0d0d]"}>
                              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n} className="bg-[#0d0d0d]">{n}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/50 mb-1">Yêu cầu đặc biệt</label>
                            <textarea value={editForm.specialRequests} onChange={e => setEditForm({...editForm, specialRequests: e.target.value})} rows={2} className={inputClass + " resize-none"} />
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => saveEdit(r.id)} className="shimmer-btn flex-1 font-inter text-xs tracking-[0.2em] uppercase py-3 bg-gold text-obsidian font-semibold hover:bg-brass transition-all">Lưu</button>
                            <button onClick={() => setEditingId(null)} className="flex-1 font-inter text-xs tracking-[0.2em] uppercase py-3 border border-gold/30 text-champagne hover:border-gold transition-all">Huỷ</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-champagne">
                              <Calendar className="w-3.5 h-3.5 text-gold" />
                              <span className="font-inter">{r.date ? format(new Date(r.date), 'dd/MM/yyyy') : '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-champagne">
                              <Clock className="w-3.5 h-3.5 text-gold" />
                              <span className="font-inter">{r.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-champagne">
                              <Users className="w-3.5 h-3.5 text-gold" />
                              <span className="font-inter">{r.partySize} khách</span>
                            </div>
                          </div>
                          {r.specialRequests && (
                            <p className="font-inter text-xs text-champagne/50 mt-3 italic">"{r.specialRequests}"</p>
                          )}
                          {r.status !== 'cancelled' && (
                            <div className="flex gap-3 mt-6 pt-4 border-t border-gold/10">
                              <button onClick={() => startEdit(r)} className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.15em] uppercase px-4 py-2 border border-gold/30 text-champagne hover:border-gold hover:text-gold transition-all">
                                <Edit3 className="w-3 h-3" /> Chỉnh sửa
                              </button>
                              <button onClick={() => cancelReservation(r.id)} className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.15em] uppercase px-4 py-2 border border-red-900/30 text-red-400/70 hover:border-red-600 hover:text-red-400 transition-all">
                                <X className="w-3 h-3" /> Huỷ đặt bàn
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
