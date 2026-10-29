import {
  Room,
  RoomCategory,
  RoomBooking,
  RentalContract,
  RentInvoice,
  MenuItem,
  CafeOrder,
  CoworkingResource,
  CoworkingReservation,
  PaymentRecord,
  MaintenanceTicket,
  AppNotification,
  AuditLog,
  BusinessSettings,
  Coupon,
  LoyaltyAccount,
  StaffMember
} from '../types';

// Asset references
export const ASSETS = {
  hero: '/src/assets/images/hero_kosfeeku_lounge_1793237051224.jpg',
  roomDeluxe: '/src/assets/images/room_deluxe_suite_1793237052243.jpg',
  cafeSpread: '/src/assets/images/cafe_signature_spread_1793237053782.jpg',
  coworkingHall: '/src/assets/images/coworking_study_hall_1793237052792.jpg',
};

// Seed Categories
const initialCategories: RoomCategory[] = [
  {
    id: 'cat-standard',
    name: 'Standard Room',
    description: 'Kamar nyaman fungsional 9 m² dengan perabotan lengkap dan kamar mandi luar bersih.',
    areaSqm: 9,
    basePricePerMonth: 1000000,
    bathroomType: 'shared',
    maxOccupancy: 1,
  },
  {
    id: 'cat-superior',
    name: 'Superior Room',
    description: 'Kamar 10.5 m² dengan meja belajar lebih luas, sirkulasi udara optimal, dan kamar mandi dalam.',
    areaSqm: 10.5,
    basePricePerMonth: 1400000,
    bathroomType: 'private',
    maxOccupancy: 1,
  },
  {
    id: 'cat-deluxe',
    name: 'Deluxe Suite',
    description: 'Kamar eksklusif 16 m² ber-AC, spring bed queen size, smart desk, lemari besar, dan kamar mandi dalam.',
    areaSqm: 16,
    basePricePerMonth: 1800000,
    bathroomType: 'private',
    maxOccupancy: 2,
  },
];

// Seed Rooms (Min price Rp1,000,000)
const initialRooms: Room[] = [
  {
    id: 'room-101',
    roomNumber: 'A-101',
    categoryId: 'cat-standard',
    categoryName: 'Standard Room',
    areaSqm: 9,
    monthlyPrice: 1000000,
    facilities: ['Kasur Single', 'Meja & Kursi Belajar', 'Lemari Pakaian', 'Wi-Fi 100 Mbps', 'Kipas Angin', 'Ventilasi Alami'],
    bathroomType: 'shared',
    maxOccupancy: 1,
    status: 'available',
    description: 'Kamar lantai 1 tenang dan nyaman, dekat dengan area dapur bersama dan café.',
    images: [ASSETS.roomDeluxe],
    floor: 1,
  },
  {
    id: 'room-102',
    roomNumber: 'A-102',
    categoryId: 'cat-standard',
    categoryName: 'Standard Room',
    areaSqm: 9,
    monthlyPrice: 1000000,
    facilities: ['Kasur Single', 'Meja & Kursi Belajar', 'Lemari Pakaian', 'Wi-Fi 100 Mbps', 'Kipas Angin'],
    bathroomType: 'shared',
    maxOccupancy: 1,
    status: 'occupied',
    description: 'Kamar berpenghuni aktif, pencahayaan alami maksimal.',
    images: [ASSETS.roomDeluxe],
    floor: 1,
    currentTenantId: 'tenant-demo',
    currentTenantName: 'Budi Santoso',
  },
  {
    id: 'room-201',
    roomNumber: 'B-201',
    categoryId: 'cat-superior',
    categoryName: 'Superior Room',
    areaSqm: 10.5,
    monthlyPrice: 1400000,
    facilities: ['AC 0.5 PK', 'Kamar Mandi Dalam (Shower & Kloset Duduk)', 'Kasur Single Comfort', 'Meja Ergonomis', 'Wi-Fi Super Cepat'],
    bathroomType: 'private',
    maxOccupancy: 1,
    status: 'available',
    description: 'Kamar lantai 2 dengan pemandangan taman luar dan kamar mandi pribadi.',
    images: [ASSETS.roomDeluxe],
    floor: 2,
  },
  {
    id: 'room-202',
    roomNumber: 'B-202',
    categoryId: 'cat-superior',
    categoryName: 'Superior Room',
    areaSqm: 10.5,
    monthlyPrice: 1400000,
    facilities: ['AC 0.5 PK', 'Kamar Mandi Dalam', 'Kasur Single Comfort', 'Meja Ergonomis', 'Wi-Fi Super Cepat', 'Lemari Cermin'],
    bathroomType: 'private',
    maxOccupancy: 1,
    status: 'available',
    description: 'Kamar lantai 2 sejuk dan nyaman untuk belajar atau bekerja fokus.',
    images: [ASSETS.roomDeluxe],
    floor: 2,
  },
  {
    id: 'room-301',
    roomNumber: 'C-301',
    categoryId: 'cat-deluxe',
    categoryName: 'Deluxe Suite',
    areaSqm: 16,
    monthlyPrice: 1800000,
    facilities: ['AC 1 PK', 'Kamar Mandi Dalam + Water Heater', 'Kasur Queen Bed', 'Workstation Monitor Stand', 'Balkon Pribadi', 'Smart Lock'],
    bathroomType: 'private',
    maxOccupancy: 2,
    status: 'available',
    description: 'Unit paling luas dengan balkon pribadi, jendela besar, dan fasilitas premier.',
    images: [ASSETS.roomDeluxe],
    floor: 3,
  },
];

