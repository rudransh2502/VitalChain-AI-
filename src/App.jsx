import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse, Thermometer, Droplets, ShieldAlert, ShieldCheck,
  Link2, X, CheckCircle2, Syringe, FlaskConical, Pill, Package,
  Activity, Wifi, WifiOff, Clock, Search, Truck, MapPin,
  BarChart2, History, Settings, ChevronRight, ChevronLeft,
  Box, AlertTriangle, CheckCheck, LocateFixed, Menu,
} from "lucide-react";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
);

const PRODUCTS = [
  { name: "COVID-19 Vaccine", Icon: Syringe },
  { name: "Insulin Vials",    Icon: FlaskConical },
  { name: "Blood Plasma",     Icon: Activity },
  { name: "Epinephrine",      Icon: Pill },
  { name: "Antibiotic IV",    Icon: Package },
];

let _rowCounter = 1000;
function createRow({ temperature, humidity, risk, blockchainHash, timestamp }) {
  const p = PRODUCTS[_rowCounter % PRODUCTS.length];
  return {
    id:          `VC-${++_rowCounter}`,
    productName: p.name,
    ProductIcon: p.Icon,
    temperature,
    humidity,
    risk:        risk           ?? "Low",
    hash:        blockchainHash ?? "--",
    timestamp:   timestamp      ?? "--",
  };
}

function truncateHash(h = "") {
  if (!h || h === "--") return "--";
  return h.length > 18 ? `${h.slice(0, 10)}…${h.slice(-6)}` : h;
}

const TIMELINE_STEPS = [
  { label: "Picked Up",  location: "Safdarjung Depot, Delhi",  icon: Box,         status: "done" },
  { label: "In Transit", location: "NH-24, Noida Expressway",  icon: Truck,       status: "active" },
  { label: "Delivered",  location: "DTC Campus, Sector 62",    icon: CheckCheck,  status: "pending" },
];

const SHIPMENT_DB = {};
function getShipmentTimeline(id) {
  if (!SHIPMENT_DB[id]) {
    const roll = Math.random();
    SHIPMENT_DB[id] = TIMELINE_STEPS.map((s, i) => ({
      ...s,
      status: roll > 0.6 ? (i < 2 ? "done" : "active") : (i === 0 ? "done" : i === 1 ? "active" : "pending"),
      time: `${10 + i}:${["00","30","45"][i]} AM`,
    }));
  }
  return SHIPMENT_DB[id];
}

const NAV_ITEMS = [
  { id: "dashboard",  label: "Active Shipments", icon: Activity },
  { id: "map",        label: "Live Transit Map",  icon: MapPin },
  { id: "analytics",  label: "Analytics",         icon: BarChart2 },
  { id: "history",    label: "History",            icon: History },
  { id: "settings",   label: "Settings",           icon: Settings },
];

