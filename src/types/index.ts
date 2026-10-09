export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'citizen' | 'kabadi' | 'recycler' | 'ulb';

export type ActiveTab = 
  | 'home' 
  | 'scanner' 
  | 'routing' 
  | 'passport' 
  | 'advisor' 
  | 'dashboards';

export interface DiagnosticPreset {
  id: string;
  name: string;
  materialCategory: string;
  subType: string;
  image: string;
  opticalSummary: string;
  segmentationBBoxes: Array<{
    x: number; // %
    y: number; // %
    w: number; // %
    h: number; // %
    label: string;
    conf: number;
  }>;
  polymerAlloy: string;
  resinCode: string;
  purityScore: number; // 0-100
  contaminationScore: number; // 0-100
  hazardLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'CRITICAL';
  hazardNotes: string;
  estimatedWeightKg: number;
  grossMarketRatePerKg: number; // in INR ₹
  grossValue: number;
  logisticsDeduction: number;
  preProcessingDeduction: number;
  netYieldPayout: number;
  carbonOffsetKg: number;
  recommendedTreatment: string;
}

export interface RecyclerFacilityMatch {
  id: string;
  name: string;
  facilityType: string;
  location: string;
  distanceKm: number;
  grossOfferPerKg: number;
  grossBatchTotal: number;
  transportCost: number;
  handlingCost: number;
  netPayout: number;
  purityMatchPercent: number;
  carbonOffsetAvoidedKg: number;
  turnaroundHours: number;
  isAiRecommended: boolean;
  recoveryTech: string;
  rationale: string;
  certifications: string[];
}

export interface WastePassportStage {
  step: number;
  title: string;
  timestamp: string;
  location: string;
  actor: string;
  badge: string;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'SCHEDULED';
  details: string;
  verifiedWeightKg?: number;
  signatureHash?: string;
}

export interface WasteBatchPassport {
  batchId: string;
  qrPayload: string;
  producerType: string;
  materialType: string;
  grade: 'Prime A+' | 'Industrial A' | 'Secondary B' | 'Mixed C';
  certifiedWeightKg: number;
  sha256Hash: string;
  co2OffsetKg: number;
  stages: WastePassportStage[];
  complianceStandard: string;
  issuedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citations?: string[];
  recommendedAction?: string;
}

export interface PickupJob {
  id: string;
  citizenName: string;
  address: string;
  ward: string;
  timeSlot: string;
  estimatedWeight: string;
  materials: string[];
  estPayout: number;
  status: 'ASSIGNED' | 'EN_ROUTE' | 'VERIFYING' | 'COMPLETED';
  otpCode: string;
}

export interface WardMetric {
  wardName: string;
  tonnageDiverted: number;
  informalCollectorsRegistered: number;
  eprComplianceRate: number;
  segregationScore: number;
}

export interface MunicipalNotice {
  id: string;
  title: string;
  targetAudience: 'ALL' | 'KABADIWALA' | 'RECYCLER';
  priority: 'NORMAL' | 'URGENT' | 'POLICY';
  content: string;
  publishedAt: string;
  publishedBy: string;
  badge: string;
}

export interface RegisteredKabadiwala {
  id: string;
  name: string;
  phone: string;
  ward: string;
  status: 'FORMALIZED' | 'PENDING_VERIFICATION';
  vehicleType: string;
  totalCollectedKg: number;
  eShramNumber: string;
  ayushmanCoverActive: boolean;
  avatarUrl: string;
}

export interface RegisteredRecycler {
  id: string;
  companyName: string;
  facilityLocation: string;
  cpcbRegNumber: string;
  status: 'ACTIVE_AUTHORIZED' | 'AUDIT_PENDING';
  capacityUtilization: string;
  authorizedCategories: string[];
  contactPerson: string;
  phone: string;
}
