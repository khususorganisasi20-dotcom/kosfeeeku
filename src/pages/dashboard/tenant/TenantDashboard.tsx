import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService } from '../../../lib/database';
import { RentInvoice, RoomBooking, CafeOrder, CoworkingReservation, MaintenanceTicket, ComplaintCategory } from '../../../types';
import { PaymentModal } from '../../../components/common/PaymentModal';
import {
  Home,
  FileText,
  CreditCard,
  ShoppingBag,
  Laptop,
  Award,
  Wrench,
  Bell,
  User,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TenantDashboardProps {
  navigate: (path: string) => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({ navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'room' | 'invoices' | 'orders' | 'coworking' | 'loyalty' | 'maintenance' | 'notifications'>('overview');

  // Database records
  const [invoices, setInvoices] = useState<RentInvoice[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [orders, setOrders] = useState<CafeOrder[]>([]);
  const [reservations, setReservations] = useState<CoworkingReservation[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loyalty, setLoyalty] = useState(DatabaseService.getLoyalty(user?.id || 'tenant-demo'));

  // Payment modal state
  const [activePayment, setActivePayment] = useState<{
    title: string;
    category: 'rent' | 'cafe' | 'coworking';
    referenceId: string;
    amount: number;
  } | null>(null);

  // New ticket form modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<ComplaintCategory>('ac_electrical');
  const [ticketRoomNumber, setTicketRoomNumber] = useState('A-102');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const loadData = () => {
    const tenantId = user?.id || 'tenant-demo';
    setInvoices(DatabaseService.getInvoices(tenantId));
    setBookings(DatabaseService.getBookings().filter(b => b.tenantId === tenantId || b.tenantEmail === user?.email));
    setOrders(DatabaseService.getCafeOrders(tenantId));
    setReservations(DatabaseService.getCoworkingReservations(tenantId));
    setTickets(DatabaseService.getMaintenanceTickets(tenantId));
    setLoyalty(DatabaseService.getLoyalty(tenantId));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const activeRoom = DatabaseService.getRooms().find(r => r.currentTenantId === user?.id) || DatabaseService.getRooms()[1];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseService.createMaintenanceTicket({
      tenantId: user?.id || 'tenant-demo',
      tenantName: user?.fullName || 'Budi Santoso',
      roomNumber: ticketRoomNumber,
      category: ticketCategory,
      description: ticketDesc,
      priority: 'medium',
    });
    setTicketSuccess(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => {
      setTicketSuccess(false);
      setShowTicketModal(false);
      setTicketDesc('');
      loadData();
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Welcome Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F8D7E8]/50 via-[#E6DDF7]/40 to-[#FFF0B8]/40 border border-[#E6DDF7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#393744] font-bold text-lg">
            {user?.fullName?.charAt(0) || 'B'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#393744]">{user?.fullName || 'Penghuni KosfeeKu'}</h1>
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                {loyalty.tier} Member
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kamar Aktif: <strong>{activeRoom.roomNumber}</strong> ({activeRoom.categoryName}) · {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="px-3.5 py-1.5 bg-white/90 rounded-xl border border-[#E6DDF7] text-xs font-semibold text-[#393744] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{loyalty.points} Poin Reward</span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white/80 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none text-xs">
        {[
          { id: 'overview', label: 'Ringkasan', icon: <Home className="w-3.5 h-3.5" /> },
          { id: 'room', label: 'Kamar & Kontrak', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'invoices', label: `Tagihan Sewa (${invoices.filter(i => i.status === 'unpaid').length})`, icon: <CreditCard className="w-3.5 h-3.5" /> },
          { id: 'orders', label: `Pesanan Café (${orders.length})`, icon: <ShoppingBag className="w-3.5 h-3.5" /> },
          { id: 'coworking', label: `Co-working (${reservations.length})`, icon: <Laptop className="w-3.5 h-3.5" /> },
          { id: 'maintenance', label: `Keluhan & Tiket (${tickets.length})`, icon: <Wrench className="w-3.5 h-3.5" /> },
          { id: 'loyalty', label: 'Poin & Reward', icon: <Award className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#393744] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#E6DDF7]/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#F8D7E8] shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Kamar Anda</span>
              <div className="text-xl font-bold text-[#393744]">{activeRoom.roomNumber}</div>
              <p className="text-xs text-slate-500">{activeRoom.categoryName} · Lt. {activeRoom.floor}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Status Tagihan Sewa</span>
              <div className="text-xl font-bold text-[#393744] tabular-nums">
                {invoices.filter(i => i.status === 'unpaid').length > 0 ? (
                  <span className="text-amber-600">Ada Tagihan</span>
                ) : (
                  <span className="text-emerald-600">Lunas</span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {invoices.filter(i => i.status === 'unpaid').length} tagihan belum dibayar
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#FFF0B8] shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Pesanan Café Aktif</span>
              <div className="text-xl font-bold text-[#393744] tabular-nums">
                {orders.filter(o => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled').length}
              </div>
              <p className="text-xs text-slate-500">Bisa diantar langsung ke kamar Anda</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#D9ECFA] shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Loyalty Points</span>
              <div className="text-xl font-bold text-[#393744] tabular-nums">{loyalty.points} pts</div>
              <p className="text-xs text-slate-500">Tukar dengan Kopi / Diskon Sewa</p>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Active Invoices Alert */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#393744]">Tagihan Sewa Perlu Pembayaran</h3>
                  <button onClick={() => setActiveTab('invoices')} className="text-xs text-purple-700 font-semibold hover:underline">
                    Lihat Semua
                  </button>
                </div>

                {invoices.filter(i => i.status === 'unpaid' || i.status === 'pending_verification').length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                    Semua tagihan sewa Anda sudah lunas. Terima kasih atas ketepatan waktunya!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices.filter(i => i.status === 'unpaid' || i.status === 'pending_verification').map(inv => (
                      <div key={inv.id} className="p-4 bg-[#FFFCF8] rounded-xl border border-[#E6DDF7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#393744]">{inv.periodMonth}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              inv.status === 'unpaid' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {inv.status === 'unpaid' ? 'Belum Dibayar' : 'Menunggu Verifikasi Staff'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Jatuh tempo: {inv.dueDate} · Kamar {inv.roomNumber}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-base font-extrabold text-[#393744] tabular-nums">
                            {formatCurrency(inv.amount)}
                          </span>
                          {inv.status === 'unpaid' && (
                            <button
                              onClick={() => setActivePayment({
                                title: `Sewa Kamar ${inv.roomNumber} - ${inv.periodMonth}`,
                                category: 'rent',
                                referenceId: inv.id,
                                amount: inv.amount,
                              })}
                              className="px-3.5 py-1.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Bayar QRIS / Kasir
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders Tracker */}
              <div className="p-5 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#393744]">Pesanan Café Terbaru</h3>
                  <button onClick={() => navigate('/cafe')} className="text-xs text-amber-800 font-semibold hover:underline">
                    Pesan Menu Baru +
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    Belum ada riwayat pesanan café. Cobain Nasi Ayam Geprek atau Es Kopi Susu!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 3).map(ord => (
                      <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">#{ord.orderCode}</span>
                            <span className="text-slate-400 font-normal">({ord.deliveryType === 'room_delivery' ? `Antar ke ${ord.roomNumber}` : ord.deliveryType})</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            {ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-[#393744] block tabular-nums">{formatCurrency(ord.totalAmount)}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded inline-block mt-0.5 ${
                            ord.orderStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            ord.orderStatus === 'preparing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ord.orderStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Ticket / Complaint card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#393744]">Perbaikan & Layanan Kamar</h3>
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="px-2.5 py-1 bg-[#F8D7E8] text-[#393744] text-[11px] font-bold rounded-lg hover:bg-[#E6DDF7]"
                  >
                    + Buat Laporan
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Ada lampu putus, AC kurang dingin, atau kendala Wi-Fi? Buat tiket laporan untuk segera ditindaklanjuti tim teknisi kami.
                </p>

                <div className="space-y-2 pt-2">
                  {tickets.slice(0, 2).map(tkt => (
                    <div key={tkt.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>{tkt.ticketNumber} · {tkt.category.replace('_', ' ')}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          tkt.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tkt.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{tkt.description}</p>
                      {tkt.assignedStaff && (
                        <p className="text-[10px] text-purple-700">Ditangani: {tkt.assignedStaff}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: ROOM & CONTRACT */}
      {activeTab === 'room' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#393744]">Detail Kamar & Kontrak Sewa</h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              Kontrak Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-[#FFFCF8] rounded-xl border border-[#E6DDF7] space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">Informasi Unit Kamar</h3>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nomor Kamar:</span>
                <span className="font-semibold text-slate-800">{activeRoom.roomNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kategori:</span>
                <span className="font-semibold text-slate-800">{activeRoom.categoryName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Luas:</span>
                <span className="font-semibold text-slate-800">{activeRoom.areaSqm} m²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kamar Mandi:</span>
                <span className="font-semibold text-slate-800">{activeRoom.bathroomType === 'private' ? 'Kamar Mandi Dalam' : 'Kamar Mandi Luar'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Tarif Bulanan:</span>
                <span className="font-bold text-[#393744] tabular-nums">{formatCurrency(activeRoom.monthlyPrice)} / bulan</span>
              </div>
            </div>

            <div className="p-4 bg-[#FFFCF8] rounded-xl border border-[#E6DDF7] space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">Fasilitas Kamar Anda</h3>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {activeRoom.facilities.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#393744]">Daftar Tagihan Sewa (Invoices)</h2>
            <span className="text-xs text-slate-500">Mendukung QRIS Nasional & Tunai Kasir</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Periode Sewa</th>
                  <th className="py-2.5 px-3">Kamar</th>
                  <th className="py-2.5 px-3">Jatuh Tempo</th>
                  <th className="py-2.5 px-3">Jumlah</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{inv.periodMonth}</td>
                    <td className="py-3 px-3 text-slate-600">{inv.roomNumber}</td>
                    <td className="py-3 px-3 text-slate-600">{inv.dueDate}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">{formatCurrency(inv.amount)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'pending_verification' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.status === 'paid' ? 'Lunas' : inv.status === 'pending_verification' ? 'Menunggu Verifikasi' : 'Belum Bayar'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {inv.status === 'unpaid' ? (
                        <button
                          onClick={() => setActivePayment({
                            title: `Tagihan Sewa ${inv.roomNumber} (${inv.periodMonth})`,
                            category: 'rent',
                            referenceId: inv.id,
                            amount: inv.amount,
                          })}
                          className="px-3 py-1 bg-[#393744] hover:bg-[#524B66] text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Bayar Sekarang
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Tercatat</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#393744]">Riwayat Pesanan Café</h2>
            <button onClick={() => navigate('/cafe')} className="px-3 py-1.5 bg-[#FFF0B8] text-[#393744] text-xs font-bold rounded-lg">
              + Pesan Menu Lagi
            </button>
          </div>

          <div className="space-y-3">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-2">
                  <div>
                    <span className="font-bold text-sm text-[#393744]">#{ord.orderCode}</span>
                    <span className="text-slate-400 ml-2">({ord.createdAt.split('T')[0]})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Tipe: <strong>{ord.deliveryType.replace('_', ' ')}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      ord.orderStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      ord.orderStatus === 'preparing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {ord.orderStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {ord.items.map(it => (
                    <div key={it.id} className="py-1 flex justify-between">
                      <span className="text-slate-700">{it.name} × {it.quantity}</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t flex justify-between font-bold text-sm text-[#393744]">
                  <span>Total Pembayaran:</span>
                  <span className="tabular-nums">{formatCurrency(ord.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: COWROKING */}
      {activeTab === 'coworking' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#393744]">Reservasi Co-working Anda</h2>
            <button onClick={() => navigate('/coworking')} className="px-3 py-1.5 bg-[#D9ECFA] text-blue-900 text-xs font-bold rounded-lg">
              + Pesan Ruang Kerja
            </button>
          </div>

          {reservations.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Belum ada reservasi co-working aktif.</p>
          ) : (
            <div className="space-y-3">
              {reservations.map(res => (
                <div key={res.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#393744]">{res.resourceName}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                        {res.reservationCode}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Tanggal: {res.date} · Mulai: {res.startTime} ({res.durationHours} Jam)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#393744] text-sm block tabular-nums">{formatCurrency(res.totalPrice)}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#393744]">Keluhan & Laporan Perbaikan</h2>
            <button
              onClick={() => setShowTicketModal(true)}
              className="px-3.5 py-1.5 bg-[#F8D7E8] text-[#393744] text-xs font-bold rounded-lg hover:bg-[#E6DDF7]"
            >
              + Ajukan Keluhan Baru
            </button>
          </div>

          <div className="space-y-3">
            {tickets.map(tkt => (
              <div key={tkt.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#393744]">{tkt.ticketNumber}</span>
                    <span className="text-slate-400">· Kamar {tkt.roomNumber}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    tkt.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tkt.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-700">{tkt.description}</p>
                {tkt.resolutionNotes && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded">
                    <strong>Catatan Penyelesaian:</strong> {tkt.resolutionNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LOYALTY */}
      {activeTab === 'loyalty' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#393744]">Poin & Program Loyalitas</h2>
              <p className="text-xs text-slate-500">Kumpulkan poin setiap bayar sewa tepat waktu atau jajan di café KosfeeKu.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Saldo Poin:</span>
              <div className="text-2xl font-black text-amber-600 tabular-nums">{loyalty.points} Pts</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#FFF0B8]/40 border border-[#FFF0B8] rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-[#393744]">Gratis Es Kopi Susu Aren</h4>
              <p className="text-slate-600">Nikmati 1 gelas signature coffee KosfeeKu dingin segar.</p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-amber-900">40 Poin</span>
                <button
                  disabled={loyalty.points < 40}
                  onClick={() => alert('Voucher telah ditukarkan dan siap diambil di meja kasir!')}
                  className="px-2.5 py-1 bg-[#393744] text-white text-[11px] font-semibold rounded disabled:opacity-40"
                >
                  Tukar Voucher
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#D9ECFA]/40 border border-[#D9ECFA] rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-[#393744]">Gratis 2 Jam Co-working</h4>
              <p className="text-slate-600">Akses Hot Desk atau Quiet Study Pod gratis selama 2 jam.</p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-blue-900">60 Poin</span>
                <button
                  disabled={loyalty.points < 60}
                  onClick={() => alert('Voucher 2 Jam Coworking berhasil diklaim!')}
                  className="px-2.5 py-1 bg-[#393744] text-white text-[11px] font-semibold rounded disabled:opacity-40"
                >
                  Tukar Voucher
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#F8D7E8]/40 border border-[#F8D7E8] rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-[#393744]">Potongan Sewa Rp50.000</h4>
              <p className="text-slate-600">Diskon langsung pada tagihan sewa kamar bulan berikutnya.</p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-purple-900">120 Poin</span>
                <button
                  disabled={loyalty.points < 120}
                  onClick={() => alert('Diskon sewa Rp50.000 akan otomatis dipotongkan pada invoice depan!')}
                  className="px-2.5 py-1 bg-[#393744] text-white text-[11px] font-semibold rounded disabled:opacity-40"
                >
                  Tukar Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Complaint Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DDF7] space-y-4">
            <h3 className="text-base font-bold text-[#393744]">{t.submitComplaint}</h3>

            {ticketSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Laporan Berhasil Diajukan</p>
                <p>Staff teknisi kami akan segera memeriksa kamar Anda.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nomor Kamar</label>
                  <input
                    type="text"
                    required
                    value={ticketRoomNumber}
                    onChange={(e) => setTicketRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Kategori Kendala</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="ac_electrical">AC / Kelistrikan / Lampu</option>
                    <option value="plumbing_water">Pipa Air / Kamar Mandi / Kran</option>
                    <option value="internet">Wi-Fi / Jaringan Internet</option>
                    <option value="furniture">Perabot (Kasur, Lemari, Meja)</option>
                    <option value="cleanliness">Kebersihan Area</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Deskripsi Kendala</label>
                  <textarea
                    rows={3}
                    required
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Jelaskan detail kerusakan atau kendala yang dialami..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-600 border rounded-xl hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#393744] hover:bg-[#524B66] rounded-xl"
                  >
                    Kirim Laporan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Unified Payment Modal */}
      {activePayment && (
        <PaymentModal
          isOpen={!!activePayment}
          onClose={() => setActivePayment(null)}
          title={activePayment.title}
          category={activePayment.category}
          referenceId={activePayment.referenceId}
          amount={activePayment.amount}
          payerName={user?.fullName || 'Budi Santoso'}
          onSuccess={() => {
            setActivePayment(null);
            loadData();
          }}
        />
      )}

    </div>
  );
};
