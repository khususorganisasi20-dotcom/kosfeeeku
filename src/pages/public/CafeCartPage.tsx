import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService } from '../../lib/database';
import { PaymentModal } from '../../components/common/PaymentModal';
import { ArrowLeft, Trash2, Plus, Minus, Tag, Check, ShoppingBag, Utensils, Home, Coffee } from 'lucide-react';

interface CafeCartPageProps {
  navigate: (path: string) => void;
}

export const CafeCartPage: React.FC<CafeCartPageProps> = ({ navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const { user } = useAuth();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    deliveryType,
    setDeliveryType,
    tableNumber,
    setTableNumber,
    roomNumber,
    setRoomNumber,
    customerNotes,
    setCustomerNotes,
    couponCode,
    discountAmount,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotal,
    total,
    itemCount,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [customerName, setCustomerName] = useState(user?.fullName || 'Budi Santoso');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '0812-9988-7766');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const handleCheckoutInit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Create cafe order in database
    const orderItems = items.map((it, idx) => ({
      id: `it-${Date.now()}-${idx}`,
      menuItemId: it.menuItem.id,
      name: it.menuItem.name,
      price: it.menuItem.price,
      quantity: it.quantity,
      subtotal: it.menuItem.price * it.quantity,
      notes: it.notes,
    }));

    const order = DatabaseService.createCafeOrder({
      customerId: user?.id || 'guest-customer',
      customerName,
      customerPhone,
      deliveryType,
      tableNumber: deliveryType === 'dine_in' ? tableNumber : undefined,
      roomNumber: deliveryType === 'room_delivery' ? roomNumber : undefined,
      items: orderItems,
      subtotal,
      discountAmount,
      couponCode: couponCode || undefined,
      totalAmount: total,
      paymentMethod: 'qris', // Default, modified inside PaymentModal
    });

    setCreatedOrderId(order.id);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    clearCart();
    navigate('/dashboard/tenant');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF0B8] flex items-center justify-center mx-auto text-amber-800">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#393744]">{t.cartEmpty}</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Nikmati Indomie komplit, nasi ayam geprek krispi, atau es kopi susu gula aren buatan barista kami.
        </p>
        <button
          onClick={() => navigate('/cafe')}
          className="px-6 py-2.5 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl transition-colors"
        >
          {t.exploreCafeBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/cafe')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tambah Menu Lain</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#393744]">{t.cartTitle} ({itemCount})</h1>
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Kosongkan Keranjang
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DDF7] divide-y divide-slate-100 shadow-xs">
            {items.map(item => (
              <div key={item.menuItem.id} className="p-4 flex items-center gap-4">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#393744] truncate">{item.menuItem.name}</h4>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {formatCurrency(item.menuItem.price)} × {item.quantity}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    className="p-1 hover:bg-white rounded text-slate-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold tabular-nums text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    className="p-1 hover:bg-white rounded text-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#393744] tabular-nums">
                    {formatCurrency(item.menuItem.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="text-[11px] text-slate-400 hover:text-rose-600 mt-1 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="p-4 bg-white rounded-2xl border border-[#E6DDF7] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#393744]">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>{t.enterCoupon} (Gunakan kode: KOSFEEHEMAT untuk diskon 15%)</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                placeholder="Contoh: KOSFEEHEMAT"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono focus:ring-2 focus:ring-[#F8D7E8]"
              />
              <button
                type="button"
                onClick={() => {
                  applyCoupon(inputCoupon);
                  setInputCoupon('');
                }}
                className="px-4 py-2 bg-[#F8D7E8] hover:bg-[#E6DDF7] text-[#393744] text-xs font-bold rounded-xl transition-colors"
              >
                {t.applyCoupon}
              </button>
            </div>

            {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
            {couponCode && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg">
                <span className="font-semibold">Kupon aktif: {couponCode} (-{formatCurrency(discountAmount)})</span>
                <button onClick={removeCoupon} className="text-emerald-700 underline text-[11px]">Hapus</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Delivery Details & Order Summary */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleCheckoutInit} className="bg-white p-6 rounded-2xl border border-[#E6DDF7] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#393744]">Informasi Pemesan & Pengantaran</h3>

            {/* Delivery Type Segmented Tabs */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">{t.deliveryType}</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeliveryType('dine_in')}
                  className={`py-2 text-[11px] font-semibold rounded-lg transition-all ${
                    deliveryType === 'dine_in' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.dineIn}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('takeaway')}
                  className={`py-2 text-[11px] font-semibold rounded-lg transition-all ${
                    deliveryType === 'takeaway' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.takeaway}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('room_delivery')}
                  className={`py-2 text-[11px] font-semibold rounded-lg transition-all ${
                    deliveryType === 'room_delivery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.roomDelivery}
                </button>
              </div>
            </div>

            {/* Dynamic fields based on delivery type */}
            {deliveryType === 'dine_in' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t.tableNumber}</label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Contoh: Meja 04 / Meja Bar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            )}

            {deliveryType === 'room_delivery' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t.roomNumber} (Penghuni Kost)</label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Contoh: Kamar A-102"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">No. WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Catatan Masakan (Opsional)</label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Contoh: Sambal dipisah, kopi sedikit manis, kuah banyak"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Calculations */}
            <div className="p-3.5 bg-[#FFFCF8] rounded-xl border border-[#E6DDF7] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}:</span>
                <span className="font-semibold text-[#393744] tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Diskon Kupon:</span>
                  <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E6DDF7] flex justify-between font-bold text-base text-[#393744]">
                <span>{t.total}:</span>
                <span className="tabular-nums text-purple-900">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#393744] hover:bg-[#524B66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.checkoutBtn}</span>
            </button>
          </form>
        </div>

      </div>

      {/* Unified Payment Modal */}
      {isPaymentModalOpen && createdOrderId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Pesanan Café KosfeeKu #${createdOrderId.slice(-6)}`}
          category="cafe"
          referenceId={createdOrderId}
          amount={total}
          payerName={customerName}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
