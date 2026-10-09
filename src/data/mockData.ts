import type { 
  DiagnosticPreset, 
  RecyclerFacilityMatch, 
  WasteBatchPassport, 
  PickupJob, 
  WardMetric,
  MunicipalNotice,
  RegisteredKabadiwala,
  RegisteredRecycler
} from '../types';

export const DIAGNOSTIC_PRESETS: DiagnosticPreset[] = [
  {
    id: 'hdpe-bottles',
    name: 'Rigid HDPE Industrial Canisters & Flakes',
    materialCategory: 'Post-Consumer Polyolefins',
    subType: 'High-Density Polyethylene (Blow Molding Grade)',
    image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
    opticalSummary: 'Identified semi-rigid opaque resin bodies with characteristic circular mold gates and minimal label adhesive fouling.',
    segmentationBBoxes: [
      { x: 12, y: 18, w: 38, h: 62, label: 'HDPE Container (Resin #2)', conf: 0.982 },
      { x: 54, y: 24, w: 36, h: 52, label: 'PP Threaded Closure', conf: 0.941 },
      { x: 20, y: 72, w: 22, h: 16, label: 'Minor Paper Label Residual', conf: 0.892 }
    ],
    polymerAlloy: 'HDPE (PE-HD 02) / Fractional Melt Index',
    resinCode: '#2 HDPE (High-Density Polyethylene)',
    purityScore: 94.6,
    contaminationScore: 5.4,
    hazardLevel: 'NONE',
    hazardNotes: 'Clean cosmetic/food-grade wash residue. No chlorinated solvent or petrochemical pesticide detected.',
    estimatedWeightKg: 42.5,
    grossMarketRatePerKg: 38.0, // ₹38/kg
    grossValue: 1615.0,
    logisticsDeduction: 180.0,
    preProcessingDeduction: 125.0,
    netYieldPayout: 1310.0,
    carbonOffsetKg: 63.75, // ~1.5kg CO2e per kg HDPE
    recommendedTreatment: 'Mechanical Granulation & Hot Alkaline Wash → PCR Pellet Extrusion'
  },
  {
    id: 'li-ion-battery',
    name: 'Industrial Li-Ion NMC Prismatic Cells',
    materialCategory: 'E-Waste / Critical Energy Transition Minerals',
    subType: 'Lithium Nickel Manganese Cobalt Oxide (NMC 811)',
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    opticalSummary: 'Detected metallic casing with slight pouch expansion (3.2mm delta). Terminal busbars intact with protective mylar film.',
    segmentationBBoxes: [
      { x: 18, y: 15, w: 64, h: 68, label: 'Li-Ion NMC Cell Core', conf: 0.991 },
      { x: 42, y: 6, w: 20, h: 12, label: 'Copper / Nickel Terminals', conf: 0.963 },
      { x: 14, y: 65, w: 24, h: 18, label: 'Electrolyte Degradation Warning', conf: 0.915 }
    ],
    polymerAlloy: 'Black Mass Precursor: 18% Co, 6% Li, 24% Ni, 12% Mn',
    resinCode: 'UN 3480 Class 9 Dangerous Goods',
    purityScore: 89.2,
    contaminationScore: 10.8,
    hazardLevel: 'CRITICAL',
    hazardNotes: 'Hazardous dielectric breakdown risk. Mild cell swelling detected. Must be stored in dry vermiculite fire-dampening drum.',
    estimatedWeightKg: 18.0,
    grossMarketRatePerKg: 240.0, // High value black mass precursors
    grossValue: 4320.0,
    logisticsDeduction: 450.0, // Hazmat specialized handling
    preProcessingDeduction: 320.0,
    netYieldPayout: 3550.0,
    carbonOffsetKg: 91.8, // ~5.1kg CO2e per kg avoided vs primary mining
    recommendedTreatment: 'Inert Atmosphere Shredding & Hydrometallurgical Leach for Black Mass Recovery'
  },
  {
    id: 'pcb-telecom',
    name: 'High-Grade Telecom Motherboards & Server PCBs',
    materialCategory: 'High-Grade Electronic Scrap',
    subType: 'FR-4 Multi-Layer Gold Fingered Circuit Boards',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    opticalSummary: 'Dual socket processor arrays, intact gold-plated edge fingers, ceramic capacitors, and tantalum SMD components visible.',
    segmentationBBoxes: [
      { x: 8, y: 10, w: 42, h: 44, label: 'BGA Chipsets / Precious Metals', conf: 0.978 },
      { x: 55, y: 16, w: 38, h: 56, label: 'Copper Circuit Traces / FR4', conf: 0.964 },
      { x: 22, y: 62, w: 60, h: 28, label: 'Gold Connector Fingers', conf: 0.985 }
    ],
    polymerAlloy: 'Target Yield: 280 ppm Au, 1200 ppm Ag, 18.5% Cu',
    resinCode: 'E-Waste Category: TE-01 Centralized Network Systems',
    purityScore: 92.4,
    contaminationScore: 7.6,
    hazardLevel: 'MEDIUM',
    hazardNotes: 'Brominated flame retardants in substrate. Contains lead-tin legacy solder. Handle with nitrile gloves.',
    estimatedWeightKg: 12.5,
    grossMarketRatePerKg: 310.0, // High-grade precious metals
    grossValue: 3875.0,
    logisticsDeduction: 220.0,
    preProcessingDeduction: 280.0,
    netYieldPayout: 3375.0,
    carbonOffsetKg: 52.5,
    recommendedTreatment: 'Component Desoldering → Secondary Copper Smelting with Precious Metal Electrolysis'
  },
  {
    id: 'cardboard-bales',
    name: 'Corrugated Fluted Kraft Bales (OCC-11)',
    materialCategory: 'Cellulose Fiber Packaging',
    subType: 'Old Corrugated Containers (OCC Industrial Standard)',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    opticalSummary: 'Dense compacted fibrous matrix. Dry moisture equilibrium <12%. Minimal wax coating or moisture spoilage.',
    segmentationBBoxes: [
      { x: 10, y: 12, w: 78, h: 72, label: 'Long Fiber Kraft Fluting', conf: 0.989 },
      { x: 34, y: 44, w: 20, h: 14, label: 'Steel Baler Wire Ties', conf: 0.95 }
    ],
    polymerAlloy: 'Cellulose Unbleached Long Fibers (>72% Yield)',
    resinCode: 'P-01 Recyclable Kraft Fiber',
    purityScore: 97.2,
    contaminationScore: 2.8,
    hazardLevel: 'NONE',
    hazardNotes: 'No biological contamination or damp mildew. Keep covered during transport.',
    estimatedWeightKg: 85.0,
    grossMarketRatePerKg: 14.5,
    grossValue: 1232.5,
    logisticsDeduction: 160.0,
    preProcessingDeduction: 75.0,
    netYieldPayout: 997.5,
    carbonOffsetKg: 76.5,
    recommendedTreatment: 'Hydro-Pulper Slurrying → Fiber Screening & De-inking → Linerboard Repulping'
  }
];

