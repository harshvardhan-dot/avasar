export type Language = 'en' | 'hi';

export type UserRole = 'citizen' | 'collector' | 'recycler' | 'ulb' | 'admin';

export type WasteCategory =
  | 'PCB'
  | 'BATTERIES'
  | 'CABLES'
  | 'CRT'
  | 'PHONES'
  | 'LAPTOPS'
  | 'OTHER';

export type HandoverStatus = 'REQUESTED' | 'HANDED_OVER' | 'CONFIRMED' | 'REJECTED';
export type PaymentStatus = 'PENDING' | 'PAID';

export interface MaterialPriceConfig {
  id: WasteCategory;
  nameEn: string;
  nameHi: string;
  defaultRatePerKg: number; // in INR ₹
  descriptionEn: string;
  descriptionHi: string;
  safetyHazard: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RecyclerFacility {
  id: string;
  name: string;
  isVerified: boolean;
  isFictionalDemo: boolean;
  address: string;
  city: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  acceptedCategories: WasteCategory[];
  indicativeRatePerKg: number;
  pickupAvailable: boolean;
  phone: string;
  email: string;
  operatingHours: string;
  rating: number;
}

export interface WastePassportRecord {
  passportId: string; // e.g. AVS-2026-0001
  category: WasteCategory;
  materialName: string;
  confidenceScore: number; // 0 - 100 (simulated/vision)
  photoUrl: string;
  weightKg: number;
  ratePerKg: number;
  estimatedValue: number;
  collectorName: string;
  collectorPhone: string;
  recyclerId: string;
  recyclerName: string;
  pickupRequested: boolean;
  notes?: string;
  gpsCoords?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  handoverStatus: HandoverStatus;
  paymentStatus: PaymentStatus;
  paymentMode?: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  paymentDate?: string;
  paidAmount?: number;
  synced: boolean; // For offline-first demo
}

export interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
