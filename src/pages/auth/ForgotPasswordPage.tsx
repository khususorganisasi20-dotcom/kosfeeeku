import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  navigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Halaman Masuk</span>
      </button>

      <div className="bg-white p-7 rounded-2xl border border-[#E6DDF7] shadow-sm space-y-5">
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#F8D7E8] flex items-center justify-center text-[#393744] mb-2">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#393744]">Lupa Kata Sandi?</h1>
          <p className="text-xs text-slate-500">
            Masukkan alamat email terdaftar Anda untuk menerima tautan pemulihan sandi.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instruksi Terkirim</span>
            </div>
            <p>
              Tautan pemulihan telah dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
            </p>
            <button
              onClick={() => navigate('/reset-password')}
              className="mt-2 text-purple-700 underline font-semibold block"
            >
              Simulasi Reset Kata Sandi Sekarang →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Akun</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@student.ac.id"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Kirim Tautan Pemulihan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