// Seed Menu Items - All items from user prompt specification
const initialMenuItems: MenuItem[] = [
  // Noodles and quick meals
  { id: 'm-1', name: 'Indomie Goreng', category: 'noodles', price: 9000, description: 'Indomie goreng legendaris dengan bawang goreng dan irisan cabe rawit.', image: ASSETS.cafeSpread, available: true, stock: 85, isPopular: true },
  { id: 'm-2', name: 'Indomie Kuah', category: 'noodles', price: 9000, description: 'Indomie kuah hangat rasa Soto / Ayam Bawang gurih segar.', image: ASSETS.cafeSpread, available: true, stock: 70 },
  { id: 'm-3', name: 'Indomie Telur', category: 'noodles', price: 12000, description: 'Indomie goreng/kuah dilengkapi telur mata sapi atau setengah matang.', image: ASSETS.cafeSpread, available: true, stock: 65, isPopular: true },
  { id: 'm-4', name: 'Indomie Telur Sosis', category: 'noodles', price: 15000, description: 'Indomie komplit dengan telur gurih dan sosis panggang empuk.', image: ASSETS.cafeSpread, available: true, stock: 50 },
  { id: 'm-5', name: 'Mie Ayam', category: 'noodles', price: 14000, description: 'Mie ayam kenyal dengan potongan daging ayam semur manis gurih dan sawi.', image: ASSETS.cafeSpread, available: true, stock: 40 },
  { id: 'm-6', name: 'Mie Ayam Bakso', category: 'noodles', price: 17000, description: 'Mie ayam lezat ditambah bakso sapi kenyal dan kuah kaldu segar.', image: ASSETS.cafeSpread, available: true, stock: 45, isPopular: true },

  // Rice meals
  { id: 'm-7', name: 'Nasi Ayam Geprek', category: 'rice', price: 18000, description: 'Ayam krispi renyah digeprek dengan sambal bawang pedas nampol dan nasi hangat.', image: ASSETS.cafeSpread, available: true, stock: 60, isPopular: true },
  { id: 'm-8', name: 'Nasi Ayam Penyet', category: 'rice', price: 19000, description: 'Ayam goreng bumbu rempah dipenyet dengan sambal terasi gurih dan lalapan.', image: ASSETS.cafeSpread, available: true, stock: 35 },
  { id: 'm-9', name: 'Nasi Goreng Kosfee', category: 'rice', price: 16000, description: 'Nasi goreng harum khas kedai dengan suwiran ayam, telur, dan kerupuk.', image: ASSETS.cafeSpread, available: true, stock: 55, isPopular: true },
  { id: 'm-10', name: 'Nasi Telur Pontianak', category: 'rice', price: 12000, description: 'Nasi putih pulen dengan telur ceplok krispi disiram kecap asin bawang.', image: ASSETS.cafeSpread, available: true, stock: 50 },
  { id: 'm-11', name: 'Nasi Ayam Teriyaki', category: 'rice', price: 22000, description: 'Potongan ayam empuk dengan saus teriyaki manis gurih dan wijen sangrai.', image: ASSETS.cafeSpread, available: true, stock: 30 },
  { id: 'm-12', name: 'Nasi Chicken Katsu', category: 'rice', price: 21000, description: 'Ayam katsu berlapis tepung roti keemasan dengan saus BBQ/Mayones.', image: ASSETS.cafeSpread, available: true, stock: 35 },
  { id: 'm-13', name: 'Nasi Lele Krispi', category: 'rice', price: 16000, description: 'Ikan lele goreng renyah garing dengan sambal tomat dan lalapan segar.', image: ASSETS.cafeSpread, available: true, stock: 25 },
  { id: 'm-14', name: 'Soto dengan Nasi', category: 'rice', price: 18000, description: 'Soto ayam kuah bening segar berempah disajikan bersama nasi putih.', image: ASSETS.cafeSpread, available: true, stock: 30 },
  { id: 'm-15', name: 'Bakso Sapi Spesial', category: 'rice', price: 15000, description: 'Semangkuk bakso urat dan halus dengan kuah kaldu sapi pekat.', image: ASSETS.cafeSpread, available: true, stock: 40 },

  // Snacks
  { id: 'm-16', name: 'Seblak Komplit', category: 'snacks', price: 15000, description: 'Seblak kuah kencur pedas beraroma khas dengan kerupuk, makaroni, dan sosis.', image: ASSETS.cafeSpread, available: true, stock: 40, isPopular: true },
  { id: 'm-17', name: 'Kentang Goreng (French Fries)', category: 'snacks', price: 13000, description: 'Kentang goreng renyah garing dengan taburan sea salt atau bumbu jagung bakar.', image: ASSETS.cafeSpread, available: true, stock: 50 },
  { id: 'm-18', name: 'Roti Bakar Cokelat Keju', category: 'snacks', price: 14000, description: 'Roti panggang mentega dengan lumeran cokelat manis dan parutan keju gurih.', image: ASSETS.cafeSpread, available: true, stock: 45 },
  { id: 'm-19', name: 'Pisang Goreng Wijen', category: 'snacks', price: 12000, description: 'Pisang kepok manis digoreng tepung renyah beraroma wijen wangi.', image: ASSETS.cafeSpread, available: true, stock: 35 },
  { id: 'm-20', name: 'Cireng Bumbu Rujak', category: 'snacks', price: 11000, description: 'Camilan aci renyah kenyal dicocol dengan sambal rujak gula merah asam pedas.', image: ASSETS.cafeSpread, available: true, stock: 45 },
  { id: 'm-21', name: 'Risol Mayo Gurih', category: 'snacks', price: 10000, description: 'Risol kulit krispi isi daging asap, telur, dan creamy mayones lembut.', image: ASSETS.cafeSpread, available: true, stock: 30 },
  { id: 'm-22', name: 'Tahu Crispy', category: 'snacks', price: 10000, description: 'Tahu kopong goreng renyah dengan cocolan sambal kecap pedas.', image: ASSETS.cafeSpread, available: true, stock: 50 },
  { id: 'm-23', name: 'Tempe Mendoan (4 pcs)', category: 'snacks', price: 12000, description: 'Tempe daun lembut goreng setengah matang khas Banyumas dengan cabe rawit.', image: ASSETS.cafeSpread, available: true, stock: 40 },
  { id: 'm-24', name: 'Aneka Gorengan Platter', category: 'snacks', price: 15000, description: 'Kombinasi bakwan sayur, tahu isi, dan tempe goreng hangat.', image: ASSETS.cafeSpread, available: true, stock: 35 },

  // Desserts
  { id: 'm-25', name: 'Donat Gula Halus (2 pcs)', category: 'desserts', price: 10000, description: 'Donat kentang empuk klasik dengan taburan gula salju manis lembut.', image: ASSETS.cafeSpread, available: true, stock: 30 },
  { id: 'm-26', name: 'Fudge Brownies Slice', category: 'desserts', price: 14000, description: 'Kue cokelat pekat bertekstur legit dengan lapisan atas berkilau.', image: ASSETS.cafeSpread, available: true, stock: 25 },
  { id: 'm-27', name: 'Puding Cokelat Vla', category: 'desserts', price: 10000, description: 'Puding lembut silky dengan siraman vla vanila dingin menyegarkan.', image: ASSETS.cafeSpread, available: true, stock: 30 },
  { id: 'm-28', name: 'Roti Cokelat Klasik', category: 'desserts', price: 8000, description: 'Roti lembut isi pasta cokelat meleleh.', image: ASSETS.cafeSpread, available: true, stock: 40 },
  { id: 'm-29', name: 'Es Krim Sundae', category: 'desserts', price: 12000, description: 'Scoop es krim vanila / cokelat dengan topping saus cokelat dan taburan kacang.', image: ASSETS.cafeSpread, available: true, stock: 25 },

  // Coffee
  { id: 'm-30', name: 'Kopi Hitam Tubruk', category: 'coffee', price: 7000, description: 'Kopi robusta Jawa diproses tubruk aroma harum mantap.', image: ASSETS.cafeSpread, available: true, stock: 90 },
  { id: 'm-31', name: 'Americano (Iced/Hot)', category: 'coffee', price: 12000, description: 'Espresso double shot segar dipadukan dengan air dingin atau hangat.', image: ASSETS.cafeSpread, available: true, stock: 80 },
  { id: 'm-32', name: 'Espresso Single Shot', category: 'coffee', price: 9000, description: 'Ekstraksi kopi murni dengan crema emas tebal.', image: ASSETS.cafeSpread, available: true, stock: 90 },
  { id: 'm-33', name: 'Cappuccino Foamy', category: 'coffee', price: 15000, description: 'Perpaduan seimbang espresso, susu segar kukus, dan busa susu tebal.', image: ASSETS.cafeSpread, available: true, stock: 70 },
  { id: 'm-34', name: 'Café Latte Creamy', category: 'coffee', price: 15000, description: 'Espresso berpadu lembut dengan susu sapi segar hangat/dingin.', image: ASSETS.cafeSpread, available: true, stock: 75 },
  { id: 'm-35', name: 'Es Kopi Susu Gula Aren', category: 'coffee', price: 14000, description: 'Signature KosfeeKu! Espresso nikmat, susu creamy, dan manis legit gula aren murni.', image: ASSETS.cafeSpread, available: true, stock: 120, isPopular: true },
  { id: 'm-36', name: 'Caramel Macchiato Latte', category: 'coffee', price: 17000, description: 'Kopi susu beraroma sirup karamel bakar manis gurih.', image: ASSETS.cafeSpread, available: true, stock: 65 },

  // Tea
  { id: 'm-37', name: 'Es Teh Manis', category: 'tea', price: 5000, description: 'Teh melati Jawa diseduh segar dengan es batu melimpah.', image: ASSETS.cafeSpread, available: true, stock: 150, isPopular: true },
  { id: 'm-38', name: 'Teh Hangat', category: 'tea', price: 4000, description: 'Teh wangi hangat penenang suasana.', image: ASSETS.cafeSpread, available: true, stock: 120 },
  { id: 'm-39', name: 'Lemon Tea Segar', category: 'tea', price: 8000, description: 'Perasan jeruk lemon asli berpadu dengan teh segar asam manis.', image: ASSETS.cafeSpread, available: true, stock: 80 },
  { id: 'm-40', name: 'Lychee Tea with Fruit', category: 'tea', price: 12000, description: 'Teh harum leci dilengkapi buah leci utuh manis.', image: ASSETS.cafeSpread, available: true, stock: 60, isPopular: true },
  { id: 'm-41', name: 'Milk Tea Manis', category: 'tea', price: 10000, description: 'Teh hitam diseduh creamy dengan susu manis.', image: ASSETS.cafeSpread, available: true, stock: 70 },
  { id: 'm-42', name: 'Teh Tarik Aceh Asli', category: 'tea', price: 12000, description: 'Teh tarik berbusa lembut khas Nusantara beraroma rempah ringan.', image: ASSETS.cafeSpread, available: true, stock: 50 },

  // Non-coffee
  { id: 'm-43', name: 'Matcha Latte', category: 'non_coffee', price: 16000, description: 'Bubuk green tea matcha premium dipadu susu segar dingin/hangat.', image: ASSETS.cafeSpread, available: true, stock: 60, isPopular: true },
  { id: 'm-44', name: 'Cokelat Panas Klasik', category: 'non_coffee', price: 13000, description: 'Cokelat pekat diseduh susu hangat berbusa.', image: ASSETS.cafeSpread, available: true, stock: 60 },
  { id: 'm-45', name: 'Es Cokelat Segar', category: 'non_coffee', price: 13000, description: 'Cokelat manis gurih disajikan dingin menyegarkan tenggorokan.', image: ASSETS.cafeSpread, available: true, stock: 80 },
  { id: 'm-46', name: 'Taro Milk Creamy', category: 'non_coffee', price: 14000, description: 'Minuman rasa talas ungu manis lembut dengan susu kental manis.', image: ASSETS.cafeSpread, available: true, stock: 50 },
  { id: 'm-47', name: 'Red Velvet Latte', category: 'non_coffee', price: 15000, description: 'Minuman red velvet gurih manis seperti kue red velvet dingin.', image: ASSETS.cafeSpread, available: true, stock: 45 },
  { id: 'm-48', name: 'Strawberry Milk', category: 'non_coffee', price: 14000, description: 'Susu segar dipadu selai stroberi manis segar dengan rasa buah alami.', image: ASSETS.cafeSpread, available: true, stock: 55 },
  { id: 'm-49', name: 'Es Jeruk Peras', category: 'non_coffee', price: 7000, description: 'Jeruk peras murni kaya vitamin C dengan es batu.', image: ASSETS.cafeSpread, available: true, stock: 100 },
  { id: 'm-50', name: 'Jeruk Hangat', category: 'non_coffee', price: 6000, description: 'Jeruk peras diseduh air hangat penyejuk badan.', image: ASSETS.cafeSpread, available: true, stock: 80 },
  { id: 'm-51', name: 'Susu Jahe Hangat', category: 'non_coffee', price: 10000, description: 'Susu hangat berpadu jahe bakar aromatik hangat di tenggorokan.', image: ASSETS.cafeSpread, available: true, stock: 50 },
  { id: 'm-52', name: 'Air Mineral 600ml', category: 'non_coffee', price: 4000, description: 'Air mineral kemasan dingin atau netral.', image: ASSETS.cafeSpread, available: true, stock: 200 },
];

