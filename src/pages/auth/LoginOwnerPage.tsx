import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, ArrowLeft, AlertCircle } from 'lucide-react';

interface LoginOwnerPageProps {
  navigate: (path: string) => void;
}

export const LoginOwnerPage: React.FC<LoginOwnerPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('ratna@kosfeeku.com');
  const [password, setPassword] = useState('password123');
  const [roleOption, setRoleOption] = useState<'owner' | 'staff'>('owner');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const name = roleOption === 'owner' ? 'Hj. Ratna Wijaya' : 'Andika Pratama';
    const res = await login(email, roleOption, name);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard/owner');
    } else {
      setError(res.message || 'Login pengelola gagal.');
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

      <div className="bg-white p-7 rounded-2xl border border-[#FFF0B8] shadow-sm space-y-5">
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0B8] flex items-center justify-center text-amber-900 mb-2">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#393744]">Portal Pengelola (Owner & Staff)</h1>
          <p className="text-xs text-slate-500">Kelola inventaris kost, pesanan dapur café, dan verifikasi pembayaran.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Tingkat Akses</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => {
                  setRoleOption('owner');
                  setEmail('ratna@kosfeeku.com');
                }}
                className={`py-1.5 font-semibold rounded-lg transition-all ${
                  roleOption === 'owner' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Owner Utama
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleOption('staff');
                  setEmail('dika.barista@kosfeeku.com');
                }}
                className={`py-1.5 font-semibold rounded-lg transition-all ${
                  roleOption === 'staff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Staff Operasional
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Pengelola</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="p-2.5 bg-amber-50/80 rounded-lg text-[11px] text-amber-900">
            <strong>Keamanan RLS:</strong> Akses ini memiliki izin untuk menyetujui sewa kamar dan memvalidasi pembayaran QRIS/Tunai.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Dashboard Bisnis'}
          </button>
        </form>
      </div>

    </div>
  );
};
