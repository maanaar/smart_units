import { useState, useEffect } from 'react';
import useAuthStore from '../../auth/store';
import Card from '../../dashboards/components/cards';
import { getDashboardStats } from '../../../services/odooClient';

const HOURLY = [
  { h: '8ص', v: 20 }, { h: '10ص', v: 55 }, { h: '12ظ', v: 90 },
  { h: '2م', v: 70 }, { h: '4م',  v: 75 }, { h: '6م',  v: 40 }, { h: '8م', v: 25 },
];

const TRIAGE = [
  { label: 'أحمر',   pct: 15, color: '#ef4444' },
  { label: 'أصفر',   pct: 30, color: '#f59e0b' },
  { label: 'أخضر',   pct: 55, color: '#10b981' },
];

const DEPT = [
  { name: 'طب عام',       pct: 85, color: '#0ea5e9' },
  { name: 'طب أطفال',     pct: 72, color: '#0ea5e9' },
  { name: 'طب أسنان',     pct: 64, color: '#8b5cf6' },
  { name: 'أمراض النساء', pct: 45, color: '#8b5cf6' },
];

const WEEKLY_THIS = [38, 32, 28, 42, 45, 38, 40];
const WEEKLY_LAST = [30, 28, 35, 30, 36, 30, 34];
const WEEKLY_DAYS = ['الإثنين', 'الأربعاء', 'الجمعة', 'الأحد'];


const ALERTS = [
  { id: 1, msg: 'مخزون باراسيتامول ٥٠٠ مجم منخفض بشكل حرج (أقل من الحد الأدنى)', source: 'سلسلة الإمداد', time: 'منذ ١٠ دقائق', critical: true  },
  { id: 2, msg: 'محاقن الأنسولين نفدت من الصيدلية الرئيسية',                        source: 'الصيدلية',      time: 'منذ ٢٢ دقيقة', critical: true  },
  { id: 3, msg: 'تجاوزت مدة نتائج المختبر ٤ ساعات لـ ٣ عينات',                     source: 'المختبر',       time: 'منذ ٣٥ دقيقة', critical: false },
];

// ── Charts ─────────────────────────────────────────────────────────────────────
function HourlyChart() {
  const W = 280, H = 130, pad = { t: 30, r: 10, b: 25, l: 10 };
  const max = Math.max(...HOURLY.map(d => d.v));
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const pts = HOURLY.map((d, i) => {
    const x = pad.l + (i / (HOURLY.length - 1)) * cW;
    const y = pad.t + cH - (d.v / max) * cH;
    return { x, y, ...d };
  });
  const poly = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <text x={pad.l} y={22} fontSize="11" fontWeight="700" fill="#111827">الذروة (١١ص)</text>
      <polyline points={poly} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(p => (
        <g key={p.h}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#0ea5e9" strokeWidth="2" />
          <text x={p.x} y={H - 5} textAnchor="middle" fontSize="8" fill="#9ca3af">{p.h}</text>
        </g>
      ))}
      {/* peak dot highlight */}
      <circle cx={pts[2].x} cy={pts[2].y} r="5" fill="white" stroke="#0ea5e9" strokeWidth="2.5" />
    </svg>
  );
}

