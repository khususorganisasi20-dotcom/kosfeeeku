import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService, ASSETS } from '../../../lib/database';
import { isSupabaseConfigured, supabaseUrl, updateSupabaseCredentials, clearSupabaseCredentials } from '../../../lib/supabase';
import {
  Room,
  RoomBooking,
  RentInvoice,
  CafeOrder,
  CoworkingReservation,
  PaymentRecord,
  MaintenanceTicket,
  MenuItem,
  AuditLog,
  BusinessSettings
} from '../../../types';
import {
  LayoutDashboard,
  Home,
  CheckSquare,
  CreditCard,
  Utensils,
  Laptop,
  Wrench,
  BarChart3,
  Database,
  History,
  Settings,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface OwnerDashboardProps {
  navigate: (path: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'rooms' | 'bookings' | 'payments' | 'cafe_orders' | 'cafe_menu' | 'coworking' | 'maintenance' | 'reports' | 'supabase' | 'audit' | 'settings'
  >('overview');

  // Database state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [invoices, setInvoices] = useState<RentInvoice[]>([]);
  const [orders, setOrders] = useState<CafeOrder[]>([]);
  const [reservations, setReservations] = useState<CoworkingReservation[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(DatabaseService.getSettings());

  // Modal / Form states
  const [copiedSql, setCopiedSql] = useState(false);
  const [newRoomModal, setNewRoomModal] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState(1200000);
  const [newRoomArea, setNewRoomArea] = useState(10);
  const [newRoomBathroom, setNewRoomBathroom] = useState<'private' | 'shared'>('private');
  const [newRoomFloor, setNewRoomFloor] = useState(2);

  // Supabase credentials input form
  const [customSupabaseUrl, setCustomSupabaseUrl] = useState(localStorage.getItem('kosfeeku_supabase_url') || '');
  const [customSupabaseKey, setCustomSupabaseKey] = useState(localStorage.getItem('kosfeeku_supabase_anon_key') || '');
  const [schemaSqlText, setSchemaSqlText] = useState('');

  const loadData = () => {
    setRooms(DatabaseService.getRooms());
    setBookings(DatabaseService.getBookings());
    setInvoices(DatabaseService.getInvoices());
    setOrders(DatabaseService.getCafeOrders());
    setReservations(DatabaseService.getCoworkingReservations());
    setPayments(DatabaseService.getPayments());
    setTickets(DatabaseService.getMaintenanceTickets());
    setMenuItems(DatabaseService.getMenuItems());
    setAuditLogs(DatabaseService.getAuditLogs());
    setSettings(DatabaseService.getSettings());
  };

  useEffect(() => {
    loadData();
    // Load raw SQL schema for viewer
    fetch('/src/lib/supabase-schema.sql')
      .then(res => res.text())
      .then(text => setSchemaSqlText(text))
      .catch(() => setSchemaSqlText('-- Schema file available in repository.'));
  }, []);

  // Compute Verified Financial Metrics (Strictly excluding pending or failed payments)
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const verifiedPayments = payments.filter(p => p.status === 'verified');
  const verifiedRevenue = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const pendingPaymentsAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const openTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
  const outstandingInvoices = invoices.filter(i => i.status === 'unpaid');
  const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + i.amount, 0);

  // Handlers
  const handleReviewBooking = (bookingId: string, approved: boolean) => {
    const reviewerName = user?.fullName || 'Owner';
    DatabaseService.reviewBooking(bookingId, approved, user?.id || 'owner', reviewerName);
    loadData();
  };

  const handleVerifyPayment = (paymentId: string, verified: boolean) => {
    const reviewerName = user?.fullName || 'Owner';
    DatabaseService.verifyPayment(paymentId, verified, user?.id || 'owner', reviewerName);
    loadData();
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    const staffName = user?.fullName || 'Barista Staff';
    DatabaseService.updateOrderStatus(orderId, status, staffName);
    loadData();
  };

  const handleToggleMenuAvailability = (item: MenuItem) => {
    DatabaseService.saveMenuItem({ ...item, available: !item.available });
    loadData();
  };

  const handleResolveTicket = (ticketId: string) => {
    DatabaseService.updateTicketStatus(ticketId, 'resolved', 'Pekerjaan perbaikan telah selesai dikerjakan teknisi.', 50000);
    loadData();
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomPrice < 1000000) {
      alert('Harga sewa minimal kamar adalah Rp1.000.000/bulan sesuai ketentuan.');
      return;
    }
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      roomNumber: newRoomNumber,
      categoryId: newRoomBathroom === 'private' ? 'cat-superior' : 'cat-standard',
      categoryName: newRoomBathroom === 'private' ? 'Superior Room' : 'Standard Room',
      areaSqm: newRoomArea,
      monthlyPrice: newRoomPrice,
      facilities: ['Kasur Nyaman', 'Meja & Kursi Belajar', 'Lemari Pakaian', 'Wi-Fi 100 Mbps', 'Ventilasi Udara'],
      bathroomType: newRoomBathroom,
      maxOccupancy: 1,
      status: 'available',
      description: `Kamar baru di lantai ${newRoomFloor} dengan pencahayaan dan sirkulasi alami optimal.`,
      images: [ASSETS.roomDeluxe],
      floor: newRoomFloor,
    };
    DatabaseService.saveRoom(newRoom);
    DatabaseService.logAudit(user?.id || 'owner', user?.fullName || 'Owner', 'owner', 'ROOM_CREATED', newRoom.roomNumber, `Harga: Rp${newRoom.monthlyPrice}`);
    setNewRoomModal(false);
    setNewRoomNumber('');
    loadData();
  };

  const handleExportCsv = () => {
    const headers = ['ID Transaksi,Kategori,Deskripsi,Jumlah,Metode,Status,Nama Pembayar,Tanggal'];
    const rows = payments.map(p =>
      `"${p.transactionRef}","${p.category}","${p.description}","${p.amount}","${p.paymentMethod}","${p.status}","${p.payerName}","${p.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_KosfeeKu_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(schemaSqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFF0B8]/60 via-[#F8D7E8]/40 to-[#E6DDF7]/40 border border-[#FFF0B8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#393744]">{t.ownerDashboard}</span>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role: {user?.role.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Pengelola: <strong>{user?.fullName}</strong> ({user?.email}) · Terhubung ke PostgreSQL / Supabase
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none text-xs">
        {[
          { id: 'overview', label: 'Ringkasan & KPI', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
          { id: 'rooms', label: `Kamar (${rooms.length})`, icon: <Home className="w-3.5 h-3.5" /> },
          { id: 'bookings', label: `Persetujuan Sewa (${pendingBookings.length})`, icon: <CheckSquare className="w-3.5 h-3.5" /> },
          { id: 'payments', label: `Verifikasi Bayar (${pendingPayments.length})`, icon: <CreditCard className="w-3.5 h-3.5" /> },
          { id: 'cafe_orders', label: `Kitchen Café (${orders.length})`, icon: <Utensils className="w-3.5 h-3.5" /> },
          { id: 'cafe_menu', label: `Menu & Stok (${menuItems.length})`, icon: <Utensils className="w-3.5 h-3.5" /> },
          { id: 'coworking', label: `Co-working (${reservations.length})`, icon: <Laptop className="w-3.5 h-3.5" /> },
          { id: 'maintenance', label: `Laporan Kerusakan (${openTickets.length})`, icon: <Wrench className="w-3.5 h-3.5" /> },
          { id: 'reports', label: 'Laporan & Keuangan', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'supabase', label: 'Supabase & SQL', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'audit', label: 'Audit Log', icon: <History className="w-3.5 h-3.5" /> },
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

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Real Database KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-[#F8D7E8] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.kpiOccupancy}</span>
              <div className="text-xl font-extrabold text-[#393744] mt-1 tabular-nums">{occupancyRate}%</div>
              <span className="text-[11px] text-slate-500">{occupiedRooms}/{totalRooms} Kamar Terisi</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.kpiVerifiedRevenue}</span>
              <div className="text-xl font-extrabold text-emerald-700 mt-1 tabular-nums">{formatCurrency(verifiedRevenue)}</div>
              <span className="text-[11px] text-slate-500">Lunas terverifikasi</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.kpiPendingPayments}</span>
              <div className="text-xl font-extrabold text-amber-700 mt-1 tabular-nums">{formatCurrency(pendingPaymentsAmount)}</div>
              <span className="text-[11px] text-slate-500">{pendingPayments.length} transaksi pending</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-rose-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Piutang Sewa</span>
              <div className="text-xl font-extrabold text-rose-700 mt-1 tabular-nums">{formatCurrency(outstandingAmount)}</div>
              <span className="text-[11px] text-slate-500">{outstandingInvoices.length} invoice belum bayar</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Permintaan Sewa</span>
              <div className="text-xl font-extrabold text-purple-700 mt-1 tabular-nums">{pendingBookings.length}</div>
              <span className="text-[11px] text-slate-500">Perlu persetujuan</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tiket Kerusakan</span>
              <div className="text-xl font-extrabold text-blue-700 mt-1 tabular-nums">{openTickets.length}</div>
              <span className="text-[11px] text-slate-500">Menunggu tindak lanjut</span>
            </div>
          </div>

          {/* Quick Approval Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pending Bookings Review */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#393744]">Pengajuan Sewa Kamar Baru ({pendingBookings.length})</h3>
                <button onClick={() => setActiveTab('bookings')} className="text-xs text-purple-700 hover:underline">
                  Lihat Semua
                </button>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  Tidak ada pengajuan sewa yang menunggu persetujuan saat ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.map(b => (
                    <div key={b.id} className="p-4 bg-[#FFFCF8] rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{b.tenantName}</div>
                          <p className="text-slate-500 text-[11px]">{b.tenantPhone} · {b.tenantEmail}</p>
                        </div>
                        <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">{b.bookingCode}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                        <div>Kamar: <strong>{b.roomNumber}</strong> ({b.roomCategory})</div>
                        <div>Mulai: <strong>{b.startDate}</strong> ({b.durationMonths} bln)</div>
                        <div>Sewa: <strong>{formatCurrency(b.monthlyPrice)}</strong>/bln</div>
                        <div>Deposit: <strong>{formatCurrency(b.depositAmount)}</strong></div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleReviewBooking(b.id, true)}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                        >
                          Setujui & Terbitkan Kontrak
                        </button>
                        <button
                          onClick={() => handleReviewBooking(b.id, false)}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-[11px]"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Payment Verifications */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#393744]">Verifikasi Pembayaran Masuk ({pendingPayments.length})</h3>
                <button onClick={() => setActiveTab('payments')} className="text-xs text-purple-700 hover:underline">
                  Lihat Semua
                </button>
              </div>

              {pendingPayments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  Semua transaksi telah diverifikasi lunas.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map(p => (
                    <div key={p.id} className="p-4 bg-[#FFFCF8] rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-900">{p.description}</div>
                          <p className="text-slate-500 text-[11px]">Pembayar: {p.payerName} · Metode: {p.paymentMethod.toUpperCase()}</p>
                        </div>
                        <span className="font-bold text-sm text-[#393744] tabular-nums">{formatCurrency(p.amount)}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono">Ref: {p.transactionRef}</span>
                        <span>{p.createdAt.split('T')[0]}</span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyPayment(p.id, true)}
                          className="flex-1 py-1.5 bg-[#393744] hover:bg-[#524B66] text-white rounded-lg font-bold text-[11px]"
                        >
                          Verifikasi Lunas (Diterima)
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(p.id, false)}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-[11px]"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB: ROOMS MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#393744]">Manajemen Unit Kamar Kost</h2>
              <p className="text-xs text-slate-500">Ketentuan sewa minimal Rp1.000.000/bulan.</p>
            </div>
            <button
              onClick={() => setNewRoomModal(true)}
              className="px-3.5 py-2 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kamar Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="py-2.5 px-3">No. Kamar</th>
                  <th className="py-2.5 px-3">Tipe</th>
                  <th className="py-2.5 px-3">Luas</th>
                  <th className="py-2.5 px-3">KM</th>
                  <th className="py-2.5 px-3">Tarif Sewa</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Penghuni Aktif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">{r.roomNumber}</td>
                    <td className="py-3 px-3 text-slate-700">{r.categoryName}</td>
                    <td className="py-3 px-3 text-slate-600">{r.areaSqm} m²</td>
                    <td className="py-3 px-3 text-slate-600">{r.bathroomType === 'private' ? 'Dalam' : 'Luar'}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">{formatCurrency(r.monthlyPrice)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {r.status === 'available' ? 'Tersedia' : 'Terisi'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {r.currentTenantName || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CAFE KITCHEN DISPLAY ORDERS */}
      {activeTab === 'cafe_orders' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#393744]">Kitchen Display System (KDS Café)</h2>
              <p className="text-xs text-slate-500">Perbarui status pesanan dari Dapur hingga Selesai.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#FFF0B8] text-amber-900 rounded-lg">
              {orders.length} Pesanan Masuk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 rounded-xl border border-slate-200 bg-[#FFFCF8] text-xs space-y-3">
                <div className="flex justify-between items-start border-b pb-2">
                  <div>
                    <span className="font-bold text-sm text-[#393744]">#{ord.orderCode}</span>
                    <p className="text-slate-500 text-[11px]">{ord.customerName} ({ord.deliveryType.replace('_', ' ')})</p>
                    {ord.roomNumber && <p className="text-purple-700 font-bold text-[11px]">Kamar: {ord.roomNumber}</p>}
                    {ord.tableNumber && <p className="text-amber-800 font-bold text-[11px]">Meja: {ord.tableNumber}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ord.orderStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    ord.orderStatus === 'ready' ? 'bg-blue-100 text-blue-800' :
                    ord.orderStatus === 'preparing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ord.orderStatus.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  {ord.items.map(it => (
                    <div key={it.id} className="flex justify-between text-slate-700">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="tabular-nums text-purple-900">{formatCurrency(ord.totalAmount)}</span>
                </div>

                {/* Workflow Transitions */}
                <div className="flex gap-1.5 pt-1">
                  {ord.orderStatus === 'pending' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px]"
                    >
                      Mulai Masak
                    </button>
                  )}
                  {ord.orderStatus === 'preparing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                      className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px]"
                    >
                      Siap Antar / Saji
                    </button>
                  )}
                  {ord.orderStatus === 'ready' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                    >
                      Selesai Disajikan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CAFE MENU & INVENTORY */}
      {activeTab === 'cafe_menu' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#393744]">Katalog Menu & Stok Café</h2>
              <p className="text-xs text-slate-500">Kelola ketersediaan menu dan tingkat stok harian.</p>
            </div>
            <span className="text-xs text-slate-500">{menuItems.length} Total Menu</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="py-2 px-3">Nama Menu</th>
                  <th className="py-2 px-3">Kategori</th>
                  <th className="py-2 px-3">Harga</th>
                  <th className="py-2 px-3">Stok</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menuItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-600 uppercase text-[10px]">{item.category.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 font-semibold tabular-nums">{formatCurrency(item.price)}</td>
                    <td className="py-2.5 px-3 tabular-nums">{item.stock} porsi</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.available ? 'Aktif' : 'Habis / Nonaktif'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleToggleMenuAvailability(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold border rounded-lg hover:bg-slate-100"
                      >
                        {item.available ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: REPORTS & FINANCIAL RECORDS */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#393744]">Laporan Keuangan & Audit Riwayat</h2>
              <p className="text-xs text-slate-500">Data bersumber murni dari riwayat pembayaran terverifikasi.</p>
            </div>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportReport}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-semibold block">Total Pendapatan Terverifikasi:</span>
              <span className="text-2xl font-black text-emerald-900 tabular-nums">{formatCurrency(verifiedRevenue)}</span>
              <p className="text-[11px] text-emerald-700 mt-1">Uang sah diterima via Kasir / QRIS</p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-semibold block">Transaksi Pending / Verifikasi:</span>
              <span className="text-2xl font-black text-amber-900 tabular-nums">{formatCurrency(pendingPaymentsAmount)}</span>
              <p className="text-[11px] text-amber-700 mt-1">Belum dihitung sebagai pendapatan</p>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
              <span className="text-xs text-rose-800 font-semibold block">Tagihan Sewa Belum Terbayar:</span>
              <span className="text-2xl font-black text-rose-900 tabular-nums">{formatCurrency(outstandingAmount)}</span>
              <p className="text-[11px] text-rose-700 mt-1">Piutang berjalan bulan ini</p>
            </div>
          </div>

          {/* Payment ledger */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Buku Kas Transaksi Pembayaran</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="py-2 px-3">Kode Ref</th>
                    <th className="py-2 px-3">Kategori</th>
                    <th className="py-2 px-3">Keterangan</th>
                    <th className="py-2 px-3">Pembayar</th>
                    <th className="py-2 px-3">Metode</th>
                    <th className="py-2 px-3">Jumlah</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{p.transactionRef}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-semibold">{p.category}</td>
                      <td className="py-2.5 px-3 text-slate-900">{p.description}</td>
                      <td className="py-2.5 px-3 text-slate-700">{p.payerName}</td>
                      <td className="py-2.5 px-3 uppercase font-medium">{p.paymentMethod}</td>
                      <td className="py-2.5 px-3 font-bold tabular-nums">{formatCurrency(p.amount)}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SUPABASE & SQL SCHEMA */}
      {activeTab === 'supabase' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-[#393744]">{t.supabaseConfigTitle}</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Skema SQL lengkap, fungsi otentikasi Supabase, dan kebijakan Row Level Security (RLS).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 bg-[#F8D7E8] hover:bg-[#E6DDF7] text-[#393744] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Tersalin!' : 'Salin SQL Migration'}</span>
              </button>
            </div>
          </div>

          {/* Connection Status Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Status Koneksi Supabase:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isSupabaseConfigured ? 'Terkoneksi' : 'Kredensial Siap / Default Fallback'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">VITE_SUPABASE_URL</label>
                <input
                  type="text"
                  value={customSupabaseUrl}
                  onChange={(e) => setCustomSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">VITE_SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  value={customSupabaseKey}
                  onChange={(e) => setCustomSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => updateSupabaseCredentials(customSupabaseUrl, customSupabaseKey)}
                className="px-3.5 py-1.5 bg-[#393744] text-white rounded-lg text-xs font-semibold"
              >
                Simpan & Muat Ulang Koneksi
              </button>
              <button
                onClick={clearSupabaseCredentials}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs"
              >
                Reset Default
              </button>
            </div>
          </div>

          {/* SQL Preview Box */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pratinjau Skrip Migrasi SQL (Supabase SQL Editor Ready)
            </span>
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed">
              {schemaSqlText}
            </pre>
          </div>
        </div>
      )}

      {/* TAB: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#393744]">Audit Trail & Log Aktivitas</h2>
            <span className="text-xs text-slate-400">{auditLogs.length} Catatan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="py-2 px-3">Waktu</th>
                  <th className="py-2 px-3">Aktor</th>
                  <th className="py-2 px-3">Peran</th>
                  <th className="py-2 px-3">Tindakan</th>
                  <th className="py-2 px-3">Target</th>
                  <th className="py-2 px-3">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{log.actorName}</td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-semibold text-purple-700">{log.actorRole}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-700">{log.target}</td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Room Modal */}
      {newRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DDF7] space-y-4">
            <h3 className="text-base font-bold text-[#393744]">Tambah Kamar Kost Baru</h3>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nomor Kamar</label>
                <input
                  type="text"
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value.toUpperCase())}
                  placeholder="Contoh: D-401"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tarif Bulanan (Min. 1 Juta)</label>
                  <input
                    type="number"
                    min="1000000"
                    step="50000"
                    required
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Luas (m²)</label>
                  <input
                    type="number"
                    min="8"
                    max="40"
                    required
                    value={newRoomArea}
                    onChange={(e) => setNewRoomArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kamar Mandi</label>
                  <select
                    value={newRoomBathroom}
                    onChange={(e) => setNewRoomBathroom(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="private">Kamar Mandi Dalam</option>
                    <option value="shared">Kamar Mandi Luar</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Lantai</label>
                  <select
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={1}>Lantai 1</option>
                    <option value={2}>Lantai 2</option>
                    <option value={3}>Lantai 3</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewRoomModal(false)}
                  className="flex-1 py-2 text-slate-600 border rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#393744] hover:bg-[#524B66] text-white rounded-xl font-bold"
                >
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
