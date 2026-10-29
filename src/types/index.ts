export type UserRole = 'owner' | 'staff' | 'tenant';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  emergencyContact?: string;
  idNumber?: string; // KTP / Passport
  createdAt: string;
}

export type StaffPermission = 'manage_rooms' | 'manage_cafe' | 'manage_coworking' | 'verify_payments' | 'manage_maintenance';

export interface StaffMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  roleTitle: string;
  permissions: StaffPermission[];
  createdAt: string;
}

// KOST / ROOMS
export type BathroomType = 'private' | 'shared';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface RoomCategory {
  id: string;
  name: string;
  description: string;
  areaSqm: number;
  basePricePerMonth: number;
  bathroomType: BathroomType;
  maxOccupancy: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  categoryId: string;
  categoryName: string;
  areaSqm: number;
  monthlyPrice: number; // minimum Rp1,000,000
  facilities: string[];
  bathroomType: BathroomType;
  maxOccupancy: number;
  status: RoomStatus;
  description: string;
  images: string[];
  floor: number;
  currentTenantId?: string;
  currentTenantName?: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';

export interface RoomBooking {
  id: string;
  bookingCode: string;
  roomId: string;
  roomNumber: string;
  roomCategory: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  startDate: string;
  durationMonths: number;
  monthlyPrice: number;
  depositAmount: number;
  totalFirstPayment: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface RentalContract {
  id: string;
  contractNumber: string;
  bookingId: string;
  roomId: string;
  roomNumber: string;
  tenantId: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  status: 'active' | 'expiring_soon' | 'terminated' | 'completed';
  terms: string;
  createdAt: string;
}

export type InvoiceStatus = 'unpaid' | 'pending_verification' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'qris';

export interface RentInvoice {
  id: string;
  invoiceNumber: string;
  contractId: string;
  roomId: string;
  roomNumber: string;
  tenantId: string;
  tenantName: string;
  periodMonth: string; // e.g. "November 2026"
  amount: number;
  depositAmount?: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  createdAt: string;
}

// CAFE
export type FoodCategory = 'noodles' | 'rice' | 'snacks' | 'desserts' | 'coffee' | 'tea' | 'non_coffee';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type DeliveryType = 'dine_in' | 'takeaway' | 'room_delivery';

export interface MenuItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  description: string;
  image: string;
  available: boolean;
  stock: number;
  isPopular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface CafeOrder {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  tableNumber?: string;
  roomNumber?: string; // for room delivery
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'failed';
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  verifiedBy?: string;
}

// CO-WORKING
export type ResourceType = 'hot_desk' | 'dedicated_desk' | 'meeting_room' | 'study_pod';
export type ReservationStatus = 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface CoworkingResource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  hourlyRate: number;
  dailyRate: number;
  amenities: string[];
  description: string;
  isAvailable: boolean;
}

export interface CoworkingReservation {
  id: string;
  reservationCode: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  durationHours: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified';
  status: ReservationStatus;
  createdAt: string;
}

// PAYMENTS & PROMOTIONS
export interface PaymentRecord {
  id: string;
  transactionRef: string;
  category: 'rent' | 'cafe' | 'coworking';
  referenceId: string; // invoiceId, orderId, reservationId
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'verified' | 'failed' | 'refunded';
  evidenceNote?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  payerName: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  applicableCategory: 'all' | 'cafe' | 'coworking' | 'rent';
  expiresAt: string;
  active: boolean;
  description: string;
}

export interface LoyaltyAccount {
  userId: string;
  points: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  totalEarned: number;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  pointsCost: number;
  category: 'cafe' | 'coworking' | 'discount';
  description: string;
}

// COMPLAINTS & MAINTENANCE
export type ComplaintStatus = 'submitted' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintCategory = 'ac_electrical' | 'plumbing_water' | 'cleanliness' | 'furniture' | 'internet' | 'other';

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  category: ComplaintCategory;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: ComplaintStatus;
  assignedStaff?: string;
  resolutionNotes?: string;
  cost?: number;
  createdAt: string;
  resolvedAt?: string;
}

// NOTIFICATIONS & AUDIT
export interface AppNotification {
  id: string;
  userId: string; // or 'all' or 'owner'
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  details: string;
  ip?: string;
  timestamp: string;
}

export interface BusinessSettings {
  businessName: string;
  taglineId: string;
  taglineEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  cafeHours: string;
  coworkingHours: string;
  kostTerms: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  qrisMerchantName: string;
  qrisNmid: string;
}
