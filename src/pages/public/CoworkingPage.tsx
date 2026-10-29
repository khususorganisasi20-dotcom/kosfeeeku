import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService, ASSETS } from '../../lib/database';
import { CoworkingResource } from '../../types';
import { PaymentModal } from '../../components/common/PaymentModal';
import { Laptop, Clock, Users, Wifi, CheckCircle2, Calendar, Shield, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoworkingPageProps {
  navigate: (path: string) => void;
}

export const CoworkingPage: React.FC<CoworkingPageProps> = ({ navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const { user } = useAuth();
  const resources = DatabaseService.getCoworkingResources();

  const [selectedResource, setSelectedResource] = useState<CoworkingResource>(resources[0]);
  const [reservationDate, setReservationDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [userName, setUserName] = useState(user?.fullName || 'Budi Santoso');
  const [userEmail, setUserEmail] = useState(user?.email || 'budi@student.ac.id');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState<string | null>(null);

  // Price computation
  const totalPrice = selectedResource.hourlyRate * durationHours;

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = DatabaseService.createCoworkingReservation({
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      userId: user?.id || 'guest-coworker',
      userName,
      userEmail,
      date: reservationDate,
      startTime,
      durationHours,
      totalPrice,
      paymentMethod: 'qris',
    });

    if (res.success && res.reservation) {
      setCreatedReservationId(res.reservation.id);
      setIsPaymentModalOpen(true);
    } else {
      setErrorMsg(res.message || 'Gagal membuat reservasi.');
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    confetti({ particleCount: 70, spread: 60 });
    navigate('/dashboard/tenant');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#D9ECFA]/70 via-[#E6DDF7]/50 to-[#FFFCF8] p-8 border border-[#D9ECFA]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 text-blue-900 text-xs font-semibold rounded-md border border-[#D9ECFA]">
            <Laptop className="w-3.5 h-3.5" />
            <span>Co-working Hub KosfeeKu</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#393744]">{t.coworkingTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.coworkingSubtitle} Dilengkapi Wi-Fi 150 Mbps stabil, colokan di tiap meja, kursi ergonomis, dan suasana hening produktif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Resources Selection Cards */}
        <div className="lg:col-span-7 space-y-5">
          <h2 className="text-lg font-bold text-[#393744]">Pilih Tipe Ruang Kerja</h2>

          <div className="space-y-4">
            {resources.map(res => {
              const isSelected = selectedResource.id === res.id;

              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-400 bg-white shadow-sm ring-2 ring-blue-100'
                      : 'border-[#E6DDF7] bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#393744]">{res.name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">
                          Kapasitas: {res.capacity} Orang
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {res.description}
                      </p>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <div className="text-base font-extrabold text-[#393744] tabular-nums">
                        {formatCurrency(res.hourlyRate)}
                        <span className="text-xs font-normal text-slate-500">{t.perHour}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        atau {formatCurrency(res.dailyRate)}{t.perDay}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                    {res.amenities.map((am, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{am}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Reservation Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleReserve} className="p-6 bg-white rounded-2xl border border-[#E6DDF7] shadow-sm sticky top-20 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#393744]">Formulir Reservasi</h3>
              <p className="text-xs text-slate-500">
                Memesan: <span className="font-semibold text-slate-900">{selectedResource.name}</span>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tanggal Penggunaan</label>
              <input
                type="date"
                required
                value={reservationDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setReservationDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t.selectTime}</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="08:00">08:00 WIB</option>
                  <option value="09:00">09:00 WIB</option>
                  <option value="10:00">10:00 WIB</option>
                  <option value="13:00">13:00 WIB</option>
                  <option value="15:00">15:00 WIB</option>
                  <option value="17:00">17:00 WIB</option>
                  <option value="19:00">19:00 WIB</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t.durationHours}</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value={1}>1 Jam</option>
                  <option value={2}>2 Jam</option>
                  <option value={3}>3 Jam (Sesi Standar)</option>
                  <option value={5}>5 Jam (Setengah Hari)</option>
                  <option value={8}>8 Jam (Seharian Penuh)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nama Pemesan</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Pemesan</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Calculations */}
            <div className="p-3.5 bg-[#FFFCF8] rounded-xl border border-[#D9ECFA] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tarif ({selectedResource.name}):</span>
                <span className="font-semibold tabular-nums">{formatCurrency(selectedResource.hourlyRate)} × {durationHours} jam</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#393744]">
                <span>Total Biaya:</span>
                <span className="tabular-nums text-blue-900">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              {t.reserveCoworkingBtn}
            </button>
          </form>
        </div>

      </div>

      {isPaymentModalOpen && createdReservationId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Reservasi Co-working #${createdReservationId.slice(-6)}`}
          category="coworking"
          referenceId={createdReservationId}
          amount={totalPrice}
          payerName={userName}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};