// Seed Coworking Resources
const initialCoworkingResources: CoworkingResource[] = [
  {
    id: 'res-hotdesk',
    name: 'Hot Desk Community Area',
    type: 'hot_desk',
    capacity: 1,
    hourlyRate: 10000,
    dailyRate: 45000,
    amenities: ['Wi-Fi 150 Mbps', 'Stopkontak Meja', 'Free Flow Infused Water', 'Diskon Café 10%'],
    description: 'Meja kerja santai di area utama berdekatan dengan suasana café yang dinamis.',
    isAvailable: true,
  },
  {
    id: 'res-quietpod',
    name: 'Quiet Study Pod Focus',
    type: 'study_pod',
    capacity: 1,
    hourlyRate: 15000,
    dailyRate: 60000,
    amenities: ['Area Hening Kedap Suara', 'Kursi Ergonomis Mesh', 'Lampu Baca LED', 'Wi-Fi Prioritas'],
    description: 'Bilik belajar semi-privat yang dirancang khusus untuk fokus ujian atau koding mandiri.',
    isAvailable: true,
  },
  {
    id: 'res-dedicated',
    name: 'Dedicated Oak Workstation',
    type: 'dedicated_desk',
    capacity: 1,
    hourlyRate: 20000,
    dailyRate: 75000,
    amenities: ['Loker Kunci Pribadi', 'Monitor 24 Inch HDMI', 'Kursi Ergonomis', 'Free Kopi Hitam / Teh'],
    description: 'Meja kayu kokoh dengan layar monitor eksternal, ideal untuk remote worker harian.',
    isAvailable: true,
  },
  {
    id: 'res-meeting',
    name: 'Meeting Room Kolaborasi (Up to 6 pax)',
    type: 'meeting_room',
    capacity: 6,
    hourlyRate: 65000,
    dailyRate: 280000,
    amenities: ['Smart TV 50" Presentasi', 'Whiteboard & Spidol', 'AC Privat', 'Colokan Rapat', 'Suasana Kedap Suara'],
    description: 'Ruang rapat ber-AC privat untuk diskusi kelompok, bimbingan tugas akhir, atau presentasi tim.',
    isAvailable: true,
  },
];

