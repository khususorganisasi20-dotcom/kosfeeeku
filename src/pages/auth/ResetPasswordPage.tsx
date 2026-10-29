import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';

interface ResetPasswordPageProps {
  navigate: (path: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak sesuai.');
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="bg-white p-7 rounded-2xl border border-[#E6DDF7] shadow-sm space-y-5">
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#F8D7E8] flex items-center justify-center text-[#393744] mb-2">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#393744]">Buat Kata Sandi Baru</h1>
          <p className="text-xs text-slate-500">Masukkan kata sandi baru yang aman untuk akun Anda.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kata Sandi Berhasil Diperbarui</span>
            </div>
            <p>Anda sekarang dapat masuk dengan kata sandi baru Anda.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 bg-[#393744] text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Simpan Kata Sandi Baru
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
