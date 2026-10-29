import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DatabaseService } from '../../lib/database';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const settings = DatabaseService.getSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Survei Kamar Kost');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseService.addNotification(
      'owner',
      'Pesan Kontak Baru Masuk',
      `Dari ${name} (${email}): "${subject} - ${message}"`,
      'info'
    );
    DatabaseService.logAudit('guest', name, 'tenant', 'CONTACT_INQUIRY', subject, message);
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-[#393744]">Hubungi KosfeeKu</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Punya pertanyaan mengenai sewa kamar, reservasi co-working, atau reservasi meja café? Tim kami siap membantu Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-5">
            <h3 className="text-base font-bold text-[#393744]">Informasi Pengelola</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Alamat Lokasi:</span>
                  <span className="text-slate-600">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">WhatsApp / Telepon:</span>
                  <span className="text-slate-600">{settings.whatsapp}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Email Resmi:</span>
                  <span className="text-slate-600">{settings.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Jam Buka:</span>
                  <span className="text-slate-600 block">Café: {settings.cafeHours}</span>
                  <span className="text-slate-600 block">Co-working: {settings.coworkingHours}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FFF0B8]/40 rounded-xl border border-[#FFF0B8] text-xs text-amber-900">
              <span className="font-bold">Tips Survei:</span> Datang langsung pada jam kerja café untuk melihat kamar dan menikmati kopi gratis dari kami!
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#393744]">Pesan Berhasil Terkirim!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Terima kasih telah menghubungi KosfeeKu. Pengelola kami akan segera merespons melalui WhatsApp atau email Anda.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-[#393744]">Formulir Pertanyaan & Survei</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@anda.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Topik Pembahasan</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Survei Kamar Kost">Jadwal Survei Kamar Kost</option>
                      <option value="Tanya Sewa Jangka Panjang">Tanya Sewa Jangka Panjang</option>
                      <option value="Reservasi Meeting Room">Reservasi Meeting Room Co-working</option>
                      <option value="Catering / Pesanan Café">Pesanan Katering / Acara Café</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Pesan / Rincian</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan tanggal rencana survei atau pertanyaan detail Anda di sini..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
