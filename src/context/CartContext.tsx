import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, DeliveryType } from '../types';
import { DatabaseService } from '../lib/database';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  roomNumber: string;
  setRoomNumber: (room: string) => void;
  customerNotes: string;
  setCustomerNotes: (notes: string) => void;
  couponCode: string;
  discountAmount: number;
  couponError: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kosfeeku_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('dine_in');
  const [tableNumber, setTableNumber] = useState('Meja 04');
  const [roomNumber, setRoomNumber] = useState('A-102');
  const [customerNotes, setCustomerNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    localStorage.setItem('kosfeeku_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (menuItem: MenuItem, quantity = 1, notes?: string) => {
    if (!menuItem.available || menuItem.stock <= 0) return;

    setItems(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, menuItem.stock);
        return prev.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: newQty, notes: notes || i.notes } : i);
      }
      return [...prev, { menuItem, quantity: Math.min(quantity, menuItem.stock), notes }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev => prev.map(i => {
      if (i.menuItem.id === itemId) {
        const validQty = Math.min(quantity, i.menuItem.stock);
        return { ...i, quantity: validQty };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountAmount(0);
    setCouponError('');
  };

  const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const applyCoupon = (code: string): boolean => {
    setCouponError('');
    if (!code.trim()) {
      setCouponError('Masukkan kode kupon');
      return false;
    }
    const res = DatabaseService.validateCoupon(code, subtotal, 'cafe');
    if (res.valid) {
      setCouponCode(code.toUpperCase());
      setDiscountAmount(res.discountAmount);
      return true;
    } else {
      setCouponError(res.message || 'Kupon tidak berlaku');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setCouponError('');
  };

  // Recalculate discount if subtotal changes
  useEffect(() => {
    if (couponCode) {
      const res = DatabaseService.validateCoupon(couponCode, subtotal, 'cafe');
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
      } else {
        setDiscountAmount(0);
        setCouponCode('');
      }
    }
  }, [subtotal]);

  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
