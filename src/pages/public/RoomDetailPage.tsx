import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService, ASSETS } from '../../lib/database';
import { ArrowLeft, CheckCircle2, Shield, Calendar, AlertCircle, Sparkles, User, Info, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoomDetailPageProps {
  roomId: string;
  navigate: (path: string) => void;
}

export const RoomDetailPage: React.FC<RoomDetailPageProps> = ({ roomId, navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const { user } = useAuth();
  const room = DatabaseService.getRoomById(roomId) || DatabaseService.getRooms()[0];

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [tenantName, setTenantName] = useState(user?.fullName || 'Budi Santoso');
  const [tenantEmail, setTenantEmail] = useState(user?.email || 'budi@student.ac.id');
  const [tenantPhone, setTenantPhone] = useState(user?.phone || '0812-9988-7766');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingStatusMsg, setBookingStatusMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const depositAmount = room.monthlyPrice; // 1 month deposit
  const totalFirstPayment = room.monthlyPrice + depositAmount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingStatusMsg(null);

    const res = DatabaseService.createBookingRequest({
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomCategory: room.categoryName,
      tenantId: user?.id || 'guest-user',
      tenantName,
      tenantEmail,
      tenantPhone,
      startDate,
      durationMonths,
      monthlyPrice: room.monthlyPrice,
      depositAmount,
      totalFirstPayment,
      notes: bookingNotes,
    });

    setIsSubmitting(false);

    if (res.success) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setBookingStatusMsg({
        success: true,
        text: `Pengajuan sewa kamar ${room.roomNumber} berhasil dikirim! Kode: ${res.booking?.bookingCode}. Pemilik kost akan meninjau permintaan ini.`,
      });
    } else {
      setBookingStatusMsg({
        success: false,
        text: res.message || 'Gagal mengajukan sewa.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/rooms')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Kamar</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visuals & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm border border-[#E6DDF7] bg-slate-100">
            <img
              src={room.images[0] || ASSETS.roomDeluxe}
              alt={`Kamar ${room.roomNumber}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-lg text-xs font-bold text-[#393744]">
              Kamar {room.roomNumber} · Lantai {room.floor}
            </div>
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold ${
              room.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {room.status === 'available' ? t.available : t.occupied}
            </div>
          </div>

          {/* Key Specs Card */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs">
            <h2 className="text-xl font-bold text-[#393744] mb-3">
              Kamar {room.roomNumber} — {room.categoryName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Luas Kamar:</span>
                <span className="font-bold text-slate-800 text-sm">{room.areaSqm} m²</span>
              </div>
              <div>
                <span className="text-slate-400 block">Kamar Mandi:</span>
                <span className="font-bold text-slate-800 text-sm">
                  {room.bathroomType === 'private' ? t.bathroomPrivate : t.bathroomShared}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Kapasitas:</span>
                <span className="font-bold text-slate-800 text-sm">Maks. {room.maxOccupancy} Orang</span>
              </div>
              <div>
                <span className="text-slate-400 block">Lantai:</span>
                <span className="font-bold text-slate-800 text-sm">Lantai {room.floor}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-bold text-[#393744] uppercase tracking-wider">{t.roomDescription}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {room.description} Terletak di lokasi strategis yang tenang dan dekat dengan café serta co-working space. Cocok untuk mahasiswa dan pekerja remote yang mendambakan kenyamanan dan efisiensi waktu.
              </p>
            </div>
          </div>

          {/* Facilities List */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#393744] uppercase tracking-wider">{t.roomFacilities}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {room.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Terms */}
          <div className="p-5 bg-[#FFFCF8] rounded-2xl border border-[#FFF0B8] shadow-xs space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-[#393744]">
              <Info className="w-4 h-4 text-amber-700" />
              <span>{t.roomRules}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>{t.minRentNote}</li>
              <li>{t.depositNotice}</li>
              <li>Jam hening malam dimulai pukul 22:00 WIB untuk kenyamanan seluruh penghuni.</li>
              <li>Dilarang merokok di dalam kamar ber-AC. Tersedia smoking area di balkon luar café.</li>
              <li>Penghuni mendapatkan diskon khusus 10% untuk pemesanan café dan ruang kerja co-working.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Contiguous Booking Module */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] shadow-sm sticky top-20 space-y-5">
            <div>
              <span className="text-xs text-slate-500">Tarif Sewa Bulanan</span>
              <div className="text-2xl font-extrabold text-[#393744] tabular-nums">
                {formatCurrency(room.monthlyPrice)}
                <span className="text-xs font-normal text-slate-500"> / bulan</span>
              </div>
            </div>

            {bookingStatusMsg ? (
              <div className={`p-4 rounded-xl text-xs space-y-2 ${
                bookingStatusMsg.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-start gap-2">
                  {bookingStatusMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <p className="leading-relaxed font-medium">{bookingStatusMsg.text}</p>
                </div>
                {bookingStatusMsg.success && (
                  <button
                    onClick={() => navigate('/dashboard/tenant')}
                    className="w-full mt-2 py-2 bg-[#393744] text-white rounded-lg font-bold text-center block"
                  >
                    Buka Dashboard Penghuni
                  </button>
                )}
              </div>
            ) : room.status !== 'available' ? (
              <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-600 space-y-2 text-center">
                <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="font-semibold">Kamar Ini Sedang Terisi</p>
                <p className="text-[11px] text-slate-500">Silakan pilih kamar lain yang masih berstatus Tersedia.</p>
                <button
                  onClick={() => navigate('/rooms')}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cari Kamar Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-[#393744]">{t.bookingFormTitle}</h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t.startDate}</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#F8D7E8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">{t.duration}</label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#F8D7E8]"
                  >
                    <option value={1}>1 Bulan (Uji Coba)</option>
                    <option value={3}>3 Bulan (1 Semester)</option>
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan (1 Tahun Penuh)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Kontak</label>
                  <input
                    type="email"
                    required
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Catatan Tambahan (Opsional)</label>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Contoh: Bawa motor / perkiraan tiba sore hari"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="p-3.5 bg-[#FFFCF8] rounded-xl border border-[#E6DDF7] space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Sewa Bulan Pertama:</span>
                    <span className="font-semibold text-[#393744] tabular-nums">{formatCurrency(room.monthlyPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Uang Jaminan (Deposit Refundable):</span>
                    <span className="font-semibold text-[#393744] tabular-nums">{formatCurrency(depositAmount)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E6DDF7] flex justify-between font-bold text-[#393744] text-sm">
                    <span>Total Pembayaran Pertama:</span>
                    <span className="tabular-nums text-purple-900">{formatCurrency(totalFirstPayment)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Memproses Pengajuan...' : t.submitBookingBtn}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
