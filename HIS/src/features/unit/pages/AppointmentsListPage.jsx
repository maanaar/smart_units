import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, CalendarDays, ChevronLeft, ChevronRight, Filter,
} from 'lucide-react';
import { listBookings } from '../../../services/odooClient';

// Odoo appoint_state → display status
const ODOO_STATUS_MAP = {
  Draft:           { label: 'عاجل',       bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-500' },
  Confirmed:       { label: 'مؤكد',       bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Arrived:         { label: 'وصل',        bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-500' },
  'In Patient':    { label: 'في العيادة', bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  'In Payment':    { label: 'في الدفع',   bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  Paid:            { label: 'تم الدفع',   bg: 'bg-lime-100',    text: 'text-lime-700',    dot: 'bg-lime-500' },
  done:            { label: 'منتهي',      bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400' },
  Cancelled:       { label: 'ملغي',       bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-400' },
  Missed:          { label: 'غائب',       bg: 'bg-orange-100',  text: 'text-orange-600',  dot: 'bg-orange-400' },
};

const DEFAULT_STATUS = { label: 'غير محدد', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-300' };

const fmtTime = (iso) => {
  if (!iso) return '';
  const [h, m] = iso.slice(11, 16).split(':').map(Number);
  const ap = h < 12 ? 'ص' : 'م';
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
};

export default function AppointmentsListPage() {
  const navigate = useNavigate();

  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState('');
  const [dateFilter, setDateFilter]   = useState(new Date().toISOString().slice(0, 10));
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    listBookings({ date: dateFilter })
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [dateFilter]);

  const filtered = useMemo(() => {
    let list = bookings;
    if (statusFilter) list = list.filter(b => b.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(b =>
        b.patientName?.toLowerCase().includes(q) ||
        b.mrn?.toLowerCase().includes(q) ||
        b.mobile?.includes(q) ||
        b.doctor?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, statusFilter, search]);

  const addDay = (n) => {
    const d = new Date(dateFilter);
    d.setDate(d.getDate() + n);
    setDateFilter(d.toISOString().slice(0, 10));
  };

  const fmtDateAR = (iso) =>
    new Date(iso).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-l from-emerald-800 to-teal-600 bg-clip-text text-transparent">
                قائمة المواعيد
              </h1>
              <p className="text-xs text-gray-400">{fmtDateAR(dateFilter)}</p>
            </div>
          </div>

          {/* Date navigator */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
            <button onClick={() => addDay(-1)} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-teal-600 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => setDateFilter(new Date().toISOString().slice(0, 10))} className="px-3 py-1 text-sm font-semibold rounded-lg hover:bg-white hover:shadow-sm text-gray-700 hover:text-teal-700 transition-all">
              اليوم
            </button>
            <button onClick={() => addDay(1)} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-teal-600 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="border-r border-gray-200 mx-1 h-5" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm border-0 bg-transparent outline-none text-gray-600 focus:text-teal-700 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {filtered.length} موعد
            </span>
            <button
              onClick={() => navigate('/unit/ReceptionPage')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-l from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <span className="text-lg leading-none">+</span>
              موعد جديد
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0 flex items-center gap-3 flex-wrap" dir="rtl">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم، رقم الملف، الموبايل، الطبيب..."
            className="w-full pr-9 pl-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-600"
          >
            <option value="">كل الحالات</option>
            {Object.entries(ODOO_STATUS_MAP).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-teal-600 font-semibold" dir="rtl">
            جاري التحميل...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400" dir="rtl">
            <CalendarDays className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-lg font-semibold">لا توجد مواعيد</p>
            <p className="text-sm">جرب تغيير التاريخ أو مسح البحث</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" dir="rtl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-l from-teal-700 to-emerald-700 text-white">
                  {['الوقت', 'المريض', 'رقم الملف', 'الموبايل', 'الطبيب', 'العيادة', 'الجنس', 'الحالة'].map((h, i, arr) => (
                    <th key={h} className={`text-right px-4 py-3 text-xs font-semibold whitespace-nowrap ${i < arr.length - 1 ? 'border-l border-white/20' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b, idx) => {
                  const s = ODOO_STATUS_MAP[b.status] || DEFAULT_STATUS;
                  return (
                    <tr
                      key={b.id}
                      className={`cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-teal-50`}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap border-l border-gray-100">{fmtTime(b.start)}</td>
                      <td className="px-4 py-3 border-l border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {(b.patientName || '?')[0]}
                          </div>
                          <span className="font-semibold text-gray-800">{b.patientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs border-l border-gray-100">{b.mrn || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs border-l border-gray-100" dir="ltr">{b.mobile || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap border-l border-gray-100">{b.doctor || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs border-l border-gray-100">{b.clinic || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs border-l border-gray-100">
                        {b.gender === 'Male' ? 'ذكر' : b.gender === 'Female' ? 'أنثى' : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
