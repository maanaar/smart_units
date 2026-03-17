import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CalendarDays,
  User,
  Phone,
  CreditCard,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import useAgialStore from '../store';
import { MOCK_EVENTS, MOCK_DOCTORS } from '../mockCalendar';

// ── Status config ──
const STATUS_MAP = {
  ON_THE_FLY: { label: 'عاجل',       bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-500' },
  CONFIRMED:  { label: 'مؤكد',       bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  ARRIVED:    { label: 'وصل',        bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-500' },
  IN_CHAIR:   { label: 'في العيادة', bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  IN_PAYMENT: { label: 'في الدفع',   bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  PAID:       { label: 'تم الدفع',   bg: 'bg-lime-100',    text: 'text-lime-700',    dot: 'bg-lime-500' },
  CLOSED:     { label: 'مغلق',       bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400' },
};

const fmtTime = (iso) => {
  if (!iso) return '';
  const [h, m] = iso.slice(11, 16).split(':').map(Number);
  const ap = h < 12 ? 'ص' : 'م';
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
};

export default function AppointmentsListPage() {
  const navigate = useNavigate();
  const storeAppointments = useAgialStore((s) => s.appointments);

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [statusFilter, setStatusFilter] = useState('');

  // Merge mock + store appointments
  const allAppointments = useMemo(() => {
    const merged = [...MOCK_EVENTS];
    storeAppointments.forEach(sa => {
      const idx = merged.findIndex(m => m.id === sa.id);
      if (idx >= 0) merged[idx] = sa;
      else merged.push(sa);
    });
    return merged;
  }, [storeAppointments]);

  // Filter
  const filtered = useMemo(() => {
    let list = allAppointments;

    if (dateFilter) {
      list = list.filter(a => a.start?.startsWith(dateFilter));
    }
    if (statusFilter) {
      list = list.filter(a => a.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(a =>
        a.patientName?.toLowerCase().includes(q) ||
        a.patient?.mrn?.toLowerCase().includes(q) ||
        a.patient?.nationalId?.includes(q) ||
        a.patient?.mobile?.includes(q)
      );
    }

    // Sort by start time
    list.sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    return list;
  }, [allAppointments, dateFilter, statusFilter, search]);

  const handleRowClick = (appt) => {
    const doctor = MOCK_DOCTORS.find(d => d.id === appt.doctorId);
    navigate('/agial/ReceptionPage', {
      state: {
        slot: {
          event: appt,
          doctor,
          date: appt.start?.slice(0, 10),
          time: appt.start?.slice(11, 16),
        },
      },
    });
  };

  const addDay = (n) => {
    const d = new Date(dateFilter);
    d.setDate(d.getDate() + n);
    setDateFilter(d.toISOString().slice(0, 10));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-emerald-700" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
              قائمة المواعيد
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => addDay(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setDateFilter(new Date().toISOString().slice(0, 10))} className="px-3 py-1 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700">
              اليوم
            </button>
            <button onClick={() => addDay(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5" />
              {filtered.length} موعد
            </span>
            <button
              onClick={() => navigate('/agial/ReceptionPage')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <span className="text-lg leading-none">+</span>
              موعد جديد
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div className="px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0 flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم، رقم الملف، الرقم القومي، الموبايل..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="">كل الحالات</option>
            {Object.entries(STATUS_MAP).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 ml-auto">
          {Object.entries(STATUS_MAP).map(([key, s]) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <CalendarDays className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-lg font-semibold">لا توجد مواعيد</p>
            <p className="text-sm">جرب تغيير التاريخ أو مسح البحث</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">الوقت</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">المريض</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">رقم الملف</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">الرقم القومي</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">الموبايل</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">الطبيب</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">العيادة</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">نوع الزيارة</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">الدفع</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((appt) => {
                  const s = STATUS_MAP[appt.status] || STATUS_MAP.ON_THE_FLY;
                  const doctor = MOCK_DOCTORS.find(d => d.id === appt.doctorId);

                  return (
                    <tr
                      key={appt.id}
                      onClick={() => handleRowClick(appt)}
                      className="hover:bg-teal-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                        {fmtTime(appt.start)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {(appt.patientName || '?')[0]}
                          </div>
                          <span className="font-semibold text-gray-800">{appt.patientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {appt.patient?.mrn || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {appt.patient?.nationalId || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs" dir="ltr">
                        {appt.patient?.mobile || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">
                        {doctor?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {appt.visit?.clinic || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {appt.visit?.visitType || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {appt.visit?.payment || '—'}
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