export const RECYCLER_FACILITIES: RecyclerFacilityMatch[] = [
  {
    id: 'rec-alpha',
    name: 'Apex Scrap & Basic Secondary Shredder',
    facilityType: 'Local Tier-3 Mechanical Sorting Hub',
    location: 'Kurla West Industrial Estate, Mumbai',
    distanceKm: 4.8,
    grossOfferPerKg: 33.0,
    grossBatchTotal: 1402.5,
    transportCost: 95.0,
    handlingCost: 85.0,
    netPayout: 1222.5,
    purityMatchPercent: 78.5,
    carbonOffsetAvoidedKg: 42.0,
    turnaroundHours: 4,
    isAiRecommended: false,
    recoveryTech: 'Low-RPM Single Shaft Shredder & Coarse Air Classifier',
    rationale: 'Lowest transit distance and immediate 4-hour cash/UPI settlement, but lacks high-precision optical separation, resulting in lower raw feedstock valuation.',
    certifications: ['Maharashtra Pollution Control Board (MPCB) Tier-C']
  },
  {
    id: 'rec-beta',
    name: 'Ecorev Precision Metallurgy & Circular Polymer Hub',
    facilityType: 'Regional State-of-the-Art Material Recovery Facility (MRF)',
    location: 'Bhiwandi Logistic Cluster / Turbhe MIDC, Navi Mumbai',
    distanceKm: 22.4,
    grossOfferPerKg: 40.5,
    grossBatchTotal: 1721.25,
    transportCost: 165.0,
    handlingCost: 90.0,
    netPayout: 1466.25,
    purityMatchPercent: 96.2,
    carbonOffsetAvoidedKg: 68.5,
    turnaroundHours: 14,
    isAiRecommended: true,
    recoveryTech: 'NIR Optical Sorter, Sink-Float Hydrocyclone & Vacuum Degassing Extruder',
    rationale: 'Optimal net yield: Offers a +22.7% higher gross payout due to virgin-equivalent food-grade flake qualification. Offsets the moderate transport distance with 68.5kg CO₂e verified carbon credits.',
    certifications: ['CPCB Authorized Recycler', 'ISO 14001:2015', 'EuCertPlast Food-Contact Certified']
  },
  {
    id: 'rec-gamma',
    name: 'Maharshi Heavy Aggregator & Pyrolysis Yards',
    facilityType: 'Mega Industrial Commodity Yard',
    location: 'Taloja Industrial MIDC, Raigad',
    distanceKm: 44.0,
    grossOfferPerKg: 36.5,
    grossBatchTotal: 1551.25,
    transportCost: 280.0,
    handlingCost: 110.0,
    netPayout: 1161.25,
    purityMatchPercent: 84.0,
    carbonOffsetAvoidedKg: 51.0,
    turnaroundHours: 28,
    isAiRecommended: false,
    recoveryTech: 'High-Throughput Hydraulic Baling & Continuous Waste-to-Energy Pyrolysis',
    rationale: 'Accepts infinite batch volume but high freight deduction drops net payout below local alternatives for batches under 500kg.',
    certifications: ['MPCB Hazardous Waste Handling License']
  }
];