function DonutChart({ visits = 0 }) {
  const r = 52, cx = 70, cy = 70, sw = 18;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = TRIAGE.map(t => {
    const dash = (t.pct / 100) * circ;
    const s = { ...t, dash, offset };
    offset += dash;
    return s;
  });
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 140 140" width="130" height="130">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
        {slices.map(s => (
          <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={circ / 4 - s.offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="16" fontWeight="700" fill="#111827">{visits || '—'}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#9ca3af">زيارات</text>
      </svg>
      <div className="flex flex-col gap-2">
        {TRIAGE.map(t => (
          <div key={t.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
            <span className="text-xs text-gray-600">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeptBars() {
  return (
    <div className="flex flex-col gap-3 pt-1">
      {DEPT.map(d => (
        <div key={d.name}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">{d.name}</span>
            <span className="font-semibold text-gray-700">{d.pct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WeeklyChart() {
  const W = 280, H = 120, pad = { t: 10, r: 10, b: 22, l: 10 };
  const all = [...WEEKLY_THIS, ...WEEKLY_LAST];
  const max = Math.max(...all), min = Math.min(...all);
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const toXY = (arr) => arr.map((v, i) => {
    const x = pad.l + (i / (arr.length - 1)) * cW;
    const y = pad.t + cH - ((v - min) / (max - min)) * cH;
    return `${x},${y}`;
  }).join(' ');

  const xLabels = WEEKLY_DAYS.map((d, i) => {
    const x = pad.l + (i / (WEEKLY_DAYS.length - 1)) * cW;
    return { x, d };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <polyline points={toXY(WEEKLY_THIS)} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={toXY(WEEKLY_LAST)} fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      {xLabels.map(l => (
        <text key={l.d} x={l.x} y={H - 4} textAnchor="middle" fontSize="8" fill="#9ca3af">{l.d}</text>
      ))}
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AgialDashboard() {
  const { user, unit } = useAuthStore();
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []);

  const s = stats;
  const statCards = [
    { label: 'الزيارات اليوم',  value: s ? String(s.today_bookings)       : '…', sub: s ? `${s.booking_confirmed} مؤكدة`  : '…', subColor: 'text-emerald-500' },
    { label: 'حالات المختبر',   value: s ? String(s.today_lab_requests)   : '…', sub: s ? `${s.lab_pending} معلقة`        : '…', subColor: 'text-amber-500'   },
    { label: 'طلبات الأشعة',    value: s ? String(s.today_rad_requests)   : '…', sub: s ? `${s.rad_pending} معلقة`        : '…', subColor: s && s.rad_pending === 0 ? 'text-emerald-500' : 'text-amber-500' },
    { label: 'إجمالي المرضى',   value: s ? String(s.total_patients)       : '…', sub: 'إجمالي في النظام',                        subColor: 'text-emerald-500' },
    { label: 'مرضى راقدون',     value: s ? String(s.active_inpatient)     : '…', sub: 'حالياً بالمستشفى',                        subColor: 'text-emerald-500' },
    { label: 'حالة التكامل',    value: '100%',                                    sub: 'متزامن بالكامل',                          subColor: 'text-emerald-500' },
  ];

  const pendingClinics = s ? s.today_bookings - s.booking_confirmed - s.booking_cancelled : null;
  const modules = [
    { name: 'العيادات',  status: 'نشط', updated: 'الآن',          label: 'المرضى في الانتظار', value: s ? `${pendingClinics} في الانتظار` : '…' },
    { name: 'المختبر',   status: 'نشط', updated: 'الآن',          label: 'نتائج معلقة',         value: s ? `${s.lab_pending} عينة`          : '…' },
    { name: 'الأشعة',    status: 'نشط', updated: 'الآن',          label: 'دراسات غير مقروءة',  value: s ? `${s.rad_pending} معلق`          : '…' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 py-5 space-y-5">

        {/* top bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-emerald-600" />
            <div>
              <p className="text-base font-bold text-gray-900 leading-tight capitalize">{unit || 'Unit'} Dashboard</p>
              <p className="text-[11px] text-gray-400">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 border border-emerald-200 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> متزامن
            </span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">{initials}</div>
              <div>
                <p className="text-xs font-semibold text-gray-800 leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400 capitalize">{unit || 'Unit'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6 stat cards ── */}
        <div className="grid grid-cols-6 gap-3">
          {statCards.map(s => (
            <Card
              key={s.label}
              title={s.label}
              stat={s.value}
              description={s.sub}
              descriptionColor={s.subColor}
            />
          ))}
        </div>

        {/* ── 4 charts ── */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm font-bold text-gray-800 mb-2">تدفق الزيارات بالساعة</p>
            <HourlyChart />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm font-bold text-gray-800 mb-2">توزيع الفرز</p>
            <DonutChart visits={s ? s.today_bookings : 0} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm font-bold text-gray-800 mb-3">استخدام الأقسام</p>
            <DeptBars />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm font-bold text-gray-800 mb-2">المقارنة الأسبوعية</p>
            <WeeklyChart />
          </div>
        </div>

        {/* ── Bottom: modules + alerts ── */}
        <div className="grid grid-cols-[1fr_360px] gap-4">

          {/* Module Status Panel */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">حالة الوحدات</h2>
            <div className="grid grid-cols-3 gap-4">
              {modules.map(m => (
                <div key={m.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs font-bold">{m.name[0]}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">{m.status}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-2">{m.name}</p>
                  <p className="text-[10px] text-gray-400 mb-3">تحديث {m.updated}</p>
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">{m.label}</p>
                  <p className="text-xl font-bold text-gray-900">{m.value}</p>
                  <button className="mt-3 w-full py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    فتح الوحدة
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">التنبيهات النشطة</h2>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">٣ حرجة</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 mb-3">النشاط الأخير</p>
              <div className="flex flex-col gap-3">
                {ALERTS.map(a => (
                  <div key={a.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${a.critical ? 'bg-red-100' : 'bg-amber-100'}`}>
                      <span className={`w-2 h-2 rounded-full ${a.critical ? 'bg-red-500' : 'bg-amber-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 leading-snug">{a.msg}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.source} · {a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
