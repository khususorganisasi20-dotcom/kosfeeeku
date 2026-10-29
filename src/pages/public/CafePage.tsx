import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { DatabaseService } from '../../lib/database';
import { FoodCategory, MenuItem } from '../../types';
import { Search, Coffee, ShoppingBag, Plus, Minus, Utensils, Check, ArrowRight } from 'lucide-react';

interface CafePageProps {
  navigate: (path: string) => void;
}

export const CafePage: React.FC<CafePageProps> = ({ navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const { addToCart, items, itemCount, total } = useCart();
  const menuItems = DatabaseService.getMenuItems();

  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories: { key: FoodCategory | 'all'; label: string }[] = [
    { key: 'all', label: t.all },
    { key: 'noodles', label: t.catNoodles },
    { key: 'rice', label: t.catRice },
    { key: 'snacks', label: t.catSnacks },
    { key: 'desserts', label: t.catDesserts },
    { key: 'coffee', label: t.catCoffee },
    { key: 'tea', label: t.catTea },
    { key: 'non_coffee', label: t.catNonCoffee },
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const handleAdd = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedNotice(item.name);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF0B8]/60 via-[#F8D7E8]/40 to-[#FFFCF8] border border-[#FFF0B8] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 text-[#393744] text-xs font-semibold rounded-md border border-[#FFF0B8]">
            <Utensils className="w-3.5 h-3.5 text-amber-700" />
            <span>Café & Resto KosfeeKu</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#393744]">{t.cafeTitle}</h1>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            {t.cafeSubtitle} Harga terjangkau untuk mahasiswa & penghuni kost!
          </p>
        </div>

        {/* Quick Cart Action */}
        <button
          onClick={() => navigate('/cafe/cart')}
          className="self-start md:self-center px-5 py-3 bg-[#393744] hover:bg-[#524B66] text-white rounded-2xl shadow-xs transition-all flex items-center gap-3 shrink-0"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <div className="text-left text-xs">
            <div className="text-[11px] text-slate-300">{itemCount} Menu Dipilih</div>
            <div className="font-bold tabular-nums">{formatCurrency(total)}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Added Toast */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#393744] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>"{addedNotice}" ditambahkan ke keranjang!</span>
        </div>
      )}

      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, mie ayam, geprek, camilan..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E6DDF7] rounded-xl text-xs text-[#393744] focus:outline-none focus:ring-2 focus:ring-[#FFF0B8]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#393744] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => {
          const inCart = items.find(i => i.menuItem.id === item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E6DDF7] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                {item.isPopular && (
                  <div className="absolute top-3 left-3 bg-[#FFF0B8] text-[#393744] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    Favorit
                  </div>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                    {t.outOfStock}
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                    <span>{item.category.replace('_', ' ')}</span>
                    <span className="tabular-nums">Stok: {item.stock}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#393744] group-hover:text-purple-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-base font-bold text-[#393744] tabular-nums">
                    {formatCurrency(item.price)}
                  </div>

                  {item.available ? (
                    inCart ? (
                      <div className="flex items-center gap-1.5 bg-[#FFF0B8] px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold text-[#393744]">{inCart.quantity} di Keranjang</span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-5 h-5 bg-[#393744] text-white rounded flex items-center justify-center hover:bg-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(item)}
                        className="px-3 py-1.5 bg-[#F8D7E8] hover:bg-[#E6DDF7] text-[#393744] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.addToCart}</span>
                      </button>
                    )
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Habis</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
