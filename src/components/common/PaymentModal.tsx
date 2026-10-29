import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PaymentMethod } from '../../types';
import { DatabaseService } from '../../lib/database';
import { X, QrCode, Banknote, ShieldAlert, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: 'rent' | 'cafe' | 'coworking';
  referenceId: string;
  amount: number;
  payerName: string;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  referenceId,
  amount,
  payerName,
  onSuccess,
}) => {
  const { t, formatCurrency } = useLanguage();
  const [method, setMethod] = useState<PaymentMethod>('qris');
  const [step, setStep] = useState<'select' | 'processing' | 'submitted'>('select');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [transactionRef, setTransactionRef] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setTimeLeft(15 * 60);
      setTransactionRef(`TRX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== 'processing' || method !== 'qris') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, method]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleSubmitPayment = () => {
    DatabaseService.submitPayment({
      category,
      referenceId,
      description: title,
      amount,
      paymentMethod: method,
      payerName,
    });
    setStep('submitted');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6DDF7] relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'select' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#393744]">{t.paymentMethod}</h3>
              <p className="text-xs text-slate-500">{title}</p>
            </div>

            <div className="p-3 bg-[#FFFCF8] rounded-xl border border-[#E6DDF7] flex justify-between items-center">
              <span className="text-xs text-slate-600">Total Tagihan:</span>
              <span className="text-lg font-bold text-[#393744] tabular-nums">{formatCurrency(amount)}</span>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setMethod('qris')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  method === 'qris'
                    ? 'border-purple-400 bg-[#E6DDF7]/30 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={method === 'qris'}
                  onChange={() => setMethod('qris')}
                  className="mt-1 text-purple-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-[#393744]">{t.payWithQris}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    BCA Mobile, Livin' Mandiri, GoPay, OVO, Dana, ShopeePay.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setMethod('cash')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  method === 'cash'
                    ? 'border-purple-400 bg-[#E6DDF7]/30 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={method === 'cash'}
                  onChange={() => setMethod('cash')}
                  className="mt-1 text-purple-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-[#393744]">{t.payWithCash}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.paymentInstructionCash}
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={() => setStep('processing')}
              className="w-full py-3 bg-[#393744] hover:bg-[#524B66] text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Lanjutkan Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="space-y-4 text-center">
            {method === 'qris' ? (
              <>
                <div className="border-b pb-3">
                  <div className="inline-block bg-[#F8D7E8] text-[#393744] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                    QRIS Standar Pembayaran Nasional
                  </div>
                  <h3 className="text-base font-bold text-[#393744]">KOSFEEKU SLEMAN HUB</h3>
                  <p className="text-xs text-slate-500">NMID: ID102026042890</p>
                </div>

                <div className="flex justify-center my-2">
                  <div className="p-3 bg-white rounded-xl border-2 border-slate-900 shadow-md inline-block">
                    {/* Simulated Authentic QRIS Code */}
                    <div className="w-48 h-48 bg-slate-900 flex flex-col justify-between p-2 rounded relative">
                      <div className="flex justify-between">
                        <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white" />
                        </div>
                        <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center py-2">
                        <div className="bg-white p-1 rounded-sm text-[9px] font-black text-slate-900 tracking-tighter">
                          QRIS
                        </div>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white" />
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="w-2 h-2 bg-white" />
                          <div className="w-2 h-2 bg-white" />
                          <div className="w-2 h-2 bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-extrabold text-[#393744] tabular-nums">
                    {formatCurrency(amount)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.qrisExpiresIn}: {timeFormatted}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Ref: {transactionRef}</p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-left text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Petunjuk Pembayaran:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                    <li>Buka aplikasi m-Banking atau E-Wallet apa saja.</li>
                    <li>Pilih menu Bayar / Scan QRIS.</li>
                    <li>Periksa nama penerima: <strong>KOSFEEKU</strong>.</li>
                    <li>Masukkan PIN dan simpan bukti bayar.</li>
                  </ol>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setStep('select')}
                    className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Ganti Metode
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                  >
                    {t.confirmPaymentMade}
                  </button>
                </div>
              </>
            ) : (
              /* Cash instructions */
              <>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Banknote className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#393744]">Pembayaran Tunai</h3>
                <p className="text-xs text-slate-600 leading-relaxed px-4">
                  {t.paymentInstructionCash}
                </p>

                <div className="my-4 p-3 bg-[#FFFCF8] rounded-xl border border-[#E6DDF7] text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jumlah Uang Pas:</span>
                    <span className="font-bold text-[#393744] tabular-nums">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kode Transaksi:</span>
                    <span className="font-mono text-slate-700">{transactionRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Pembayar:</span>
                    <span className="font-medium text-slate-800">{payerName}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('select')}
                    className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#393744] hover:bg-[#524B66] rounded-lg transition-colors"
                  >
                    Saya Telah Menyerahkan Uang
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'submitted' && (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#393744]">Permintaan Pembayaran Dicatat</h3>
            <p className="text-xs text-slate-500 px-4 leading-relaxed">
              {t.paymentPendingNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
