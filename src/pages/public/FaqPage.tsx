import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqPageProps {
  navigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Berapa tarif sewa kamar minimal di KosfeeKu?',
      a: 'Tarif sewa kamar di KosfeeKu dimulai dari Rp1.000.000/bulan untuk Standard Room (9 m²). Minimum periode sewa adalah 1 bulan.',
    },
    {
      q: 'Bagaimana sistem deposit kamar kost?',
      a: 'Penyewa membayar uang jaminan (deposit) sebesar 1 bulan sewa saat bulan pertama. Deposit ini bersifat refundable dan dikembalikan penuh saat masa sewa selesai jika tidak ada kerusakan atau tunggakan.',
    },
    {
      q: 'Metode pembayaran apa saja yang diterima?',
      a: 'KosfeeKu menerima QRIS resmi (mendukung BCA, Mandiri, BNI, BRI, GoPay, OVO, Dana, ShopeePay) serta pembayaran Tunai langsung di kasir café / kantor pengelola.',
    },
    {
      q: 'Apakah makanan café bisa diantar langsung ke kamar kost?',
      a: 'Bisa! Penghuni kost dapat memesan melalui halaman Café, memilih opsi "Antar ke Kamar Kost", dan memasukkan nomor kamar. Pesanan akan diantar hangat tanpa biaya ongkos kirim tambahan.',
    },
    {
      q: 'Bagaimana aturan jam malam bagi tamu luar?',
      a: 'Demi kenyamanan bersama, batas kunjungan tamu luar di area kamar kost adalah pukul 22:00 WIB. Namun area Café dan Co-working lantai 1 tetap beroperasi hingga jam operasional selesai.',
    },
    {
      q: 'Apakah harga sewa kost sudah termasuk listrik dan air?',
      a: 'Tarif sewa bulanan sudah termasuk air bersih, Wi-Fi 150 Mbps, pembuangan sampah, dan kebersihan area publik. Untuk kamar ber-AC, pemakaian listrik menggunakan sistem token pintar (voucher PLN) terpisah di tiap kamar agar adil.',
    },
    {
      q: 'Bagaimana cara memesan ruang co-working?',
      a: 'Anda dapat langsung masuk ke tab Co-working di web ini, memilih jenis meja atau meeting room, menentukan tanggal serta durasi jam, dan menyelesaikan pembayaran lewat QRIS atau Tunai.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0B8] text-[#393744] text-xs font-semibold rounded-full">
          <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
          <span>Pertanyaan Populer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#393744]">Frequently Asked Questions (FAQ)</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Temukan jawaban atas pertanyaan umum seputar sewa kost, café, pembayaran, dan co-working di KosfeeKu.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E6DDF7] overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#393744] hover:text-purple-700 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-purple-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-[#FFFCF8] rounded-2xl border border-[#FFF0B8] text-center space-y-2">
        <p className="text-xs font-semibold text-[#393744]">Masih memiliki pertanyaan lain?</p>
        <button
          onClick={() => navigate('/contact')}
          className="px-4 py-2 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
        >
          Hubungi Layanan Pengelola
        </button>
      </div>

    </div>
  );
};