// Seed Coupons
const initialCoupons: Coupon[] = [
  {
    code: 'KOSFEEHEMAT',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 25000,
    applicableCategory: 'cafe',
    expiresAt: '2026-12-31T23:59:59Z',
    active: true,
    description: 'Diskon 15% untuk semua menu café KosfeeKu (Min. belanja Rp25.000).',
  },
  {
    code: 'KOSTBARU100',
    discountType: 'fixed',
    discountValue: 100000,
    minPurchase: 1000000,
    applicableCategory: 'rent',
    expiresAt: '2026-12-31T23:59:59Z',
    active: true,
    description: 'Potongan Rp100.000 untuk pembayaran sewa kost bulan pertama.',
  },
  {
    code: 'KERJANYAMAN',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 30000,
    applicableCategory: 'coworking',
    expiresAt: '2026-12-31T23:59:59Z',
    active: true,
    description: 'Diskon 20% reservasi ruang kerja co-working KosfeeKu.',
  },
];

// Seed Business Settings
const initialSettings: BusinessSettings = {
  businessName: 'KosfeeKu',
  taglineId: 'Kost Nyaman, Ngopi Gampang.',
  taglineEn: 'Comfortable Living, Coffee Made Easy.',
  phone: '+62 812-3456-7890',
  whatsapp: '+62 812-3456-7890',
  email: 'halo@kosfeeku.com',
  address: 'Jl. Boulevard Kampus No. 42, Sleman, D.I. Yogyakarta 55281',
  cafeHours: 'Setiap Hari: 07:00 - 23:00 WIB',
  coworkingHours: 'Setiap Hari: 08:00 - 22:00 WIB',
  kostTerms: 'Sewa minimum 1 bulan. Jam malam tamu luar pukul 22:00. Dilarang merokok di dalam kamar AC.',
  bankName: 'BCA (Bank Central Asia)',
  bankAccountNumber: '8910-234-5678',
  bankAccountHolder: 'PT KOSFEEKU BERDIKARI SEJAHTERA',
  qrisMerchantName: 'KOSFEEKU SLEMAN HUB',
  qrisNmid: 'ID102026042890',
};

