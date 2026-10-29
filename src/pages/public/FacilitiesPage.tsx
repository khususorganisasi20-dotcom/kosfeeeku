import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Wifi, Shield, Wind, Sparkles, Tv, UtensilsCrossed, Droplets, Car, Coffee, Lock } from 'lucide-react';

interface FacilitiesPageProps {
  navigate: (path: string) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  const facilitiesList = [
    {
      icon: <Wifi className="w-6 h-6 text-purple-700" />,
      title: 'Wi-Fi Fiber Optik 150 Mbps',
      desc: 'Akses internet stabil dengan backup jalur ganda di setiap lantai kost, café, dan co-working space.',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-700" />,
      title: 'Akses Smart Card & CCTV 24 Jam',
      desc: 'Pintu utama menggunakan akses kartu magnetik RFID dan diawasi 16 titik kamera keamanan demi keselamatan.',
    },
    {
      icon: <Wind className="w-6 h-6 text-blue-700" />,
      title: 'Pilihan Kamar AC & Ventilasi Alami',
      desc: 'Unit berpendingin udara hemat energi (0.5 - 1 PK) dengan jendela sirkulasi udara luar yang sehat.',
    },
    {
      icon: <Droplets className="w-6 h-6 text-cyan-700" />,
      title: 'Kamar Mandi Bersih & Water Heater',
      desc: 'Dilengkapi kloset duduk, shower air hangat, dan jasa kebersihan area publik setiap hari.',
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6 text-amber-700" />,
      title: 'Dapur Bersama & Kulkas',
      desc: 'Area dapur komunal lengkap dengan kompor gas, microwave, dispenser air minum gratis, dan wastafel cuci piring.',
    },
    {
      icon: <Coffee className="w-6 h-6 text-amber-800" />,
      title: 'Café & Resto di Lantai 1',
      desc: 'Menu masakan hangat dan racikan kopi barista siap diantar langsung ke kamar Anda dengan harga bersahabat.',
    },
    {
      icon: <Car className="w-6 h-6 text-slate-700" />,
      title: 'Area Parkir Motor & Mobil',
      desc: 'Parkir beratap kanopi aman khusus penghuni kost dan pengunjung café dengan penerangan memadai.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-600" />,
      title: 'Area Laundry & Jemur Terlindungi',
      desc: 'Tersedia mesin cuci bersama serta layanan laundry kiloan mitra kost dengan harga khusus.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-[#393744]">Fasilitas Lengkap KosfeeKu</h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Dirancang untuk memberikan standar hidup yang praktis, aman, dan higienis bagi mahasiswa serta pekerja profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {facilitiesList.map((f, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-[#E6DDF7] hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F8D7E8]/50 flex items-center justify-center">
              {f.icon}
            </div>
            <h3 className="text-sm font-bold text-[#393744]">{f.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-[#FFFCF8] border border-[#E6DDF7] text-center space-y-4">
        <h3 className="text-lg font-bold text-[#393744]">Ingin Melihat Langsung Fasilitas Kami?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Silakan jadwalkan survei lokasi dengan pengelola kami atau langsung datang ke café KosfeeKu.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/rooms')}
            className="px-5 py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Pilih Kamar
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#393744] text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            Kontak WhatsApp
          </button>
        </div>
      </div>

    </div>
  );
};
