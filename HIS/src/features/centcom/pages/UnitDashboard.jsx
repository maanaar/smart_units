// ── mock data ──────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'TOTAL PATIENTS TODAY', value: '47,832', change: '+12% vs yesterday', up: true,  color: 'teal',  spark: [20,35,28,45,30,50,40,60,45,70] },
  { label: 'LAB CASES TODAY',      value: '12,450', change: '+4.2% vs yesterday', up: true,  color: 'teal',  spark: [30,25,40,35,50,45,55,50,60,55] },
  { label: 'RADIOLOGY ORDERS',     value: '3,218',  change: '-1.5% vs yesterday', up: false, color: 'red',   spark: [60,55,50,58,45,50,40,48,35,42] },
  { label: 'PHARMACY DISPENSES',   value: '28,940', change: '+8.1% vs yesterday', up: true,  color: 'teal',  spark: [20,30,25,40,35,55,45,60,55,70] },
  { label: 'INVENTORY ALERTS',     value: '47 units', change: 'Requires restock action', up: null, color: 'amber', spark: null },
  { label: 'INTEGRATION STATUS',   value: '12/14 active', change: '2 connections failed (HL7)', up: null, color: 'red', spark: null },
];

const UNITS = [
  { id: 1, label: 'Alexandria — 98%',  status: 'online',  x: 148, y: 52  },
  { id: 2, label: 'Cairo — 4 Alerts',  status: 'alert',   x: 232, y: 118 },
  { id: 3, label: 'Giza — 100%',       status: 'online',  x: 205, y: 148 },
  { id: 4, label: 'Assiut — 100%',     status: 'online',  x: 238, y: 278 },
  { id: 5, label: 'Red Sea — 100%',    status: 'online',  x: 332, y: 248 },
  { id: 6, label: 'Aswan — 2 Offline', status: 'offline', x: 270, y: 420 },
];

const CONNECTIVITY = { connected: 284, total: 300 };

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Spark({ data, color }) {
  const w = 80, h = 30;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  const stroke = color === 'red' ? '#f87171' : color === 'amber' ? '#fbbf24' : '#14b8a6';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
function StatCard({ stat }) {
  const border = { teal: 'border-teal-200', red: 'border-red-200', amber: 'border-amber-200' }[stat.color];
  const change = { teal: 'text-teal-600',   red: 'text-red-500',   amber: 'text-amber-600'  }[stat.color];

  return (
    <div className={`bg-white border ${border} rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm`}>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
        <p className={`text-xs mt-1 font-medium ${change}`}>
          {stat.up === true && '↑ '}
          {stat.up === false && '↓ '}
          {stat.change}
        </p>
      </div>
      {stat.spark && <Spark data={stat.spark} color={stat.color} />}
    </div>
  );
}

// ── Egypt Map ──────────────────────────────────────────────────────────────────
function EgyptMap() {
  return (
    <svg viewBox="0 0 420 500" className="w-full h-full" style={{ maxHeight: 460 }}>
      <defs>
        <pattern id="ugrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="420" height="500" fill="url(#ugrid)" />

      {/* Egypt main body */}
      <polygon
        points="30,28 170,28 182,14 215,14 242,46 265,96 250,86 235,42 208,26 178,28 30,470 285,470 310,400 325,165 295,185 265,172 248,90 228,46 210,28"
        fill="rgba(16,185,129,0.06)"
        stroke="rgba(16,185,129,0.35)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Sinai */}
      <polygon
        points="215,14 260,42 295,90 318,165 295,185 265,172 248,90 228,46"
        fill="rgba(16,185,129,0.04)"
        stroke="rgba(16,185,129,0.25)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Nile */}
      <polyline
        points="270,420 265,360 255,300 245,240 238,180 232,130 215,90 195,60 175,42"
        fill="none"
        stroke="rgba(56,189,248,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Unit markers */}
      {UNITS.map(u => (
        <g key={u.id}>
          <circle cx={u.x} cy={u.y} r="10" fill="none"
            stroke={u.status === 'offline' ? 'rgba(239,68,68,0.25)' : u.status === 'alert' ? 'rgba(251,191,36,0.3)' : 'rgba(16,185,129,0.25)'}
            strokeWidth="1.5"
          />
          <circle cx={u.x} cy={u.y} r="5"
            fill={u.status === 'offline' ? '#ef4444' : u.status === 'alert' ? '#f59e0b' : '#10b981'}
          />
          <foreignObject x={u.x + 10} y={u.y - 13} width="145" height="26">
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap shadow-sm
                ${u.status === 'offline' ? 'bg-red-50 text-red-700 border border-red-200'
                  : u.status === 'alert'  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  :                         'bg-gray-800 text-white'}`}
            >
              {u.label}
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function UnitDashboard() {
  const pct = Math.round((CONNECTIVITY.connected / CONNECTIVITY.total) * 100);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">

      {/* top bar */}
      <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
        <div className="w-1 h-7 rounded-full bg-emerald-600" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
          CentCom Dashboard
        </h1>
        <span className="ml-auto text-xs text-gray-400 font-mono">
          {new Date().toLocaleString('en-GB')}
        </span>
      </div>

      {/* two-column body */}
      <div className="flex-1 grid grid-cols-[300px_1fr] overflow-hidden">

        {/* stats */}
        <div className="border-r border-gray-200 p-4 flex flex-col gap-3 overflow-y-auto bg-white">
          {STATS.map(s => <StatCard key={s.label} stat={s} />)}
        </div>

        {/* map + connectivity */}
        <div className="flex flex-col p-5 gap-4 overflow-hidden">
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center p-4">
            <EgyptMap />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 font-medium">Network Connectivity</span>
              <span className="text-sm font-bold text-gray-800">
                {CONNECTIVITY.connected}/{CONNECTIVITY.total} ({pct}%)
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct - 3}%` }} />
              <div className="h-full bg-amber-400" style={{ width: '2%' }} />
              <div className="h-full bg-red-500" style={{ width: '1%' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
