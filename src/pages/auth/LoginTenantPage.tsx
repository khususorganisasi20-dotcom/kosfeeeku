import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginTenantPageProps {
  navigate: (path: string) => void;
}

export const LoginTenantPage: React.FC<LoginTenantPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('budi@student.ac.id');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, 'tenant', 'Budi Santoso');
    setLoading(false);

    if (res.success) {
      navigate('/dashboard/tenant');
    } else {
      setError(res.message || 'Login gagal.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Ganti Portal Masuk</span>
      </button>

      <div className="bg-white p-7 rounded-2xl border border-[#F8D7E8] shadow-sm space-y-5">
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#F8D7E8] flex items-center justify-center text-[#393744] mb-2">
            <User className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#393744]">Masuk Penghuni Kost</h1>
          <p className="text-xs text-slate-500">Akses riwayat tagihan, kontrak, dan pesanan café Anda.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Penghuni</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@student.ac.id"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">Kata Sandi</label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[11px] text-purple-700 hover:underline"
              >
                {t.forgotPasswordText}
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="p-2.5 bg-purple-50/70 rounded-lg text-[11px] text-purple-900">
            <strong>Akun Demo Cepat:</strong> budi@student.ac.id (otomatis login)
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Belum terdaftar?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-[#393744] hover:underline"
            >
              Daftar Akun Baru
            </button>
          </p>
        </div>
      </div>

    </div>
  );
};
