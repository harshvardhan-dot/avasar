import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Users,
  Factory,
  BellRing,
  Send,
  Phone,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WARD_METRICS } from '../data/mockData';
import confetti from 'canvas-confetti';

export const MunicipalULBDashboardView: React.FC = () => {
  const { 
    notices, 
    publishNotice, 
    registeredKabadiwalas, 
    registeredRecyclersList,
    speakText 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'WARDFEED' | 'KABADIWALAS' | 'RECYCLERS' | 'NOTICES'>('WARDFEED');
  
  // Notice creation form state
  const [noticeTitle, setNoticeTitle] = useState<string>('');
  const [noticeAudience, setNoticeAudience] = useState<'ALL' | 'KABADIWALA' | 'RECYCLER'>('ALL');
  const [noticePriority, setNoticePriority] = useState<'NORMAL' | 'URGENT' | 'POLICY'>('POLICY');
  const [noticeContent, setNoticeContent] = useState<string>('');
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  // Search filter
  const [entitySearch, setEntitySearch] = useState<string>('');

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    publishNotice({
      title: noticeTitle.trim(),
      targetAudience: noticeAudience,
      priority: noticePriority,
      content: noticeContent.trim(),
      publishedBy: 'Brihanmumbai Municipal Corporation (BMC) Solid Waste Dept.',
      badge: noticePriority === 'URGENT' ? 'CRITICAL ORDER' : noticePriority === 'POLICY' ? 'MANDATORY POLICY' : 'PUBLIC ADVISORY'
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    speakText(
      `Official Municipal Gazette notice "${noticeTitle}" published to all ${noticeAudience} stakeholders successfully.`,
      `नगर निगम सूचना "${noticeTitle}" सफलतापूर्वक प्रकाशित की गई।`
    );

    setPublishSuccess(true);
    setNoticeTitle('');
    setNoticeContent('');
    setTimeout(() => setPublishSuccess(false), 3500);
  };

  const filteredKabadiwalas = registeredKabadiwalas.filter(k => 
    k.name.toLowerCase().includes(entitySearch.toLowerCase()) ||
    k.ward.toLowerCase().includes(entitySearch.toLowerCase()) ||
    k.id.toLowerCase().includes(entitySearch.toLowerCase())
  );

  const filteredRecyclers = registeredRecyclersList.filter(r => 
    r.companyName.toLowerCase().includes(entitySearch.toLowerCase()) ||
    r.facilityLocation.toLowerCase().includes(entitySearch.toLowerCase()) ||
    r.cpcbRegNumber.toLowerCase().includes(entitySearch.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-lg border border-blue-800/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono bg-white/20 px-2.5 py-0.5 rounded-full text-blue-100 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            URBAN LOCAL BODY (ULB) & MUNICIPAL GOVERNANCE
          </span>
          <span className="text-[11px] font-mono text-blue-200 bg-black/20 px-2.5 py-0.5 rounded-full">
            BMC Ward Cell · Zone 4
          </span>
        </div>
        <h3 className="text-xl font-black tracking-tight text-white">
          Brihanmumbai Municipal Corporation (BMC) Urban Cell
        </h3>
        <p className="text-xs text-blue-100/90 leading-relaxed max-w-xl">
          Ward-level diversion heatmaps, formal collector identity ledger, CPCB authorized recycling plants, and municipal regulatory notice broadcast desk.
        </p>
      </div>

      {/* 4 Key ULB Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Total Diverted
          </span>
          <span className="text-2xl font-black text-[#176B45] block tabular-nums">319.4 T</span>
          <span className="text-[10px] text-emerald-700 block font-semibold">Diverted from Deonar / Mulund</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            Circular Recovery
          </span>
          <span className="text-2xl font-black text-stone-900 block tabular-nums">91.8%</span>
          <span className="text-[10px] text-stone-500 block">Processed vs Landfilled ratio</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            Formalized Kabadis
          </span>
          <span className="text-2xl font-black text-blue-900 block tabular-nums">{registeredKabadiwalas.length * 166 + 2}</span>
          <span className="text-[10px] text-blue-700 block font-semibold">Ayushman & E-Shram Linked</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            CPCB EPR Target
          </span>
          <span className="text-2xl font-black text-emerald-700 block tabular-nums">93.4%</span>
          <span className="text-[10px] text-stone-500 block">Audited Legal Compliance</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs for ULB Portal */}
      <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab('WARDFEED')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'WARDFEED'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Ward Performance</span>
        </button>

        <button
          onClick={() => setActiveTab('KABADIWALAS')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'KABADIWALAS'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Registered Kabadiwalas ({registeredKabadiwalas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RECYCLERS')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'RECYCLERS'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Factory className="w-3.5 h-3.5" />
          <span>Authorized Recyclers ({registeredRecyclersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTICES')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'NOTICES'
              ? 'bg-white text-blue-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>Publish Notice ({notices.length})</span>
        </button>
      </div>

      {/* TAB 1: Ward Performance Heatmap */}
      {activeTab === 'WARDFEED' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Ward-Level Diversion Performance Heatmap
              </h4>
              <p className="text-xs text-stone-500">
                Zonal breakdown of segregation compliance, informal inclusion, and landfill diversion.
              </p>
            </div>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
              BMC LIVE TELEMETRY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {WARD_METRICS.map((ward, wIdx) => (
              <div key={wIdx} className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {ward.wardName}
                  </span>
                  <span className="text-xs font-bold text-[#176B45]">
                    {ward.segregationScore}% Segregation
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                    <span className="text-[9px] text-stone-400 block font-mono">Diverted</span>
                    <span className="font-bold text-stone-900">{ward.tonnageDiverted} T</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                    <span className="text-[9px] text-stone-400 block font-mono">Kabadis</span>
                    <span className="font-bold text-stone-900">{ward.informalCollectorsRegistered}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                    <span className="text-[9px] text-stone-400 block font-mono">EPR Rate</span>
                    <span className="font-bold text-emerald-700">{ward.eprComplianceRate}%</span>
                  </div>
                </div>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#176B45] h-full rounded-full transition-all"
                    style={{ width: `${ward.segregationScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Registered Kabadiwalas Directory */}
      {activeTab === 'KABADIWALAS' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Registered & Formalized Kabadiwalas Directory
              </h4>
              <p className="text-xs text-stone-500">
                Informal waste collectors integrated into the formal municipal supply chain with E-Shram and health coverage.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search by name, ward, ID..."
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden w-full sm:w-56"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredKabadiwalas.map((kabadi) => (
              <div key={kabadi.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={kabadi.avatarUrl}
                      alt={kabadi.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">{kabadi.name}</h5>
                      <span className="text-[10px] font-mono text-[#176B45] font-bold block">{kabadi.id}</span>
                      <span className="text-[11px] text-stone-500 block">{kabadi.ward}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    kabadi.status === 'FORMALIZED' 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {kabadi.status === 'FORMALIZED' ? '✓ CPCB FORMALIZED' : 'VERIFICATION PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-200/60">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono">Vehicle Assigned:</span>
                    <span className="font-semibold text-stone-800 text-[11px]">{kabadi.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono">Total Diverted:</span>
                    <span className="font-bold text-[#176B45] tabular-nums text-[11px]">{kabadi.totalCollectedKg.toFixed(1)} kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 font-mono text-[10px]">E-Shram: {kabadi.eShramNumber}</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{kabadi.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Authorized Recyclers Directory */}
      {activeTab === 'RECYCLERS' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                CPCB & MPCB Authorized Recycling Facilities
              </h4>
              <p className="text-xs text-stone-500">
                State pollution control board audited recycling plants with authorized smelting and hydrometallurgy licenses.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search company, location, CPCB ID..."
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden w-full sm:w-56"
            />
          </div>

          <div className="space-y-3">
            {filteredRecyclers.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-stone-900">{rec.companyName}</h5>
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.2 rounded font-semibold">
                        {rec.id}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {rec.facilityLocation}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 font-semibold block mt-0.5">
                      Registration: {rec.cpcbRegNumber}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      rec.status === 'ACTIVE_AUTHORIZED' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {rec.status === 'ACTIVE_AUTHORIZED' ? '✓ CPCB AUDITED & ACTIVE' : 'ANNUAL AUDIT PENDING'}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-1 font-mono">
                      Utilization: <strong>{rec.capacityUtilization}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200/60">
                  <span className="text-[10px] font-mono text-stone-400 mr-1 self-center">Authorized Streams:</span>
                  {rec.authorizedCategories.map((c, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                  <span>Contact: <strong>{rec.contactPerson}</strong></span>
                  <span className="font-mono text-emerald-800 font-bold">{rec.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Publish Notice to Kabadiwalas & Recyclers (User Requested) */}
      {activeTab === 'NOTICES' && (
        <div className="space-y-4">
          {/* Publish Notice Form */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-blue-600" />
                  <span>Publish Municipal Notice & Policy Directive</span>
                </h4>
                <p className="text-xs text-stone-500">
                  Broadcast regulatory orders, price ceilings, CPCB calibration dates, and subsidies to Kabadiwalas and Recyclers.
                </p>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                DIRECT GAZETTE PUSH
              </span>
            </div>

            {publishSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Notice published successfully! Broadcasted across all stakeholder dashboards in real time.</span>
              </div>
            )}

            <form onSubmit={handlePublishNotice} className="space-y-3.5">
              {/* Notice Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Notice Directive Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mandatory Calibration of Bluetooth Scales in Ward K-West"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Target Audience & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Target Stakeholder Audience:
                  </label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:outline-hidden"
                  >
                    <option value="ALL">All Stakeholders (Kabadiwalas + Recyclers)</option>
                    <option value="KABADIWALA">Kabadiwalas / Micro-Collectors Only</option>
                    <option value="RECYCLER">Authorized Recycler Hubs Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Directive Urgency Level:
                  </label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:outline-hidden"
                  >
                    <option value="POLICY">Mandatory Policy Circular</option>
                    <option value="URGENT">Urgent Warning / Legal Alert</option>
                    <option value="NORMAL">Standard Green Advisory / Subsidy Notice</option>
                  </select>
                </div>
              </div>

              {/* Content text */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Official Directive Order & Instructions:
                </label>
                <textarea
                  rows={3}
                  placeholder="State the guidelines, penal consequences, inspection dates, or subsidy claim procedures clearly..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-blue-200" />
                <span>Broadcast Notice to {noticeAudience} Now</span>
              </button>
            </form>
          </div>

          {/* Published Notices Feed */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Active Municipal Gazettes & Notices ({notices.length})</span>
            </h4>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          n.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : n.priority === 'POLICY'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          {n.badge}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500 font-bold">
                          {n.id}
                        </span>
                        <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded">
                          AUDIENCE: {n.targetAudience}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-stone-900 pt-0.5">{n.title}</h5>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0">{n.publishedAt}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/70">
                    {n.content}
                  </p>

                  <div className="text-[10px] text-stone-400 flex items-center justify-between">
                    <span>Issued by: <strong>{n.publishedBy}</strong></span>
                    <span className="text-[#176B45] font-semibold">✓ Distributed to registered field mobile terminals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