export const INITIAL_BATCH_PASSPORT: WasteBatchPassport = {
  batchId: 'AVS-2026-MUM-8921',
  qrPayload: 'https://avasar.gov.in/verify/AVS-2026-MUM-8921?cert=sha256-e82b7c',
  producerType: 'Commercial Complex & Urban Residential Cluster',
  materialType: 'High-Density Polyethylene (HDPE Blow Molding Grade)',
  grade: 'Prime A+',
  certifiedWeightKg: 42.5,
  sha256Hash: '0x8f2d91c73a4e450b719488a0e82c6d4829fa75bb193021f08cb36184a77e923e',
  co2OffsetKg: 63.75,
  complianceStandard: 'CPCB EPR Plastic Waste Management Schedule II Compliant',
  issuedAt: '2026-10-09 18:42 IST',
  stages: [
    {
      step: 1,
      title: 'Submitted by Producer',
      timestamp: '2026-10-09 09:15 IST',
      location: 'Andheri East Ward K-East, Mumbai (19.1136° N, 72.8697° E)',
      actor: 'Greenfield Residency Society (Producer ID: PROD-9902)',
      badge: 'Digitally Manifested',
      status: 'COMPLETED',
      details: 'Segregated lot marked for hyper-local micro-collector pickup via AVASAR portal.',
      verifiedWeightKg: 43.0,
      signatureHash: '0x1a82f...b34'
    },
    {
      step: 2,
      title: 'Micro-Collection & Quality Stamp',
      timestamp: '2026-10-09 11:30 IST',
      location: 'Ward Collection Bay 4, Andheri East',
      actor: 'Rajesh Kumar (Formalized Collector ID: KABADI-MUM-412)',
      badge: 'Biometric & OTP Validated',
      status: 'COMPLETED',
      details: 'Lot inspected on digital Bluetooth load cell scale. Digital payment of ₹1,310 disbursed via UPI.',
      verifiedWeightKg: 42.5,
      signatureHash: '0x49cd1...8ef'
    },
    {
      step: 3,
      title: 'Aggregation & Hyper-Local MRF Hub',
      timestamp: '2026-10-09 14:10 IST',
      location: 'Bandra-Kurla MRF Aggregation Facility, Zone 3',
      actor: 'AVASAR Urban Hub Operations (Dispatcher ID: AGG-882)',
      badge: 'RFID Tagged Batch',
      status: 'COMPLETED',
      details: 'Batch bundled with Lot-49B into 400kg baled container for zero-emission EV transport.',
      verifiedWeightKg: 42.5,
      signatureHash: '0x7b320...41c'
    },
    {
      step: 4,
      title: 'Arrival at Authorized Recycler',
      timestamp: '2026-10-09 16:25 IST',
      location: 'Ecorev Circularity Park, Bhiwandi Sector 4',
      actor: 'Authorized Laboratory Inspector (Tech ID: ECO-LAB-19)',
      badge: 'NIR Spectrometry Cleared',
      status: 'COMPLETED',
      details: 'Optical spectroscopy scan verified 94.6% polymer purity. Contamination under 5.5% tolerance.',
      verifiedWeightKg: 42.5,
      signatureHash: '0x9910d...6fa'
    },
    {
      step: 5,
      title: 'Mechanical Processing & Washing',
      timestamp: '2026-10-09 18:00 IST',
      location: 'Extrusion Line 3, Ecorev Facility',
      actor: 'Automated Line Controller 04',
      badge: 'Granulation Active',
      status: 'IN_TRANSIT',
      details: 'Heated alkaline wash completed; flake shredding underway at 14mm sieve opening.',
      verifiedWeightKg: 41.8,
      signatureHash: '0xa411e...912'
    },
    {
      step: 6,
      title: 'Secondary Virgin-Equivalent Feedstock',
      timestamp: 'Est. 2026-10-10 08:00 IST',
      location: 'Finished Goods Dispatch Silo 2',
      actor: 'End-Consumer Polymer Compounder',
      badge: 'EPR Certificate Generated',
      status: 'SCHEDULED',
      details: 'Repelletized PCR compound ready for injection molding into circular crates and utility conduits.',
      verifiedWeightKg: 40.2
    }
  ]
};

