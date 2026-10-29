import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ASSETS } from '../../lib/database';
import { Coffee, Home, Laptop, Heart, Users, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8D7E8] text-[#393744] text-xs font-semibold rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>Tentang KosfeeKu</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#393744]">
          Kost Nyaman, Ngopi Gampang.
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          KosfeeKu lahir dari keresahan sederhana mahasiswa dan pekerja muda: bagaimana menciptakan ruang tinggal yang tenang, terawat, dan dekat dengan makanan lezat serta area kerja tanpa harus menempuh kemacetan jalanan.
        </p>
      </div>

      {/* Visual story */}
      <div className="rounded-3xl overflow-hidden shadow-md border border-[#E6DDF7] aspect-[21/9] bg-slate-100 relative">
        <img
          src={ASSETS.hero}
          alt="KosfeeKu Community Lounge"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 text-white">
          <div>
            <h3 className="text-xl font-bold">Sebuah Rumah dan Komunitas Hangat di Yogyakarta</h3>
            <p className="text-xs text-slate-200 mt-1 max-w-xl">
              Memadukan privasi hunian kost modern dengan kehangatan obrolan secangkir kopi di sore hari.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-[#F8D7E8] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8D7E8] flex items-center justify-center text-purple-800">
            <Home className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#393744]">1. Hunian Sehat & Terawat</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kamar dengan ventilasi alami yang baik, pilihan kamar mandi dalam ber-water heater, kasur berkualitas, dan fasilitas kebersihan rutin.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#FFF0B8] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0B8] flex items-center justify-center text-amber-800">
            <Coffee className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#393744]">2. Café Ramah Mahasiswa</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menyajikan sajian favorit mulai dari Indomie aneka topping, nasi ayam geprek sambal bawang, sampai kopi susu gula aren dengan harga terjangkau.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#D9ECFA] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D9ECFA] flex items-center justify-center text-blue-800">
            <Laptop className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#393744]">3. Co-working Produktif</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Koneksi internet tanpa hambatan, colokan listrik yang melimpah, serta ruang pertemuan yang siap mendukung diskusi tugas akhir dan karir Anda.
          </p>
        </div>
      </div>

      {/* Location card */}
      <div className="p-6 bg-[#FFFCF8] rounded-2xl border border-[#E6DDF7] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
            <MapPin className="w-4 h-4" />
            <span>Lokasi Strategis Kampus</span>
          </div>
          <h3 className="text-lg font-bold text-[#393744]">Jl. Boulevard Kampus No. 42, Sleman</h3>
          <p className="text-xs text-slate-600 max-w-lg">
            Hanya 5 menit dari kampus ternama, minimarket 24 jam, apotek, dan halte bus Trans Jogja. Lingkungan asri dan aman dengan penjagaan 24 jam.
          </p>
        </div>

        <button
          onClick={() => navigate('/contact')}
          className="px-5 py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          Hubungi Pengelola & Survei
        </button>
      </div>

    </div>
  );
};
