import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { User, Shield, ArrowRight, Home, Coffee } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#393744]">Masuk ke KosfeeKu</h1>
        <p className="text-xs text-slate-500">Pilih jenis akun yang sesuai untuk melanjutkan ke portal Anda.</p>
      </div>

      <div className="space-y-4">
        {/* Tenant Option */}
        <div
          onClick={() => navigate('/login/tenant')}
          className="p-5 rounded-2xl bg-white border border-[#F8D7E8] hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F8D7E8] flex items-center justify-center text-[#393744] group-hover:bg-[#E6DDF7] transition-colors">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#393744]">Penghuni / Tamu</h3>
              <p className="text-[11px] text-slate-500">Cek status sewa, tagihan kamar, atau pesanan café</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Owner / Staff Option */}
        <div
          onClick={() => navigate('/login/owner')}
          className="p-5 rounded-2xl bg-white border border-[#FFF0B8] hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FFF0B8] flex items-center justify-center text-[#393744] group-hover:bg-[#FFE899] transition-colors">
              <Shield className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#393744]">Pengelola (Owner / Staff)</h3>
              <p className="text-[11px] text-slate-500">Akses operasional kost, dapur café, dan verifikasi bayar</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Belum punya akun?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-bold text-[#393744] hover:underline"
          >
            Daftar Akun Penghuni
          </button>
        </p>
      </div>

    </div>
  );
};