export const SAMPLE_PICKUP_JOBS: PickupJob[] = [
  {
    id: 'PK-981',
    citizenName: 'Aarav Mehta (Solitaire Heights)',
    address: 'Flat 402, B-Wing, Link Road, Andheri West',
    ward: 'Ward K-West',
    timeSlot: '10:30 AM - 11:15 AM',
    estimatedWeight: '38 kg',
    materials: ['HDPE Bottles', 'Cardboard OCC', 'Aluminium Cans'],
    estPayout: 1140,
    status: 'ASSIGNED',
    otpCode: '8492'
  },
  {
    id: 'PK-982',
    citizenName: 'Pooja Deshmukh (Green Acres)',
    address: 'Bungalow 12, JVPD Scheme, Juhu',
    ward: 'Ward K-West',
    timeSlot: '11:45 AM - 12:30 PM',
    estimatedWeight: '16 kg',
    materials: ['E-Waste / Telecom PCBs', 'Li-Ion Packs'],
    estPayout: 2850,
    status: 'EN_ROUTE',
    otpCode: '3190'
  },
  {
    id: 'PK-983',
    citizenName: 'TechPark Operations Hub',
    address: 'SEEPZ Special Economic Zone, Andheri East',
    ward: 'Ward K-East',
    timeSlot: '02:00 PM - 03:00 PM',
    estimatedWeight: '120 kg',
    materials: ['Rigid Plastics', 'Server Hardware'],
    estPayout: 8400,
    status: 'VERIFYING',
    otpCode: '5571'
  }
];

export const WARD_METRICS: WardMetric[] = [
  { wardName: 'Ward K-East (Andheri E / Marol)', tonnageDiverted: 84.6, informalCollectorsRegistered: 142, eprComplianceRate: 94.2, segregationScore: 88 },
  { wardName: 'Ward H-West (Bandra / Khar)', tonnageDiverted: 62.1, informalCollectorsRegistered: 98, eprComplianceRate: 98.0, segregationScore: 94 },
  { wardName: 'Ward F-North (Matunga / Sion)', tonnageDiverted: 54.3, informalCollectorsRegistered: 86, eprComplianceRate: 89.5, segregationScore: 81 },
  { wardName: 'Ward G-North (Dharavi / Mahim)', tonnageDiverted: 118.4, informalCollectorsRegistered: 340, eprComplianceRate: 91.2, segregationScore: 86 }
];

export const INITIAL_MUNICIPAL_NOTICES: MunicipalNotice[] = [
  {
    id: 'NOT-2026-081',
    title: 'Mandatory CPCB Digital Barcode & Tare Scale Calibration',
    targetAudience: 'ALL',
    priority: 'POLICY',
    content: 'All registered Kabadiwalas and authorized recycling units in Mumbai Wards K-West and K-East must calibrate digital Bluetooth loadcells before October 20, 2026 under CPCB circular 14B.',
    publishedAt: 'Today, 08:30 AM',
    publishedBy: 'BMC Solid Waste Management Cell',
    badge: 'MANDATORY COMPLIANCE'
  },
  {
    id: 'NOT-2026-079',
    title: 'Direct Subsidy for Electric Cargo 3-Wheelers (EV Retrofit)',
    targetAudience: 'KABADIWALA',
    priority: 'NORMAL',
    content: 'Subsidies up to ₹35,000 now available for formal micro-collectors transitioning from manual pull-carts to authorized electric loader trikes. Apply with E-Shram card at Ward Office.',
    publishedAt: 'Yesterday, 04:15 PM',
    publishedBy: 'Maharashtra Clean Mobility Fund',
    badge: 'GREEN SUBSIDY'
  },
  {
    id: 'NOT-2026-077',
    title: 'Strict Prohibition on Chemical Acid Washing of Circuit Boards',
    targetAudience: 'RECYCLER',
    priority: 'URGENT',
    content: 'Unscientific acid burning of PCBs in non-registered sheds attracts immediate license revocation and penal fines under E-Waste Rules 2022. Only hydrometallurgical closed-loop recovery permitted.',
    publishedAt: '08 Oct 2026',
    publishedBy: 'Maharashtra Pollution Control Board (MPCB)',
    badge: 'LEGAL WARNING'
  }
];