// LocalStorage Database Keys
const DB_KEYS = {
  CATEGORIES: 'kosfeeku_db_categories',
  ROOMS: 'kosfeeku_db_rooms',
  BOOKINGS: 'kosfeeku_db_bookings',
  CONTRACTS: 'kosfeeku_db_contracts',
  INVOICES: 'kosfeeku_db_invoices',
  MENU: 'kosfeeku_db_menu',
  ORDERS: 'kosfeeku_db_orders',
  RESOURCES: 'kosfeeku_db_resources',
  RESERVATIONS: 'kosfeeku_db_reservations',
  PAYMENTS: 'kosfeeku_db_payments',
  COUPONS: 'kosfeeku_db_coupons',
  COMPLAINTS: 'kosfeeku_db_complaints',
  NOTIFICATIONS: 'kosfeeku_db_notifications',
  AUDIT_LOGS: 'kosfeeku_db_audit_logs',
  SETTINGS: 'kosfeeku_db_settings',
  LOYALTY: 'kosfeeku_db_loyalty',
  STAFF: 'kosfeeku_db_staff',
};

// Helper to safely load or initialize storage
function loadOrSeed<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error loading DB table ${key}:`, e);
    return seed;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save DB table ${key}:`, e);
  }
}

export class DatabaseService {
  // Initialization
  static init() {
    loadOrSeed(DB_KEYS.CATEGORIES, initialCategories);
    loadOrSeed(DB_KEYS.ROOMS, initialRooms);
    loadOrSeed(DB_KEYS.MENU, initialMenuItems);
    loadOrSeed(DB_KEYS.RESOURCES, initialCoworkingResources);
    loadOrSeed(DB_KEYS.COUPONS, initialCoupons);
    loadOrSeed(DB_KEYS.SETTINGS, initialSettings);
    
    // Seed sample active contract & rent invoice for demo tenant
    const existingInvoices = loadOrSeed<RentInvoice[]>(DB_KEYS.INVOICES, []);
    if (existingInvoices.length === 0) {
      const demoInvoice: RentInvoice = {
        id: 'inv-2026-001',
        invoiceNumber: 'INV/KF/2026/10/001',
        contractId: 'cnt-demo-01',
        roomId: 'room-102',
        roomNumber: 'A-102',
        tenantId: 'tenant-demo',
        tenantName: 'Budi Santoso',
        periodMonth: 'Oktober 2026',
        amount: 1000000,
        dueDate: '2026-11-05',
        status: 'unpaid',
        createdAt: '2026-10-25T08:00:00Z',
      };
      save(DB_KEYS.INVOICES, [demoInvoice]);
    }

    // Seed sample audit log
    const existingLogs = loadOrSeed<AuditLog[]>(DB_KEYS.AUDIT_LOGS, []);
    if (existingLogs.length === 0) {
      this.logAudit('sys-01', 'System Boot', 'owner', 'SYSTEM_INITIALIZED', 'Database', 'Initial tables & seed inventory loaded');
    }
  }

  // --- AUDIT LOGS ---
  static getAuditLogs(): AuditLog[] {
    return loadOrSeed<AuditLog[]>(DB_KEYS.AUDIT_LOGS, []);
  }

