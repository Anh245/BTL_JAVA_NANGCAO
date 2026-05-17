import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi, guestApi, tableApi } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, RefreshCw, Users, Calendar, BarChart2, List } from 'lucide-react';
import { format } from 'date-fns';
import AnalyticsDashboard from '../admin/AnalyticsDashboard';
import WaitlistPanel from '../admin/WaitlistPanel';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    className: 'border border-gold/50 text-gold pulse-gold',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    className: 'border border-bone/40 text-bone',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'border border-red-800/50 text-red-400',
    icon: XCircle,
  },
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('analytics');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading: loadingRes } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationApi.list(),
  });

  const { data: guests = [], isLoading: loadingGuests } = useQuery({
    queryKey: ['guests'],
    queryFn: () => guestApi.list(),
  });

  const { data: tables = [], isLoading: loadingTables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApi.list(),
  });

  const isLoading = loadingRes || loadingGuests || loadingTables;

  // Join reservations with guest and table data
  const enrichedReservations = reservations.map(r => {
    const guest = guests.find(g => g.id === r.guestId) || {};
    const table = tables.find(t => t.id === r.tableId) || {};
    return { ...r, guest, table };
  });

  // For analytics, pass enriched data with flat fields similar to old schema
  const analyticsData = enrichedReservations.map(r => ({
    ...r,
    name: r.guest?.name,
    email: r.guest?.email,
    table_zone: r.table?.zone || '',
    party_size: r.partySize,
    special_requests: r.specialRequests,
    created_date: r.createdDate,
    notes: r.guest?.notes,
  }));

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => reservationApi.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
  });

  const filtered = enrichedReservations.filter(r => {
    const matchSearch = !search ||
      r.guest?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.guest?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-obsidian px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-10">
          <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-3">Control Room</p>
          <div className="hairline-gold w-16 mb-6" />
          <h1 className="font-playfair text-4xl text-bone">Admin Dashboard</h1>
          <p className="font-playfair italic text-champagne mt-2">
            Quản lý và phân tích toàn bộ hoạt động đặt bàn.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-0 border-b border-gold/15 mb-10">
          {[
            { key: 'analytics', label: 'Thống Kê', icon: BarChart2 },
            { key: 'ledger', label: 'Danh Sách', icon: List },
            { key: 'waitlist', label: 'Waitlist', icon: Users },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-8 py-4 font-inter text-xs tracking-[0.25em] uppercase transition-all duration-300 border-b-2 -mb-px ${
                  tab === t.key
                    ? 'border-gold text-gold'
                    : 'border-transparent text-champagne/50 hover:text-champagne'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <RefreshCw className="w-6 h-6 text-gold animate-spin" />
              </div>
            ) : (
              <AnalyticsDashboard reservations={analyticsData} />
            )}
          </motion.div>
        )}

        {/* Waitlist Tab */}
        {tab === 'waitlist' && (
          <motion.div
            key="waitlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <WaitlistPanel />
          </motion.div>
        )}

        {/* Ledger Tab */}
        {tab === 'ledger' && (
          <motion.div
            key="ledger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne/50" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-gold/20 text-bone font-inter text-sm pl-10 pr-4 py-3 outline-none focus:border-gold/60 transition-colors duration-300 placeholder-champagne/30"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`font-inter text-xs tracking-[0.15em] uppercase px-4 py-3 border transition-all duration-200 ${
                      filterStatus === s
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gold/20 text-champagne hover:border-gold/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="border border-gold/15 overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_1fr_120px_80px_90px_150px] gap-4 px-6 py-4 bg-[#0d0d0d] border-b border-gold/15">
                {['Khách', 'Liên Hệ', 'Ngày & Giờ', 'Nhóm', 'Khu Vực', 'Trạng Thái'].map(h => (
                  <span key={h} className="font-inter text-[10px] tracking-[0.3em] uppercase text-champagne/60">{h}</span>
                ))}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="w-6 h-6 text-gold animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-playfair italic text-champagne">Không tìm thấy đặt bàn nào.</p>
                </div>
              ) : (
                filtered.map((r, i) => {
                  const statusCfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusCfg.icon;
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_80px_90px_150px] gap-4 px-6 py-5 border-b border-gold/8 hover:bg-gold/3 transition-colors duration-200 group"
                    >
                      <div>
                        <div className="font-playfair text-bone text-base">{r.guest?.name || '—'}</div>
                        {r.occasion && r.occasion !== 'none' && (
                          <div className="font-inter text-[10px] text-gold tracking-wider mt-0.5">
                            {r.occasion.replace('_', ' ')}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-inter text-sm text-champagne truncate">{r.guest?.email || '—'}</div>
                        <div className="font-inter text-xs text-champagne/50 mt-0.5">{r.guest?.phone}</div>
                      </div>

                      <div>
                        <div className="font-inter text-sm text-bone flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-gold" />
                          {r.date ? format(new Date(r.date), 'MMM d') : '—'}
                        </div>
                        <div className="font-inter text-xs text-champagne/60 mt-0.5">{r.time}</div>
                      </div>

                      <div className="flex items-center gap-1.5 text-champagne">
                        <Users className="w-3 h-3 text-gold" />
                        <span className="font-inter text-sm">{r.partySize}</span>
                      </div>

                      <div className="font-inter text-xs text-champagne/60">
                        {r.table?.label || (r.table?.zone ? r.table.zone.replace('_', ' ') : '—')}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-inter text-[10px] tracking-[0.15em] uppercase px-2 py-1 flex items-center gap-1 ${statusCfg.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.label}
                        </span>
                        {r.status === 'pending' && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => updateMutation.mutate({ id: r.id, status: 'confirmed' })}
                              className="p-1 hover:text-gold text-champagne/40 transition-colors"
                              title="Xác nhận"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: r.id, status: 'cancelled' })}
                              className="p-1 hover:text-red-400 text-champagne/40 transition-colors"
                              title="Huỷ"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {filtered.length > 0 && (
              <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/30 text-right mt-4">
                {filtered.length} lượt đặt bàn
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}