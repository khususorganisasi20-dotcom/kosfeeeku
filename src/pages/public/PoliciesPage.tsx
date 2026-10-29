import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

interface PoliciesPageProps {
  navigate: (path: string) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DCEFD9] text-emerald-900 text-xs font-semibold rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ketentuan & Aturan Resmi</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#393744]">Kebijakan & Syarat Hunian KosfeeKu</h1>
        <p className="text-xs text-slate-500">
          Terakhir diperbarui: Oktober 2026. Berlaku untuk seluruh penghuni kost, pengunjung café, dan pengguna co-working space.
        </p>
      </div>

      <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
        
        {/* Section 1 */}
        <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#393744] flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-700" />
            <span>1. Perjanjian Sewa & Pembayaran</span>
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600">
            <li>Masa sewa minimal adalah 1 (satu) bulan dengan tarif terendah Rp1.000.000/bulan.</li>
            <li>Uang jaminan (deposit refundable) sebesar 1 bulan sewa wajib diserahkan sebelum serah terima kunci.</li>
            <li>Tagihan sewa bulanan jatuh tempo setiap tanggal 5. Keterlambatan pembayaran lebih dari 5 hari kerja tanpa pemberitahuan dapat dikenakan sanksi peringatan.</li>
            <li>Pembayaran dinyatakan sah hanya jika telah diverifikasi oleh sistem dan staff yang berwenang (bukti QRIS atau tanda terima kasir resmi).</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#393744] flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-700" />
            <span>2. Ketertiban & Keamanan Bersama</span>
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600">
            <li>Jam hening malam dimulai pukul 22:00 WIB hingga 06:00 WIB. Penghuni diharapkan tidak menyalakan musik atau suara bising di dalam kamar.</li>
            <li>Tamu lawan jenis dilarang memasuki kamar pribadi demi norma kesopanan dan ketertiban lingkungan kost. Tamu dapat diterima di ruang café atau lounge publik.</li>
            <li>Kunci kamar dan kartu akses RFID bersifat pribadi dan tidak boleh dipinjamkan atau diduplikasi tanpa izin tertulis dari pengelola.</li>
            <li>Dilarang keras membawa atau mengonsumsi narkotika, minuman keras beralkohol tinggi, senjata tajam, atau zat terlarang lainnya di seluruh area KosfeeKu.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#393744] flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-700" />
            <span>3. Kebijakan Pembatalan & Pengembalian Dana (Refund)</span>
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600">
            <li>Pembatalan sewa kost sebelum tanggal masuk yang diajukan akan mengembalikan 100% uang jaminan deposit.</li>
            <li>Reservasi ruang kerja co-working dapat dibatalkan minimal 2 jam sebelum jadwal mulai dengan pengembalian saldo kredit penuh.</li>
            <li>Pesanan café yang telah diproses dapur (status Preparing) tidak dapat dibatalkan secara sepihak.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
