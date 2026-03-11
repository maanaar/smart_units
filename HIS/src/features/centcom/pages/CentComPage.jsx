import { useState } from 'react';

// ── mock data ──────────────────────────────────────────────────────────────────
const SUMMARY = [
  { label: 'Health Units',       value: '42',    sub: '38 Online',  sub2: '4 Offline', subColor: 'text-emerald-500', sub2Color: 'text-red-500' },
  { label: 'Patients Today',     value: '12,450',sub: '+5% vs yesterday', subColor: 'text-emerald-500' },
  { label: 'Lab Cases',          value: '3,420', sub: '120 Pending', subColor: 'text-amber-500' },
  { label: 'Radiology',          value: '890',   sub: '15 Pending',  subColor: 'text-amber-500' },
  { label: 'Pharmacy Dispenses', value: '7,120', sub: 'Normal volume', subColor: 'text-emerald-500' },
  { label: 'Alerts',             value: '14',    sub: '3 Critical issues', subColor: 'text-red-500' },
];

const TOP_UNITS = [
  { name: 'Heliopolis', count: 450 },
  { name: 'Nasr City',  count: 420 },
  { name: 'Maadi',      count: 380 },
  { name: 'N. Cairo',   count: 310 },
  { name: 'Shubra',     count: 290 },
];

const TRIAGE = [
  { label: 'Red',    pct: 15, color: '#ef4444' },
  { label: 'Yellow', pct: 30, color: '#f59e0b' },
  { label: 'Green',  pct: 55, color: '#10b981' },
];

const WEEKLY = [
  { day: 'Mon', v: 320 }, { day: 'Tue', v: 380 }, { day: 'Wed', v: 350 },
  { day: 'Thu', v: 460 }, { day: 'Fri', v: 420 }, { day: 'Sat', v: 490 }, { day: 'Sun', v: 460 },
];

const HEALTH_UNITS = [
  { id: 1, name: 'Heliopolis Primary Care', address: 'Oruba St, Heliopolis', status: 'online',  patients: 450, labPend: 12, radPend: 5  },
  { id: 2, name: 'Nasr City Medical Center', address: 'Abbas El-Akkad, Nasr City', status: 'online',  patients: 420, labPend: 8,  radPend: 3  },
  { id: 3, name: 'Maadi General Hospital',   address: 'Road 9, Maadi',          status: 'online',  patients: 380, labPend: 15, radPend: 7  },
  { id: 4, name: 'North Cairo Clinic',       address: 'Shubra El-Kheima',       status: 'alert',   patients: 310, labPend: 22, radPend: 4  },
  { id: 5, name: 'Shubra Health Unit',       address: 'Shubra St, Cairo',        status: 'offline', patients: 290, labPend: 0,  radPend: 0  },
  { id: 6, name: 'Dokki Medical Branch',     address: 'Tahrir Sq, Dokki',        status: 'online',  patients: 260, labPend: 6,  radPend: 2  },
];

// ── Bar Chart ──────────────────────────────────────────────────────────────────
function BarChart() {
  const W = 420, H = 180, pad = { t: 20, r: 10, b: 30, l: 36 };
  const max = Math.max(...TOP_UNITS.map(u => u.count));
  const bw = 36, gap = (W - pad.l - pad.r - TOP_UNITS.length * bw) / (TOP_UNITS.length + 1);
  const chartH = H - pad.t - pad.b;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = pad.t + chartH * (1 - f);
        return (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={pad.l - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
              {Math.round(max * f)}
            </text>
          </g>
        );
      })}
      {/* bars */}
      {TOP_UNITS.map((u, i) => {
        const x = pad.l + gap * (i + 1) + bw * i;
        const bh = (u.count / max) * chartH;
        const y = pad.t + chartH - bh;
        return (
          <g key={u.name}>
            <rect x={x} y={y} width={bw} height={bh} rx="4" fill="#0ea5e9" />
            <text x={x + bw / 2} y={y - 5} textAnchor="middle" fontSize="9" fill="#6b7280">{u.count}</text>
            <text x={x + bw / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#6b7280">{u.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut Chart ────────────────────────────────────────────────────────────────
function DonutChart() {
  const r = 60, cx = 90, cy = 90, stroke = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = TRIAGE.map(t => {
    const dash = (t.pct / 100) * circ;
    const slice = { ...t, dash, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" width="160" height="160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
        {slices.map(s => (
          <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={circ / 4 - s.offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">12.4k</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#9ca3af">Total</text>
      </svg>
      <div className="flex flex-col gap-2">
        {TRIAGE.map(t => (
          <div key={t.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
            <span className="text-sm text-gray-600">{t.label} ({t.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Line Chart ─────────────────────────────────────────────────────────────────
function LineChart() {
  const W = 340, H = 160, pad = { t: 20, r: 10, b: 25, l: 10 };
  const max = Math.max(...WEEKLY.map(d => d.v));
  const min = Math.min(...WEEKLY.map(d => d.v));
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const pts = WEEKLY.map((d, i) => {
    const x = pad.l + (i / (WEEKLY.length - 1)) * chartW;
    const y = pad.t + chartH - ((d.v - min) / (max - min)) * chartH;
    return { x, y, ...d };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${pad.t + chartH} ${polyline} ${pts[pts.length - 1].x},${pad.t + chartH}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaGrad)" />
      <polyline points={polyline} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(p => (
        <g key={p.day}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#0ea5e9" strokeWidth="2" />
          <text x={p.x} y={H - 5} textAnchor="middle" fontSize="9" fill="#9ca3af">{p.day}</text>
        </g>
      ))}
    </svg>
  );
}

// ── UnitCard ───────────────────────────────────────────────────────────────────
function UnitCard({ unit }) {
  const dot   = unit.status === 'online' ? 'bg-emerald-500' : unit.status === 'alert' ? 'bg-amber-400' : 'bg-red-500';
  const label = unit.status === 'online' ? 'Online' : unit.status === 'alert' ? 'Alert' : 'Offline';
  const lc    = unit.status === 'online' ? 'text-emerald-600' : unit.status === 'alert' ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">{unit.name}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{unit.address}</p>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${lc}`}>
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          {label}
        </span>
      </div>
      <div className="flex gap-5">
        <div>
          <p className="text-xl font-bold text-gray-900">{unit.patients}</p>
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Patients</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{unit.labPend}</p>
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Lab Pend.</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{unit.radPend}</p>
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Rad Pend.</p>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function CentComPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = HEALTH_UNITS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 py-5 space-y-5">

        {/* top bar */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-emerald-600" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
            National Command Center
          </h1>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-6 gap-3">
          {SUMMARY.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 leading-tight">{s.value}</p>
              <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}
                {s.sub2 && <><span className="text-gray-300 mx-1">,</span><span className={s.sub2Color}>{s.sub2}</span></>}
              </p>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-800 mb-4">Patients per Unit (Top 5)</p>
            <BarChart />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-800 mb-4">Triage Distribution</p>
            <DonutChart />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-800 mb-4">Weekly Visit Trend</p>
            <LineChart />
          </div>
        </div>

        {/* ── Health Units ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Health Units</h2>
            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search units..."
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-300 w-44"
              />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="alert">Alert</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filtered.map(u => <UnitCard key={u.id} unit={u} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
