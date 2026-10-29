import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DatabaseService, ASSETS } from '../../lib/database';
import { Home, Coffee, Laptop, Wifi, Shield, Sparkles, ArrowRight, CheckCircle2, ChevronRight, Utensils } from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const rooms = DatabaseService.getRooms().slice(0, 3);
  const popularMenu = DatabaseService.getMenuItems().filter(m => m.isPopular).slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-[#FFFDFB] to-[#FFFCF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8D7E8]/70 border border-[#F8D7E8] rounded-full text-xs font-semibold text-[#393744]">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Hunian Kost · Café & Kopi · Co-working Space</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#393744] leading-[1.15]" style={{ textWrap: 'balance' }}>
                {t.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-[#393744]/80 leading-relaxed max-w-xl">
                {t.heroDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/rooms')}
                  className="px-6 py-3 bg-[#393744] hover:bg-[#524B66] text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>{t.findRoomBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/cafe')}
                  className="px-6 py-3 bg-[#FFF0B8] hover:bg-[#FFE899] text-[#393744] text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  <span>{t.exploreCafeBtn}</span>
                </button>

                <button
                  onClick={() => navigate('/coworking')}
                  className="px-5 py-3 border border-[#E6DDF7] hover:bg-[#E6DDF7]/50 text-[#393744] text-sm font-medium rounded-xl transition-all"
                >
                  {t.bookCoworkingBtn}
                </button>
              </div>

              {/* Verified Trust Markers */}
              <div className="pt-4 border-t border-[#E6DDF7] flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sewa Mulai Rp1.000.000/bln</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Wi-Fi Fiber 150 Mbps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Keamanan CCTV 24 Jam</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-[16/10] bg-slate-100">
                <img
                  src={ASSETS.hero}
                  alt="Suasana KosfeeKu Lounge & Café"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#FFF0B8]">Komunitas Hangat</p>
                  <p className="text-sm font-medium">KosfeeKu: Hunian nyaman, café enak, & tempat kerja produktif di Sleman, Yogyakarta.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THREE INTEGRATED SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-700">Tiga Layanan Dalam Satu Atap</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#393744]">
            Semua Kebutuhan Mahasiswa & Pekerja Modern
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Service 1: Kost */}
          <div
            onClick={() => navigate('/rooms')}
            className="p-6 rounded-2xl bg-[#F8D7E8]/40 border border-[#F8D7E8] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#393744] shadow-xs group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold text-[#393744]">{t.serviceKostTitle}</h3>
              <p className="text-xs text-[#393744]/80 leading-relaxed">
                {t.serviceKostDesc}
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs font-semibold text-purple-900">
              <span>Mulai Rp1.000.000/bln</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Pilih Kamar <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Service 2: Cafe */}
          <div
            onClick={() => navigate('/cafe')}
            className="p-6 rounded-2xl bg-[#FFF0B8]/50 border border-[#FFF0B8] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#393744] shadow-xs group-hover:scale-105 transition-transform">
                <Coffee className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-[#393744]">{t.serviceCafeTitle}</h3>
              <p className="text-xs text-[#393744]/80 leading-relaxed">
                {t.serviceCafeDesc}
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs font-semibold text-amber-900">
              <span>Mulai Rp4.000</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Lihat Menu <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Service 3: Coworking */}
          <div
            onClick={() => navigate('/coworking')}
            className="p-6 rounded-2xl bg-[#D9ECFA]/50 border border-[#D9ECFA] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#393744] shadow-xs group-hover:scale-105 transition-transform">
                <Laptop className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-[#393744]">{t.serviceCoworkingTitle}</h3>
              <p className="text-xs text-[#393744]/80 leading-relaxed">
                {t.serviceCoworkingDesc}
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs font-semibold text-blue-900">
              <span>Mulai Rp10.000/jam</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Pesan Meja <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED ROOMS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-700">Pilihan Kamar Kost</p>
            <h2 className="text-2xl font-bold text-[#393744]">Kamar Bersih, Tenang, & Nyaman</h2>
          </div>
          <button
            onClick={() => navigate('/rooms')}
            className="text-xs font-bold text-[#393744] hover:text-purple-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Lihat Semua Kamar ({DatabaseService.getRooms().length}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div
              key={room.id}
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-[#E6DDF7] hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={room.images[0] || ASSETS.roomDeluxe}
                  alt={`Kamar ${room.roomNumber}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#393744]">
                  {room.roomNumber} · Lt. {room.floor}
                </div>
                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-semibold ${
                  room.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {room.status === 'available' ? t.available : t.occupied}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{room.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{room.areaSqm} m²</span>
                    <span aria-hidden="true">·</span>
                    <span>{room.bathroomType === 'private' ? 'KM Dalam' : 'KM Luar'}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#393744] group-hover:text-purple-700 transition-colors">
                    Kamar {room.roomNumber} ({room.categoryName})
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {room.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Harga Sewa:</span>
                    <div className="text-base font-extrabold text-[#393744] tabular-nums">
                      {formatCurrency(room.monthlyPrice)}<span className="text-xs font-normal text-slate-500">/bln</span>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-[#F8D7E8] text-[#393744] text-xs font-semibold rounded-lg group-hover:bg-[#E6DDF7] transition-colors">
                    {t.viewDetails}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR CAFÉ MENU HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#FFFDF8] border border-[#FFF0B8] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Café & Masakan Hangat</p>
              <h2 className="text-2xl font-bold text-[#393744]">Menu Favorit KosfeeKu</h2>
              <p className="text-xs text-slate-500 mt-1">Bisa diantar langsung ke kamar kost atau dinikmati di area café.</p>
            </div>
            <button
              onClick={() => navigate('/cafe')}
              className="px-4 py-2 bg-[#FFF0B8] hover:bg-[#FFE899] text-[#393744] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Buka Menu Lengkap</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularMenu.map(item => (
              <div
                key={item.id}
                onClick={() => navigate('/cafe')}
                className="bg-white rounded-xl p-3 border border-amber-100 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-50 mb-3 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 bg-[#FFF0B8] text-[#393744] text-[10px] font-bold px-2 py-0.5 rounded">
                    Favorit
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#393744] group-hover:text-amber-800 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#393744] tabular-nums">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 group-hover:underline">
                    Pesan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CO-WORKING & FACILITIES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-[4/3] shadow-md border-2 border-white">
            <img
              src={ASSETS.coworkingHall}
              alt="Co-working Space KosfeeKu"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-block px-2.5 py-1 bg-[#D9ECFA] text-blue-900 rounded-md text-xs font-bold uppercase tracking-wider">
              Co-working & Ruang Belajar
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#393744]">
              Produktif Belajar & Kerja Tanpa Gangguan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dilengkapi koneksi Wi-Fi serat optik ultra cepat 150 Mbps, kursi ergonomis, stopkontak pribadi di setiap meja, dan free flow minuman. Disediakan pula ruang rapat privat untuk diskusi kelompok atau seminar online.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-[#E6DDF7]">
                <p className="text-xs font-semibold text-[#393744]">Hot Desk</p>
                <p className="text-xs text-slate-500">Rp10.000 / jam</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E6DDF7]">
                <p className="text-xs font-semibold text-[#393744]">Quiet Study Pod</p>
                <p className="text-xs text-slate-500">Rp15.000 / jam</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E6DDF7]">
                <p className="text-xs font-semibold text-[#393744]">Dedicated Workstation</p>
                <p className="text-xs text-slate-500">Rp20.000 / jam</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E6DDF7]">
                <p className="text-xs font-semibold text-[#393744]">Meeting Room (6 Pax)</p>
                <p className="text-xs text-slate-500">Rp65.000 / jam</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/coworking')}
              className="px-5 py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Reservasi Workspace Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-700">Langkah Mudah</p>
          <h2 className="text-2xl font-bold text-[#393744]">Cara Bergabung di KosfeeKu</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F8D7E8] text-[#393744] font-bold flex items-center justify-center mx-auto text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-[#393744]">Pilih & Ajukan Kamar</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jelajahi pilihan kamar Standard, Superior, atau Deluxe kami. Masukkan tanggal mulai sewa dan kirim pengajuan.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0B8] text-[#393744] font-bold flex items-center justify-center mx-auto text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-[#393744]">Konfirmasi Pengelola</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengelola akan memverifikasi ketersediaan dan menyetujui kontrak sewa serta menerbitkan invoice pembayaran.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#DCEFD9] text-[#393744] font-bold flex items-center justify-center mx-auto text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-[#393744]">Bayar & Nikmati Fasilitas</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bayar mudah via QRIS atau Tunai, check-in ke kamar baru Anda, dan nikmati diskon khusus menu café & coworking!
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#F8D7E8]/70 via-[#E6DDF7]/70 to-[#FFF0B8]/70 border border-[#E6DDF7] text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#393744]">
            Siap Menemukan Hunian & Kopi Favoritmu?
          </h2>
          <p className="text-xs sm:text-sm text-[#393744]/80 max-w-lg mx-auto">
            Kunjungi KosfeeKu hari ini atau hubungi pengelola kami melalui WhatsApp untuk jadwal survei kamar.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/rooms')}
              className="px-6 py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Lihat Ketersediaan Kamar
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-[#393744] text-xs font-semibold rounded-xl border border-[#E6DDF7] transition-colors"
            >
              Hubungi Pengelola
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
