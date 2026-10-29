import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DatabaseService, ASSETS } from '../../lib/database';
import { Room, BathroomType, RoomStatus } from '../../types';
import { Search, Filter, Home, CheckCircle2, SlidersHorizontal, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoomsPageProps {
  navigate: (path: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ navigate }) => {
  const { t, formatCurrency } = useLanguage();
  const rooms = DatabaseService.getRooms();
  const categories = DatabaseService.getCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBathroom, setSelectedBathroom] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchSearch =
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || room.categoryId === selectedCategory;
      const matchBathroom = selectedBathroom === 'all' || room.bathroomType === selectedBathroom;
      const matchStatus = !onlyAvailable || room.status === 'available';
      const matchPrice = room.monthlyPrice <= maxPrice;

      return matchSearch && matchCategory && matchBathroom && matchStatus && matchPrice;
    });
  }, [rooms, searchQuery, selectedCategory, selectedBathroom, onlyAvailable, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8D7E8] text-[#393744] text-xs font-semibold rounded-md">
          <Home className="w-3.5 h-3.5 text-purple-700" />
          <span>Hunian Kost KosfeeKu</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#393744]">Daftar Kamar Kost</h1>
        <p className="text-xs text-slate-500 max-w-xl">
          {t.minRentNote} Semua unit dirawat secara berkala dengan sirkulasi udara bersih dan fasilitas lengkap.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6DDF7] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor kamar, fasilitas (AC, Wi-Fi, dll)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#393744] focus:outline-none focus:ring-2 focus:ring-[#F8D7E8]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#393744] focus:outline-none focus:ring-2 focus:ring-[#F8D7E8]"
            >
              <option value="all">Semua Tipe Kamar</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Bathroom Filter */}
          <div>
            <select
              value={selectedBathroom}
              onChange={(e) => setSelectedBathroom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#393744] focus:outline-none focus:ring-2 focus:ring-[#F8D7E8]"
            >
              <option value="all">Semua Jenis KM</option>
              <option value="private">{t.bathroomPrivate}</option>
              <option value="shared">{t.bathroomShared}</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-4 text-xs">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span>Hanya yang Tersedia ({rooms.filter(r => r.status === 'available').length})</span>
            </label>

            <div className="flex items-center gap-2 text-slate-600">
              <span>Maksimal Harga:</span>
              <span className="font-bold text-[#393744] tabular-nums">{formatCurrency(maxPrice)}</span>
              <input
                type="range"
                min="1000000"
                max="2500000"
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-28 accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="text-slate-500">
            Menampilkan <span className="font-semibold text-slate-900">{filteredRooms.length}</span> dari {rooms.length} kamar
          </div>
        </div>
      </div>

      {/* Room Grid */}
      {filteredRooms.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Home className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak Ada Kamar yang Sesuai</h3>
          <p className="text-xs text-slate-500">Coba ubah kriteria filter harga atau tipe kamar mandi Anda.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedBathroom('all');
              setOnlyAvailable(false);
              setMaxPrice(2000000);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <div
              key={room.id}
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-[#E6DDF7] hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={room.images[0] || ASSETS.roomDeluxe}
                  alt={`Kamar ${room.roomNumber}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#393744]">
                  {room.roomNumber} · Lt. {room.floor}
                </div>
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                  room.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {room.status === 'available' ? t.available : t.occupied}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{room.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{room.areaSqm} m²</span>
                    <span aria-hidden="true">·</span>
                    <span>{room.bathroomType === 'private' ? t.bathroomPrivate : t.bathroomShared}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#393744] group-hover:text-purple-700 transition-colors">
                    Kamar {room.roomNumber} ({room.categoryName})
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {room.description}
                  </p>

                  {/* Facilities Preview */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {room.facilities.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                    {room.facilities.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{room.facilities.length - 3} lainnya</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Harga Sewa:</span>
                    <div className="text-base font-extrabold text-[#393744] tabular-nums">
                      {formatCurrency(room.monthlyPrice)}<span className="text-xs font-normal text-slate-500">{t.perMonth}</span>
                    </div>
                  </div>
                  <span className="px-3.5 py-2 bg-[#F8D7E8] text-[#393744] text-xs font-semibold rounded-xl group-hover:bg-[#E6DDF7] transition-colors flex items-center gap-1">
                    {t.viewDetails} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