const fadeUp   = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };
const fadeIn   = { hidden: { opacity: 0 },         show: { opacity: 1, transition: { duration: 0.3 } } };
const stagger  = { show: { transition: { staggerChildren: 0.08 } } };

  const [phase, setPhase] = useState("loading");
  const [dots,  setDots]  = useState("");

  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 380);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => { const t = setTimeout(() => setPhase("verified"), 1500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-teal-400" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <X size={16} />
          </button>

          <div className="p-8">
            {phase === "loading" ? (
              <div className="flex flex-col items-center gap-6 py-2">
                <div className="relative w-20 h-20">
                  <svg className="absolute inset-0 animate-spin" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="url(#sg)" strokeWidth="4" strokeLinecap="round" strokeDasharray="62 152" />
                    <defs>
                      <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center"><Link2 size={22} className="text-blue-600" /></div>
                </div>
                <div className="text-center">
                  <p className="text-slate-800 font-semibold text-lg">Connecting to VitalChain Ledger{dots}</p>
                  <p className="text-slate-400 text-sm mt-1">Querying distributed consensus nodes</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ animation: "vcProg 1.5s ease-in-out forwards" }} />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {["Node-7 · Geneva", "Node-12 · Singapore", "Node-3 · Ohio"].map(n => (
                    <span key={n} className="flex items-center gap-1 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />{n}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-5">
                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-slate-800 font-bold text-xl">Ledger Verified ✅</h3>
                    <p className="text-emerald-600 text-sm font-medium mt-0.5">Record integrity confirmed</p>
                  </div>
                </motion.div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <motion.div variants={stagger} className="space-y-3.5">
                  {[
                    ["Product",            row.productName],
                    ["Timestamp",          row.timestamp],
                    ["Temperature",        `${parseFloat(row.temperature).toFixed(1)} °C`],
                    ["Humidity",           `${row.humidity} % RH`],
                    ["Cryptographic Hash", <span className="font-mono text-xs text-indigo-600 break-all">{row.hash}</span>],
                    ["Record Status",      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>Immutable</span>],
                    ["Consensus",          "Byzantine Fault Tolerant (BFT)"],
                    ["Ledger Node",        "Node-7 · Geneva Cluster"],
                  ].map(([label, val]) => (
                    <motion.div key={label} variants={fadeUp} className="flex items-start justify-between gap-4">
                      <span className="text-slate-400 text-sm shrink-0 w-32 pt-0.5">{label}</span>
                      <span className="text-slate-700 text-sm font-medium text-right">{val}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.button variants={fadeUp} onClick={onClose} className="mt-1 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">
                  Close Verification
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
      <style>{`@keyframes vcProg{from{width:0}to{width:100%}}`}</style>
    </AnimatePresence>
  );
}

function ShipmentSearch() {
  const [query,    setQuery]    = useState("");
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");
  const inputRef = useRef(null);

  function handleSearch(e) {
    e.preventDefault();
    const id = query.trim().toUpperCase();
    if (!/^VC-\d+$/.test(id)) { setError("Enter a valid ID like VC-1001"); setResult(null); return; }
    setError("");
    setResult({ id, steps: getShipmentTimeline(id) });
  }

  const statusStyle = {
    done:    { ring: "bg-emerald-500", line: "bg-emerald-400", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    active:  { ring: "bg-blue-600",   line: "bg-blue-200",   text: "text-blue-600",   badge: "bg-blue-50 text-blue-700 border-blue-100"   },
    pending: { ring: "bg-slate-200",  line: "bg-slate-100",  text: "text-slate-400",  badge: "bg-slate-50 text-slate-400 border-slate-100" },
  };

  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-700 to-cyan-400" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Search size={17} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-slate-800 font-semibold text-base">Shipment Search & History</h2>
            <p className="text-slate-400 text-xs">Track any shipment by its VitalChain ID</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter shipment ID  e.g. VC-1001"
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            Track
          </button>
        </form>

        {error && <p className="mt-2.5 text-xs text-red-500 flex items-center gap-1.5"><AlertTriangle size={12}/>{error}</p>}

        <AnimatePresence>
          {result && (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={  { opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Journey — {result.id}</span>
                  <span className="text-xs font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">3 checkpoints</span>
                </div>

                {/* Vertical timeline */}
                <div className="space-y-0">
                  {result.steps.map((step, i) => {
                    const s = statusStyle[step.status];
                    const StepIcon = step.icon;
                    const isLast = i === result.steps.length - 1;
                    return (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12, duration: 0.3 }}
                        className="flex gap-4"
                      >
                        {/* Dot + connector */}
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${
                            step.status === "done"   ? "border-emerald-400 bg-emerald-50" :
                            step.status === "active" ? "border-blue-500 bg-blue-50"       :
                                                       "border-slate-200 bg-slate-50"
                          }`}>
                            <StepIcon size={16} className={s.text} />
                          </div>
                          {!isLast && <div className={`w-0.5 flex-1 my-1 rounded-full ${s.line} min-h-[28px]`} />}
                        </div>

                        {/* Content */}
                        <div className={`pb-5 flex-1 ${isLast ? "" : ""}`}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-semibold ${s.text}`}>{step.label}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badge}`}>
                              {step.status === "done" ? "Completed" : step.status === "active" ? "In Progress" : "Pending"}
                            </span>
                            <span className="text-xs text-slate-400 ml-auto">{step.time}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-slate-400 flex-shrink-0" />
                            <p className="text-xs text-slate-500">{step.location}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function LiveMapCard() {
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState("transit"); // transit | arrived | reset

  useEffect(() => {
    if (phase === "arrived") {
      const t = setTimeout(() => { setProgress(0); setPhase("transit"); }, 2200);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setPhase("arrived"); return 100; }
        return p + 0.55;
      });
    }, 40);
    return () => clearInterval(id);
  }, [phase]);

  // SVG path coords
  const PATH_X1 = 80, PATH_X2 = 560, PATH_Y = 130;
  const truckX  = PATH_X1 + ((PATH_X2 - PATH_X1) * progress) / 100;
  const arrived = phase === "arrived";

  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-teal-400 to-emerald-500" />
      <div className="p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <LocateFixed size={17} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-slate-800 font-semibold text-base">Live Transit Map</h2>
              <p className="text-slate-400 text-xs">Real-time shipment position · NH-24 corridor</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
            arrived ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${arrived ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
            {arrived ? "Delivered" : "En Route"}
          </div>
        </div>

        {/* SVG Map */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 relative">
          <svg viewBox="0 0 640 220" className="w-full" style={{ fontFamily: "inherit" }}>
            {/* Grid lines */}
            {[0,1,2,3].map(i => (
              <line key={i} x1="0" y1={50+i*45} x2="640" y2={50+i*45} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <line key={i} x1={i*106} y1="0" x2={i*106} y2="220" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Road */}
            <rect x={PATH_X1-10} y={PATH_Y-8} width={PATH_X2-PATH_X1+20} height="16" rx="8" fill="#cbd5e1" />
            <rect x={PATH_X1-8} y={PATH_Y-6} width={PATH_X2-PATH_X1+16} height="12" rx="6" fill="#94a3b8" />
            {/* Dashed centre line */}
            {[...Array(12)].map((_, i) => (
              <rect key={i} x={PATH_X1 + i * 42} y={PATH_Y-1} width="22" height="2" rx="1" fill="#e2e8f0" />
            ))}

            {/* Completed road (progress fill) */}
            <clipPath id="roadClip">
              <rect x={PATH_X1-8} y={PATH_Y-6} width={((PATH_X2-PATH_X1+16)*progress)/100} height="12" />
            </clipPath>
            <rect x={PATH_X1-8} y={PATH_Y-6} width={PATH_X2-PATH_X1+16} height="12" rx="6" fill="#3b82f6" opacity="0.35" clipPath="url(#roadClip)" />

            {/* Origin pin — Delhi */}
            <circle cx={PATH_X1} cy={PATH_Y} r="10" fill="#1d4ed8" />
            <circle cx={PATH_X1} cy={PATH_Y} r="5"  fill="white"   />
            <text x={PATH_X1} y={PATH_Y+28} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1d4ed8">Delhi</text>
            <text x={PATH_X1} y={PATH_Y+40} textAnchor="middle" fontSize="9"  fill="#64748b">Safdarjung Depot</text>

            {/* Destination pin — DTC Campus */}
            <circle cx={PATH_X2} cy={PATH_Y} r="10" fill={arrived ? "#10b981" : "#94a3b8"} />
            <circle cx={PATH_X2} cy={PATH_Y} r="5"  fill="white" />
            <text x={PATH_X2} y={PATH_Y+28} textAnchor="middle" fontSize="10" fontWeight="600" fill={arrived ? "#10b981" : "#64748b"}>Noida</text>
            <text x={PATH_X2} y={PATH_Y+40} textAnchor="middle" fontSize="9"  fill="#64748b">DTC Campus</text>

            {/* Midpoint label */}
            <text x={(PATH_X1+PATH_X2)/2} y={PATH_Y-22} textAnchor="middle" fontSize="9" fill="#94a3b8">NH-24 · Noida Expressway</text>

            {/* Truck */}
            <g transform={`translate(${truckX - 16}, ${PATH_Y - 14})`}>
              {/* Shadow */}
              <ellipse cx="16" cy="27" rx="13" ry="3" fill="rgba(0,0,0,0.12)" />
              {/* Body */}
              <rect x="2" y="8" width="28" height="14" rx="3" fill={arrived ? "#10b981" : "#1d4ed8"} />
              {/* Cab */}
              <rect x="22" y="4" width="10" height="18" rx="2" fill={arrived ? "#059669" : "#1e40af"} />
              {/* Window */}
              <rect x="24" y="6" width="6" height="6" rx="1" fill="#bfdbfe" opacity="0.8" />
              {/* Wheels */}
              <circle cx="8"  cy="22" r="4" fill="#334155" /><circle cx="8"  cy="22" r="2" fill="#94a3b8" />
              <circle cx="24" cy="22" r="4" fill="#334155" /><circle cx="24" cy="22" r="2" fill="#94a3b8" />
              {/* Headlight */}
              <circle cx="31" cy="16" r="2" fill="#fef08a" opacity={arrived ? "0" : "0.9"} />
              {/* Medical cross */}
              <rect x="9"  y="11" width="10" height="3" rx="1" fill="white" opacity="0.7" />
              <rect x="13" y="8"  width="3"  height="9" rx="1" fill="white" opacity="0.7" />
            </g>

            {/* Arrived badge */}
            {arrived && (
              <g>
                <rect x={PATH_X2-42} y={PATH_Y-52} width="84" height="24" rx="12" fill="#10b981" />
                <text x={PATH_X2} y={PATH_Y-36} textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Delivered ✓</text>
              </g>
            )}

            {/* Progress % */}
            <text x="320" y="210" textAnchor="middle" fontSize="10" fill="#94a3b8">
              {arrived ? "Journey complete — resetting…" : `${Math.round(progress)}% of route covered`}
            </text>
          </svg>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Origin",      value: "Delhi",          sub: "Safdarjung Depot" },
            { label: "ETA",         value: "~14 min",        sub: "NH-24 corridor"   },
            { label: "Destination", value: "DTC Campus",     sub: "Sector 62, Noida" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
              <p className="text-slate-800 font-semibold text-sm">{value}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-100" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between"><div className="h-3 bg-slate-100 rounded w-1/3"/><div className="w-9 h-9 bg-slate-100 rounded-xl"/></div>
        <div className="h-10 bg-slate-100 rounded w-1/2"/>
        <div className="h-2 bg-slate-100 rounded"/>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const bars = [62, 78, 45, 91, 55, 83, 70, 48, 95, 60, 74, 88];
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-slate-800 font-semibold mb-1">Temperature Analytics</h2>
        <p className="text-slate-400 text-xs mb-6">Last 12 shipments · Cold-chain compliance</p>
        <div className="flex items-end gap-2 h-32">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-t-lg ${h > 80 ? "bg-red-400" : "bg-blue-500"} opacity-80`}
              style={{ height: `${h}%` }}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-400">Shipment 1</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-red-400 inline-block"/>Risk &gt;80 %
            <span className="w-2 h-2 rounded-sm bg-blue-500 inline-block ml-2"/>Safe
          </span>
          <span className="text-xs text-slate-400">Shipment 12</span>
        </div>
      </motion.div>
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Avg Temperature", value:"5.4 °C",  color:"text-blue-600" },
          { label:"Avg Humidity",    value:"52 %",    color:"text-teal-600" },
          { label:"High Risk Events",value:"3",       color:"text-red-500"  },
          { label:"On-time Delivery",value:"94 %",    color:"text-emerald-600" },
        ].map(({label,value,color}) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function HistoryView({ rows }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show"
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50">
        <h2 className="text-slate-800 font-semibold">Shipment History</h2>
        <p className="text-slate-400 text-xs mt-0.5">All recorded blockchain-verified entries</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80">
              {["ID","Product","Timestamp","Hash","Risk","Temp","Humidity"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.length === 0
              ? <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-300 text-sm">No history yet — data will appear here as shipments are recorded.</td></tr>
              : rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5"><span className="font-mono text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">{row.id}</span></td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">{row.productName}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{row.timestamp}</td>
                  <td className="px-5 py-3.5"><span className="font-mono text-xs text-indigo-500">{truncateHash(row.hash)}</span></td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${row.risk==="High"?"bg-red-50 text-red-600 border-red-100":"bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.risk==="High"?"bg-red-500":"bg-emerald-500"}`}/>
                      {row.risk==="High"?"At Risk":"Safe"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{parseFloat(row.temperature).toFixed(1)} °C</td>
                  <td className="px-5 py-3.5 text-slate-500">{row.humidity} %</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function SettingsView() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      {[
        { title:"Refresh Interval",    desc:"How often sensor data is fetched",   value:"5 seconds"   },
        { title:"Alert Threshold",     desc:"Temperature above which risk = High", value:"8.0 °C"     },
        { title:"Blockchain Network",  desc:"Connected ledger cluster",            value:"Geneva BFT"  },
        { title:"Notification Email",  desc:"Alerts dispatched to",               value:"ops@vitalchain.ai" },
      ].map(({title,desc,value}) => (
        <motion.div key={title} variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-800 font-semibold text-sm">{title}</p>
            <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
          </div>
          <span className="text-sm font-mono text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">{value}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function App() {
  const [temperature,    setTemperature]    = useState(null);
  const [humidity,       setHumidity]       = useState(null);
  const [risk,           setRisk]           = useState(null);
  const [blockchainHash, setBlockchainHash] = useState(null);
  const [lastUpdated,    setLastUpdated]    = useState(null);

  const [rows,        setRows]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [connected,   setConnected]   = useState(true);
  const [modalRow,    setModalRow]    = useState(null);
  const [activeNav,   setActiveNav]   = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchSensorData = useCallback(async () => {
    try {
      const res  = await fetch("http://localhost:5000/api/sensor-data");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const temperature    = data.temperature;
      const humidity       = data.humidity;
      const risk           = data.risk;
      const blockchainHash = data.blockchainHash;
      const timestamp      = data.timestamp ?? new Date().toLocaleTimeString();

      setTemperature(temperature);
      setHumidity(humidity);
      setRisk(risk);
      setBlockchainHash(blockchainHash);
      setLastUpdated(timestamp);
      setConnected(true);
      setLoading(false);

      setRows(prev =>
        [createRow({ temperature, humidity, risk, blockchainHash, timestamp }), ...prev].slice(0, 20)
      );
    } catch { setConnected(false); }
  }, []);

  useEffect(() => {
    fetchSensorData();
    const id = setInterval(fetchSensorData, 5000);
    return () => clearInterval(id);
  }, [fetchSensorData]);

  const tempDisplay = temperature != null ? `${parseFloat(temperature).toFixed(1)}` : "--";
  const humDisplay  = humidity    != null ? `${humidity}` : "--";
  const isHighRisk  = risk === "High";
  const tempBar     = temperature != null ? `${Math.min((Math.abs(parseFloat(temperature))/12)*100,100)}%` : "0%";
  const humBar      = humidity    != null ? `${Math.min(humidity,100)}%` : "0%";

  const pageTitle = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      <FontLink />

      {/* ── Top Navbar ── */}
      <nav className="sticky top-0 z-40 bg-[#0f2d56] border-b border-blue-900/60 shadow-lg shadow-blue-950/20">
        <div className="px-4 h-15 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <Menu size={18} />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center shadow">
              <HeartPulse size={16} className="text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-white font-bold text-lg tracking-tight">VitalChain</span>
              <span className="text-blue-300 font-bold text-lg tracking-tight"> AI</span>
            </div>
            <span className="text-[10px] font-bold text-teal-300 bg-teal-900/50 border border-teal-700/50 px-2 py-0.5 rounded-full uppercase tracking-widest">Pro</span>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="hidden sm:flex items-center gap-1.5 text-xs text-blue-300">
                <Clock size={11}/> <span className="text-blue-100 font-medium">{lastUpdated}</span>
              </p>
            )}
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              connected ? "text-emerald-300 bg-emerald-900/40 border-emerald-700/50" : "text-red-300 bg-red-900/30 border-red-700/40"
            }`}>
              {connected
                ? <><Wifi size={11}/><span>Live</span><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/></>
                : <><WifiOff size={11}/><span>Offline</span></>
              }
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{    width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-white border-r border-slate-100 shadow-sm flex-shrink-0 overflow-hidden"
            >
              <div className="w-[220px] py-5 px-3 space-y-1">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                  const active = activeNav === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveNav(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-blue-600" : "text-slate-400"} />
                      {label}
                      {active && <ChevronRight size={14} className="ml-auto text-blue-400" />}
                    </button>
                  );
                })}

                {/* Sidebar status mini-card */}
                <div className="mt-6 pt-5 border-t border-slate-100 px-1">
                  <div className={`rounded-xl p-3 border ${isHighRisk ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isHighRisk ? "text-red-400" : "text-emerald-500"}`}>
                      Current Risk
                    </p>
                    <p className={`text-lg font-bold ${isHighRisk ? "text-red-500" : "text-emerald-600"}`}>
                      {risk ?? "--"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{tempDisplay}°C · {humDisplay}% RH</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto px-5 py-7 space-y-6">

          {/* Page title */}
          <motion.div key={activeNav} variants={fadeUp} initial="hidden" animate="show">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{pageTitle}</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {activeNav === "dashboard" && "Real-time sensor telemetry · Blockchain-anchored records"}
              {activeNav === "map"       && "Live vehicle position · NH-24 Delhi–Noida corridor"}
              {activeNav === "analytics" && "Historical performance across all recorded shipments"}
              {activeNav === "history"   && "Full audit trail of blockchain-verified entries"}
              {activeNav === "settings"  && "System configuration & alert thresholds"}
            </p>
          </motion.div>

          {/* ── DASHBOARD ── */}
          <AnimatePresence mode="wait">
            {activeNav === "dashboard" && (
              <motion.div key="dashboard" variants={stagger} initial="hidden" animate="show" exit={{ opacity:0 }} className="space-y-6">

                {/* Metric cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {loading ? (
                    <><SkeletonCard/><SkeletonCard/><SkeletonCard/></>
                  ) : (
                    <>
                      {/* Temperature */}
                      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-600" />
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Temp</span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Thermometer size={17} className="text-blue-600"/></div>
                          </div>
                          <p className="text-5xl font-bold text-blue-700 tracking-tight animate-pulse">
                            {tempDisplay}<span className="text-base font-normal text-slate-400 ml-1">°C</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-700" style={{width:tempBar}}/>
                            </div>
                            <span className="text-xs text-slate-400">Celsius</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Humidity */}
                      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-emerald-500" />
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Humidity</span>
                            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center"><Droplets size={17} className="text-teal-500"/></div>
                          </div>
                          <p className="text-5xl font-bold text-teal-600 tracking-tight">
                            {humDisplay}<span className="text-base font-normal text-slate-400 ml-1">%</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-700" style={{width:humBar}}/>
                            </div>
                            <span className="text-xs text-slate-400">RH</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Risk */}
                      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-1 ${isHighRisk ? "bg-gradient-to-r from-orange-400 to-red-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`} />
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Spoilage Risk</span>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isHighRisk?"bg-red-50":"bg-emerald-50"}`}>
                              {isHighRisk ? <ShieldAlert size={17} className="text-red-500"/> : <ShieldCheck size={17} className="text-emerald-500"/>}
                            </div>
                          </div>
                          <p className={`text-5xl font-bold tracking-tight ${risk==null?"text-slate-300":isHighRisk?"text-red-500":"text-emerald-500"}`}>
                            {risk ?? "--"}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isHighRisk?"bg-red-400 animate-ping":"bg-emerald-400"}`}/>
                            <span className={`text-xs font-medium ${isHighRisk?"text-red-400":"text-emerald-500"}`}>
                              {risk==null?"Awaiting data":isHighRisk?"Alert dispatched":"Within safe thresholds"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Search & Timeline */}
                <ShipmentSearch />

                {/* Shipments table */}
                <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-400" />
                  <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="text-slate-800 font-semibold text-base">Recent Shipment Records</h2>
                      <p className="text-slate-400 text-xs mt-0.5">Blockchain-verified · updates every 5 s</p>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1 font-medium">{rows.length} records</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50/80">
                          {["Shipment ID","Product","Timestamp","Blockchain Hash","Status","Action"].map(h => (
                            <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {rows.slice(0,8).length === 0 ? (
                          <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-300 text-sm">Awaiting live sensor data…</td></tr>
                        ) : rows.slice(0,8).map(row => {
                          const rh = row.risk === "High";
                          const { ProductIcon } = row;
                          return (
                            <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="px-5 py-4"><span className="font-mono text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">{row.id}</span></td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0"><ProductIcon size={13} className="text-blue-600"/></div>
                                  <span className="text-slate-700 font-medium whitespace-nowrap">{row.productName}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{row.timestamp}</td>
                              <td className="px-5 py-4"><span title={row.hash} className="font-mono text-xs text-indigo-500 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg whitespace-nowrap cursor-default">{truncateHash(row.hash)}</span></td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${rh?"bg-red-50 text-red-600 border-red-100":"bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${rh?"bg-red-500":"bg-emerald-500"}`}/>{rh?"At Risk":"Safe"}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <button onClick={() => setModalRow(row)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-3.5 py-2 rounded-xl transition-all shadow-sm">
                                  <Link2 size={12}/>Verify Ledger
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── MAP ── */}
            {activeNav === "map" && (
              <motion.div key="map" variants={stagger} initial="hidden" animate="show" exit={{ opacity:0 }} className="space-y-5">
                <LiveMapCard />
              </motion.div>
            )}

            {/* ── ANALYTICS ── */}
            {activeNav === "analytics" && (
              <motion.div key="analytics" exit={{ opacity:0 }}>
                <AnalyticsView />
              </motion.div>
            )}

            {/* ── HISTORY ── */}
            {activeNav === "history" && (
              <motion.div key="history" exit={{ opacity:0 }}>
                <HistoryView rows={rows} />
              </motion.div>
            )}

            {/* ── SETTINGS ── */}
            {activeNav === "settings" && (
              <motion.div key="settings" exit={{ opacity:0 }}>
                <SettingsView />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-slate-300 pb-4">
            VitalChain AI · Distributed Ledger Technology · End-to-end encrypted
          </p>
        </main>
      </div>

      {/* ── Verify Modal ── */}
      {modalRow && <VerifyModal row={modalRow} onClose={() => setModalRow(null)} />}
    </div>
  );
}