export const INITIAL_REGISTERED_KABADIWALAS: RegisteredKabadiwala[] = [
  {
    id: 'KAB-MUM-412',
    name: 'Rajesh Kumar (राजेश कुमार)',
    phone: '+91 98200 11223',
    ward: 'Ward K-West (Andheri West)',
    status: 'FORMALIZED',
    vehicleType: 'Electric Cargo Trike (EV #14)',
    totalCollectedKg: 4280.5,
    eShramNumber: 'ESH-9844-1290-7712',
    ayushmanCoverActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'KAB-MUM-519',
    name: 'Suresh Patil (सुरेश पाटिल)',
    phone: '+91 98199 44102',
    ward: 'Ward K-East (Marol & MIDC)',
    status: 'FORMALIZED',
    vehicleType: 'Covered Motor Trike (#09)',
    totalCollectedKg: 6120.0,
    eShramNumber: 'ESH-4412-9901-3341',
    ayushmanCoverActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'KAB-MUM-603',
    name: 'Mohammed Salim (मोहम्मद सलीम)',
    phone: '+91 97680 91823',
    ward: 'Ward G-North (Dharavi Scrap Market)',
    status: 'FORMALIZED',
    vehicleType: 'Electric Loader 3W (#22)',
    totalCollectedKg: 8940.2,
    eShramNumber: 'ESH-3120-7741-8890',
    ayushmanCoverActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'KAB-MUM-724',
    name: 'Dinesh Chauhan (दिनेश चौहान)',
    phone: '+91 99302 77154',
    ward: 'Ward H-West (Bandra / Khar)',
    status: 'PENDING_VERIFICATION',
    vehicleType: 'Manual Cart (EV Transition Pending)',
    totalCollectedKg: 1840.0,
    eShramNumber: 'ESH-1120-9941-0021',
    ayushmanCoverActive: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_REGISTERED_RECYCLERS: RegisteredRecycler[] = [
  {
    id: 'REC-001',
    companyName: 'EcoRev Green Metallurgy Ltd.',
    facilityLocation: 'Plot 42, Turbhe MIDC, Navi Mumbai',
    cpcbRegNumber: 'CPCB/EW-REG/MH/2024/0081',
    status: 'ACTIVE_AUTHORIZED',
    capacityUtilization: '78.4% (18.8 / 24 T/Day)',
    authorizedCategories: ['PCB', 'BATTERIES', 'PHONES', 'LAPTOPS'],
    contactPerson: 'Dr. Anand Joshi (Plant Head)',
    phone: '+91 98201 44550'
  },
  {
    id: 'REC-002',
    companyName: 'Shree Balaji E-Waste Circular Hub',
    facilityLocation: 'Sector 8, Rabale MIDC, Thane Belapur Rd',
    cpcbRegNumber: 'CPCB/EW-REG/MH/2023/0049',
    status: 'ACTIVE_AUTHORIZED',
    capacityUtilization: '64.0% (9.6 / 15 T/Day)',
    authorizedCategories: ['CABLES', 'CRT', 'OTHER'],
    contactPerson: 'Kailash Mehra (Operations Director)',
    phone: '+91 98190 22334'
  },
  {
    id: 'REC-003',
    companyName: 'Apex Circular Precious Refiners',
    facilityLocation: 'Kurla Industrial Estate, Kurla West',
    cpcbRegNumber: 'CPCB/EW-REG/MH/2025/0112',
    status: 'ACTIVE_AUTHORIZED',
    capacityUtilization: '89.2% (13.4 / 15 T/Day)',
    authorizedCategories: ['PCB', 'PHONES', 'LAPTOPS'],
    contactPerson: 'Meera Deshmukh (Compliance Head)',
    phone: '+91 98199 55620'
  },
  {
    id: 'REC-004',
    companyName: 'Maharashtra Clean Recovery Aggregators',
    facilityLocation: 'Bhiwandi Logistics Hub, Thane',
    cpcbRegNumber: 'CPCB/EW-REG/MH/2022/0019',
    status: 'AUDIT_PENDING',
    capacityUtilization: '45.0% (9.0 / 20 T/Day)',
    authorizedCategories: ['CRT', 'OTHER', 'CABLES'],
    contactPerson: 'Vikas Jadhav',
    phone: '+91 97654 33210'
  }
];