  static logAudit(actorId: string, actorName: string, actorRole: any, action: string, target: string, details: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId,
      actorName,
      actorRole,
      action,
      target,
      details,
      timestamp: new Date().toISOString(),
    };
    save(DB_KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 199)]);
  }

  // --- NOTIFICATIONS ---
  static getNotifications(userId?: string): AppNotification[] {
    const all = loadOrSeed<AppNotification[]>(DB_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        userId: 'all',
        title: 'Selamat Datang di KosfeeKu!',
        message: 'Nikmati kemudahan sewa kost, café santai, dan ruang kerja co-working dalam satu platform.',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      }
    ]);
    if (!userId) return all;
    return all.filter(n => n.userId === 'all' || n.userId === userId);
  }

  static addNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info', link?: string) {
    const list = loadOrSeed<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    save(DB_KEYS.NOTIFICATIONS, [newNotif, ...list]);
  }

  static markNotificationRead(id: string) {
    const list = loadOrSeed<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    save(DB_KEYS.NOTIFICATIONS, updated);
  }

  // --- ROOMS & CATEGORIES ---
  static getCategories(): RoomCategory[] {
    return loadOrSeed<RoomCategory[]>(DB_KEYS.CATEGORIES, initialCategories);
  }

  static getRooms(): Room[] {
    return loadOrSeed<Room[]>(DB_KEYS.ROOMS, initialRooms);
  }

  static getRoomById(id: string): Room | undefined {
    return this.getRooms().find(r => r.id === id);
  }

  static saveRoom(room: Room): void {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.id === room.id);
    if (index >= 0) {
      rooms[index] = room;
    } else {
      rooms.push(room);
    }
    save(DB_KEYS.ROOMS, rooms);
  }

  // --- BOOKINGS & CONTRACTS ---
  static getBookings(): RoomBooking[] {
    return loadOrSeed<RoomBooking[]>(DB_KEYS.BOOKINGS, []);
  }

  static createBookingRequest(data: Omit<RoomBooking, 'id' | 'bookingCode' | 'status' | 'createdAt'>): { success: boolean; message?: string; booking?: RoomBooking } {
    const room = this.getRoomById(data.roomId);
    if (!room) return { success: false, message: 'Kamar tidak ditemukan.' };
    if (room.status !== 'available') return { success: false, message: 'Kamar saat ini tidak tersedia untuk dipesan.' };

    const bookings = this.getBookings();
    // Check concurrent pending or approved bookings for this room
    const hasActiveBooking = bookings.some(b => b.roomId === data.roomId && (b.status === 'pending' || b.status === 'approved' || b.status === 'active'));
    if (hasActiveBooking) {
      return { success: false, message: 'Sudah ada pengajuan aktif untuk kamar ini.' };
    }

    const bookingCode = `KB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: RoomBooking = {
      ...data,
      id: `book-${Date.now()}`,
      bookingCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    save(DB_KEYS.BOOKINGS, [newBooking, ...bookings]);

    this.addNotification('owner', 'Pengajuan Sewa Baru', `Calon penghuni ${data.tenantName} mengajukan sewa kamar ${room.roomNumber} (${data.durationMonths} bulan).`, 'info');
    this.logAudit(data.tenantId, data.tenantName, 'tenant', 'BOOKING_SUBMITTED', room.roomNumber, `Durasi: ${data.durationMonths} bulan. Total: Rp${data.totalFirstPayment}`);

    return { success: true, booking: newBooking };
  }

  static reviewBooking(bookingId: string, approved: boolean, reviewerId: string, reviewerName: string): boolean {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    booking.status = approved ? 'approved' : 'rejected';
    booking.reviewedAt = new Date().toISOString();
    booking.reviewedBy = reviewerName;
    save(DB_KEYS.BOOKINGS, bookings);

    const room = this.getRoomById(booking.roomId);

    if (approved && room) {
      // Update room status
      room.status = 'occupied';
      room.currentTenantId = booking.tenantId;
      room.currentTenantName = booking.tenantName;
      this.saveRoom(room);

      // Create Rental Contract
      const contractNumber = `CNT/KF/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
      const startDate = booking.startDate;
      const end = new Date(startDate);
      end.setMonth(end.getMonth() + booking.durationMonths);
      const endDate = end.toISOString().split('T')[0];

      const contract: RentalContract = {
        id: `cnt-${Date.now()}`,
        contractNumber,
        bookingId: booking.id,
        roomId: room.id,
        roomNumber: room.roomNumber,
        tenantId: booking.tenantId,
        tenantName: booking.tenantName,
        startDate,
        endDate,
        monthlyRent: booking.monthlyPrice,
        depositAmount: booking.depositAmount,
        status: 'active',
        terms: 'Sewa mengikat sesuai peraturan KosfeeKu. Pembayaran tagihan paling lambat tanggal 5 setiap bulannya.',
        createdAt: new Date().toISOString(),
      };
      const contracts = loadOrSeed<RentalContract[]>(DB_KEYS.CONTRACTS, []);
      save(DB_KEYS.CONTRACTS, [contract, ...contracts]);

      // Create First Rent Invoice
      const invoiceNumber = `INV/KF/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;
      const invoice: RentInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber,
        contractId: contract.id,
        roomId: room.id,
        roomNumber: room.roomNumber,
        tenantId: booking.tenantId,
        tenantName: booking.tenantName,
        periodMonth: `Bulan ke-1 (${startDate})`,
        amount: booking.monthlyPrice,
        depositAmount: booking.depositAmount,
        dueDate: startDate,
        status: 'unpaid',
        createdAt: new Date().toISOString(),
      };
      const invoices = loadOrSeed<RentInvoice[]>(DB_KEYS.INVOICES, []);
      save(DB_KEYS.INVOICES, [invoice, ...invoices]);

      this.addNotification(booking.tenantId, 'Pengajuan Sewa Disetujui!', `Permintaan sewa kamar ${room.roomNumber} telah disetujui. Tagihan sewa dan kontrak telah diterbitkan di dashboard Anda.`, 'success');
      this.logAudit(reviewerId, reviewerName, 'owner', 'BOOKING_APPROVED', booking.bookingCode, `Kontrak ${contractNumber} & Invoice ${invoiceNumber} diterbitkan.`);
    } else {
      this.addNotification(booking.tenantId, 'Pengajuan Sewa Belum Dapat Disetujui', `Mohon maaf, permintaan sewa kamar ${booking.roomNumber} ditolak. Silakan hubungi pengelola.`, 'alert');
      this.logAudit(reviewerId, reviewerName, 'owner', 'BOOKING_REJECTED', booking.bookingCode, 'Pengajuan ditolak oleh pengelola.');
    }

    return true;
  }

  // --- INVOICES & PAYMENTS ---
  static getInvoices(tenantId?: string): RentInvoice[] {
    const list = loadOrSeed<RentInvoice[]>(DB_KEYS.INVOICES, []);
    if (!tenantId) return list;
    return list.filter(i => i.tenantId === tenantId);
  }

  static getPayments(): PaymentRecord[] {
    return loadOrSeed<PaymentRecord[]>(DB_KEYS.PAYMENTS, []);
  }

  static submitPayment(record: Omit<PaymentRecord, 'id' | 'transactionRef' | 'status' | 'createdAt'>): PaymentRecord {
    const payments = this.getPayments();
    const transactionRef = `TRX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentRecord = {
      ...record,
      id: `pay-${Date.now()}`,
      transactionRef,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    save(DB_KEYS.PAYMENTS, [newPayment, ...payments]);

    // Update target invoice / order status to pending_verification
    if (record.category === 'rent') {
      const invoices = this.getInvoices();
      const inv = invoices.find(i => i.id === record.referenceId);
      if (inv) {
        inv.status = 'pending_verification';
        inv.paymentMethod = record.paymentMethod;
        inv.paymentReference = transactionRef;
        save(DB_KEYS.INVOICES, invoices);
      }
    }

    this.addNotification('owner', 'Pembayaran Baru Masuk', `Pembayaran ${record.description} sebesar Rp${record.amount.toLocaleString('id-ID')} via ${record.paymentMethod.toUpperCase()} menunggu konfirmasi staff.`, 'info');
    return newPayment;
  }

  static verifyPayment(paymentId: string, verified: boolean, reviewerId: string, reviewerName: string): boolean {
    const payments = this.getPayments();
    const p = payments.find(pay => pay.id === paymentId);
    if (!p) return false;

    p.status = verified ? 'verified' : 'failed';
    p.verifiedAt = new Date().toISOString();
    p.verifiedBy = reviewerName;
    save(DB_KEYS.PAYMENTS, payments);

    if (p.category === 'rent') {
      const invoices = this.getInvoices();
      const inv = invoices.find(i => i.id === p.referenceId);
      if (inv) {
        inv.status = verified ? 'paid' : 'unpaid';
        inv.paidAt = verified ? new Date().toISOString() : undefined;
        save(DB_KEYS.INVOICES, invoices);

        this.addNotification(inv.tenantId, verified ? 'Tagihan Sewa Lunas' : 'Pembayaran Sewa Ditolak', verified ? `Pembayaran invoice ${inv.invoiceNumber} sebesar Rp${p.amount.toLocaleString('id-ID')} telah diverifikasi lunas.` : `Pembayaran ${inv.invoiceNumber} belum dapat diverifikasi. Silakan hubungi staff.`, verified ? 'success' : 'alert');
      }
    } else if (p.category === 'cafe') {
      const orders = this.getCafeOrders();
      const ord = orders.find(o => o.id === p.referenceId);
      if (ord) {
        ord.paymentStatus = verified ? 'verified' : 'failed';
        if (verified && ord.orderStatus === 'pending') {
          ord.orderStatus = 'confirmed';
        }
        ord.updatedAt = new Date().toISOString();
        save(DB_KEYS.ORDERS, orders);
      }
    } else if (p.category === 'coworking') {
      const reservations = this.getCoworkingReservations();
      const res = reservations.find(r => r.id === p.referenceId);
      if (res) {
        res.paymentStatus = verified ? 'verified' : 'pending';
        save(DB_KEYS.RESERVATIONS, reservations);
      }
    }

    this.logAudit(reviewerId, reviewerName, 'owner', verified ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED', p.transactionRef, `Jumlah: Rp${p.amount} (${p.category})`);
    return true;
  }

  // --- CAFÉ MODULE ---
  static getMenuItems(): MenuItem[] {
    return loadOrSeed<MenuItem[]>(DB_KEYS.MENU, initialMenuItems);
  }

  static saveMenuItem(item: MenuItem): void {
    const menu = this.getMenuItems();
    const index = menu.findIndex(m => m.id === item.id);
    if (index >= 0) {
      menu[index] = item;
    } else {
      menu.push(item);
    }
    save(DB_KEYS.MENU, menu);
  }

  static getCafeOrders(customerId?: string): CafeOrder[] {
    const list = loadOrSeed<CafeOrder[]>(DB_KEYS.ORDERS, []);
    if (!customerId) return list;
    return list.filter(o => o.customerId === customerId);
  }

  static createCafeOrder(data: Omit<CafeOrder, 'id' | 'orderCode' | 'paymentStatus' | 'orderStatus' | 'createdAt' | 'updatedAt'>): CafeOrder {
    const orders = this.getCafeOrders();
    const orderCode = `KF-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CafeOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      orderCode,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    save(DB_KEYS.ORDERS, [newOrder, ...orders]);

    // Create payment record
    this.submitPayment({
      category: 'cafe',
      referenceId: newOrder.id,
      description: `Pesanan Café #${orderCode} (${data.deliveryType})`,
      amount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      payerName: data.customerName,
    });

    // Deduct stock safely
    const menu = this.getMenuItems();
    data.items.forEach(it => {
      const target = menu.find(m => m.id === it.menuItemId);
      if (target) {
        target.stock = Math.max(0, target.stock - it.quantity);
        if (target.stock === 0) target.available = false;
      }
    });
    save(DB_KEYS.MENU, menu);

    this.addNotification('owner', 'Pesanan Café Baru', `Pesanan #${orderCode} sebesar Rp${data.totalAmount.toLocaleString('id-ID')} masuk dari ${data.customerName}.`, 'info');
    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: any, staffName: string): boolean {
    const orders = this.getCafeOrders();
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return false;

    ord.orderStatus = status;
    ord.updatedAt = new Date().toISOString();
    ord.verifiedBy = staffName;
    save(DB_KEYS.ORDERS, orders);

    if (ord.customerId) {
      this.addNotification(ord.customerId, 'Status Pesanan Café Diperbarui', `Pesanan #${ord.orderCode} sekarang: ${status.toUpperCase()}.`, 'info');
    }
    return true;
  }

  // --- CO-WORKING ---
  static getCoworkingResources(): CoworkingResource[] {
    return loadOrSeed<CoworkingResource[]>(DB_KEYS.RESOURCES, initialCoworkingResources);
  }

  static getCoworkingReservations(userId?: string): CoworkingReservation[] {
    const list = loadOrSeed<CoworkingReservation[]>(DB_KEYS.RESERVATIONS, []);
    if (!userId) return list;
    return list.filter(r => r.userId === userId);
  }

  static createCoworkingReservation(data: Omit<CoworkingReservation, 'id' | 'reservationCode' | 'paymentStatus' | 'status' | 'createdAt'>): { success: boolean; message?: string; reservation?: CoworkingReservation } {
    const reservations = this.getCoworkingReservations();

    // Check overlap on the same date and resource
    const existing = reservations.filter(r => r.resourceId === data.resourceId && r.date === data.date && r.status !== 'cancelled');
    const newStartHour = parseInt(data.startTime.split(':')[0], 10);
    const newEndHour = newStartHour + data.durationHours;

    const overlap = existing.some(ex => {
      const exStart = parseInt(ex.startTime.split(':')[0], 10);
      const exEnd = exStart + ex.durationHours;
      return (newStartHour < exEnd && newEndHour > exStart);
    });

    if (overlap) {
      return { success: false, message: 'Waktu yang dipilih bertabrakan dengan reservasi lain yang sudah ada.' };
    }

    const reservationCode = `CW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRes: CoworkingReservation = {
      ...data,
      id: `cw-${Date.now()}`,
      reservationCode,
      paymentStatus: 'pending',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    save(DB_KEYS.RESERVATIONS, [newRes, ...reservations]);

    // Create payment record
    this.submitPayment({
      category: 'coworking',
      referenceId: newRes.id,
      description: `Reservasi Co-working #${reservationCode} (${data.resourceName})`,
      amount: data.totalPrice,
      paymentMethod: data.paymentMethod,
      payerName: data.userName,
    });

    this.addNotification('owner', 'Reservasi Co-working Baru', `Reservasi #${reservationCode} untuk ${data.resourceName} pada ${data.date} (${data.startTime}, ${data.durationHours} jam).`, 'info');
    return { success: true, reservation: newRes };
  }

  // --- COUPONS ---
  static getCoupons(): Coupon[] {
    return loadOrSeed<Coupon[]>(DB_KEYS.COUPONS, initialCoupons);
  }

  static validateCoupon(code: string, subtotal: number, category: string): { valid: boolean; discountAmount: number; message?: string } {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!coupon) return { valid: false, discountAmount: 0, message: 'Kode kupon tidak valid atau sudah kedaluwarsa.' };

    if (coupon.applicableCategory !== 'all' && coupon.applicableCategory !== category) {
      return { valid: false, discountAmount: 0, message: `Kupon ini hanya berlaku untuk kategori ${coupon.applicableCategory}.` };
    }

    if (subtotal < coupon.minPurchase) {
      return { valid: false, discountAmount: 0, message: `Minimal belanja untuk menggunakan kupon ini adalah Rp${coupon.minPurchase.toLocaleString('id-ID')}.` };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, discountAmount: Math.min(discount, subtotal) };
  }

  // --- LOYALTY ---
  static getLoyalty(userId: string): LoyaltyAccount {
    const accounts = loadOrSeed<Record<string, LoyaltyAccount>>(DB_KEYS.LOYALTY, {
      'tenant-demo': { userId: 'tenant-demo', points: 150, tier: 'Gold', totalEarned: 250 },
    });
    if (!accounts[userId]) {
      accounts[userId] = { userId, points: 50, tier: 'Silver', totalEarned: 50 };
      save(DB_KEYS.LOYALTY, accounts);
    }
    return accounts[userId];
  }

  // --- MAINTENANCE & TICKETS ---
  static getMaintenanceTickets(tenantId?: string): MaintenanceTicket[] {
    const list = loadOrSeed<MaintenanceTicket[]>(DB_KEYS.COMPLAINTS, [
      {
        id: 'tkt-01',
        ticketNumber: 'TKT-2026-001',
        tenantId: 'tenant-demo',
        tenantName: 'Budi Santoso',
        roomNumber: 'A-102',
        category: 'ac_electrical',
        description: 'Lampu bohlam dekat meja belajar agak berkedip saat dinyalakan.',
        priority: 'medium',
        status: 'in_progress',
        assignedStaff: 'Pak Yono (Teknisi)',
        createdAt: '2026-10-27T09:30:00Z',
      }
    ]);
    if (!tenantId) return list;
    return list.filter(t => t.tenantId === tenantId);
  }

  static createMaintenanceTicket(data: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'status' | 'createdAt'>): MaintenanceTicket {
    const tickets = this.getMaintenanceTickets();
    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: MaintenanceTicket = {
      ...data,
      id: `tkt-${Date.now()}`,
      ticketNumber,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    save(DB_KEYS.COMPLAINTS, [newTicket, ...tickets]);

    this.addNotification('owner', 'Tiket Kerusakan Baru', `Penghuni kamar ${data.roomNumber} (${data.tenantName}) melaporkan kendala: ${data.category}.`, 'warning');
    return newTicket;
  }

  static updateTicketStatus(id: string, status: any, resolutionNotes?: string, cost?: number): boolean {
    const tickets = this.getMaintenanceTickets();
    const t = tickets.find(ticket => ticket.id === id);
    if (!t) return false;

    t.status = status;
    if (resolutionNotes) t.resolutionNotes = resolutionNotes;
    if (cost !== undefined) t.cost = cost;
    if (status === 'resolved' || status === 'closed') {
      t.resolvedAt = new Date().toISOString();
    }
    save(DB_KEYS.COMPLAINTS, tickets);

    this.addNotification(t.tenantId, 'Laporan Perbaikan Diperbarui', `Laporan ${t.ticketNumber} untuk kamar ${t.roomNumber} telah diupdate ke status: ${status}.`, 'info');
    return true;
  }

  // --- SETTINGS ---
  static getSettings(): BusinessSettings {
    return loadOrSeed<BusinessSettings>(DB_KEYS.SETTINGS, initialSettings);
  }

  static saveSettings(settings: BusinessSettings): void {
    save(DB_KEYS.SETTINGS, settings);
  }
}

// Auto init
DatabaseService.init();
