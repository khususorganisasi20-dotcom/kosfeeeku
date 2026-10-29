import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="inline-block p-4 rounded-3xl bg-[#F8D7E8] text-[#393744]">
        <span className="text-4xl font-extrabold font-mono">404</span>
      </div>
      <h1 className="text-2xl font-bold text-[#393744]">Halaman Tidak Ditemukan</h1>
      <p className="text-xs text-slate-500 leading-relaxed">
        Halaman yang Anda tuju mungkin telah dipindahkan atau tautan yang Anda masukkan salah.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </div>
  );
};
