# AVASAR (अवसर) – KABADIWALA-CONNECT

> **AI-Powered E-Waste Management & Hyper-Local Recycling Mobile Application Prototype**
> Connecting Informal Scrap Collectors (Kabadiwalas) with Authorised E-Waste Recyclers.

---

## 🌟 Executive Summary

**AVASAR (अवसर)** is a mobile-first, offline-ready progressive web application engineered to bridge India's informal waste economy with the authorized circular supply chain. Built for collectors with varying digital literacy levels, it features:
1. **AI E-Waste Diagnostic Scanner** with camera capture, realistic simulated classification, and transparent formula estimation.
2. **Scrap Value Estimator** with configurable benchmark rates.
3. **Authorised Recycler Matching** featuring OpenStreetMap telemetry, distance and rate sorting, and doorstep fleet tracking.
4. **Digital Waste Passport** with a verifiable 6-stage custody timeline and printable receipt dockets.
5. **Recycler Management Portal** to confirm gate weighbridge readings and disburse payments.
6. **Bilingual English/Hindi & Web Speech Audio Guidance** for inclusive accessibility.
7. **Offline-First Resilience** with local persistence across device reloads.

---

## 🛠️ Technology Stack

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS v4, Lucide React icons
- **Maps**: OpenStreetMap integration
- **Voice / Speech**: Web Speech API (`SpeechSynthesis`) in Hindi & English
- **Data Persistence**: Offline-First via browser `LocalStorage`
- **Build & Quality**: Strict TypeScript types (`verbatimModuleSyntax` compliant, 0 compiler warnings, 0 unused variable lints)

---

## 🚀 Quick Setup & Execution

### Prerequisites
- Node.js 18+ (tested on v24.18.0)
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser (or use responsive mobile device emulation in Chrome DevTools).

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔄 The Complete 13-Step Demonstration Workflow

Follow this verified end-to-end flow to evaluate the prototype:

1. **Step 1: Open the Application**: The app loads in **Collector (कबाड़ीवाला)** role by default with Forest Green theme (`#176B45`) on an off-white canvas.
2. **Step 2: Enter Dashboard**: Observe the live metrics (Total Waste Handed Over, Estimated Earnings, Completed Handovers). Notice bilingual toggles (EN / हिन्दी) and Voice Guide (`Audio Guide`) button in the header.
3. **Step 3: Scan Scrap E-Waste**: Click **Scan E-Waste** from quick actions or bottom navigation.
4. **Step 4: AI Identification**: Select a sample preset (e.g. *Telecom Server Motherboard PCB*, *Li-ion Battery*, *Copper Cables*) or upload a custom photo. The optical diagnostic reticle runs the simulated classification and displays prediction confidence.
5. **Step 5: Weight & Valuation**: Enter or adjust the weight (e.g. `5.0 kg`). The app computes:
   $$\text{Estimated Value} = \text{Weight (kg)} \times \text{Indicative Rate (₹/kg)}$$
6. **Step 6: Browse Recyclers**: Click **Generate Waste Passport & Select Recycler**.
7. **Step 7: Compare & Select**: Filter by accepted waste stream or sort by highest rate. Click **Hand Over to this Recycler** on *EcoRev Green Metallurgy Ltd.*
8. **Step 8: Waste Passport Generated**: A unique Passport ID (e.g. `AVS-2026-8491`) is created with a 6-stage custody timeline and print receipt button.
9. **Step 9: Switch to Recycler Role**: Click the top user badge or open **Profile → Switch Role** and select **Authorised Recycler**.
10. **Step 10: Locate Handover & Confirm**: Open the **Handovers** tab on the Recycler Dashboard. Locate the newly created lot and click **Confirm Receipt & Weight**.
11. **Step 11: Record Payment**: Click **Record Payment**, choose payment mode (`UPI / Cash / Bank Transfer`), and confirm. The status updates from `REQUESTED → CONFIRMED → PAID`.
12. **Step 12: Return to Collector Portal**: Switch back to **Collector** role. Verify that the lot now reflects as `SETTLED & PAID` and wallet earnings have updated.
13. **Step 13: Offline Persistence Test**: Refresh the browser page (`F5`). All records, updated payment statuses, and benchmark rates persist intact via local storage.

---

## 🏷️ Transparency & Ethical Disclaimers

- **Simulated AI Classification**: The optical computer vision scanner is an educational demonstration module simulating classification without claiming a real paid cloud vision API is active.
- **Fictional Recyclers**: All recycler facilities shown (EcoRev, Shree Balaji, Apex) are fictional demo entities created for evaluation.
- **Non-Blockchain Ledger**: The Waste Passport is a digital custody docket and receipt system, not a speculative blockchain token.
- **Configurable Benchmark Rates**: Sample rates (PCB: ₹100/kg, Cables: ₹80/kg, Batteries: ₹60/kg) can be adjusted via the **Admin Benchmark Config** tab in Profile settings.

---

## 🌿 Safety & Circularity Impact

The application includes high-priority safety warnings:
- ❌ **Never burn electrical wires**: Burning PVC releases carcinogenic dioxin fumes; use mechanical cable strippers instead.
- ❌ **Never crush swollen batteries**: Avoid thermal fires and acid burns; isolate with vermiculite sand.
- ✅ **Verifiable Impact Tracker**: Real-time counter aggregating kilograms diverted and informal sector earnings directly from actual stored records.
