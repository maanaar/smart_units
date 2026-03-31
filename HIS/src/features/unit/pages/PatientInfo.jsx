import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, User, ChevronLeft, ChevronRight } from 'lucide-react';

import useAgialStore from '../store';
import { searchPatients, getPatient, getPatientVisits, listPatients } from '../../../services/odooClient';

import PatientHeader from '../components/PatientHeader';
import VisitHistory from '../components/VisitHistory';
import DiagnosisPanel from '../components/DiagnosisPanel';
import ListView from '../components/ListView';

const TABS = [
  { id: 'visits',      label: 'سجل الزيارات' },
  { id: 'diagnoses',   label: 'التشخيصات'    },
  { id: 'medications', label: 'الأدوية'       },
  { id: 'lab',         label: 'نتائج المختبر' },
  { id: 'radiology',   label: 'الأشعة'        },
  { id: 'attachments', label: 'المرفقات'      },
];

function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <span className="text-lg">📋</span>
      </div>
      {label} — قريباً
    </div>
  );
}

// ── Search bar (queries Odoo) ─────────────────────────────────────────────

function PatientSearchBar({ onSelect }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(() => {
      searchPatients(query).then(setResults).catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const pick = (patient) => {
    setQuery('');
    setOpen(false);
    onSelect(patient.id);
  };

  return (
    <div className="relative w-72">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="ابحث عن مريض..."
          className="w-full pl-9 pr-8 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-md border border-gray-200 shadow-lg z-20">
          {results.map((p) => (
            <button
              key={p.id}
              onMouseDown={() => pick(p)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-400">{p.mrn} · {p.mobile}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 20;

const GENDER_STYLE = {
  male:   { label: 'ذكر',   bg: 'bg-blue-50',   text: 'text-blue-700',   avatar: 'bg-blue-100 text-blue-700'   },
  female: { label: 'أنثى',  bg: 'bg-pink-50',   text: 'text-pink-700',   avatar: 'bg-pink-100 text-pink-700'   },
};
const TYPE_STYLE = {
  Normal:    { label: 'عادي',   bg: 'bg-gray-100',   text: 'text-gray-600'   },
  Insurance: { label: 'تأمين',  bg: 'bg-amber-50',   text: 'text-amber-700'  },
  VIP:       { label: 'VIP',    bg: 'bg-purple-50',  text: 'text-purple-700' },
};

function Avatar({ name, gender }) {
  const st = GENDER_STYLE[gender?.toLowerCase()] || { avatar: 'bg-teal-100 text-teal-700' };
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${st.avatar}`}>
      {initials}
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 8 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200" /><div className="space-y-1.5"><div className="h-3 w-28 bg-gray-200 rounded" /><div className="h-2.5 w-20 bg-gray-100 rounded" /></div></div></td>
      <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-16 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="h-5 w-12 bg-gray-200 rounded-full" /></td>
      <td className="px-4 py-3"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
    </tr>
  ));
}

function PatientList({ onSelect }) {
  const [query, setQuery]         = useState('');
  const [genderFilter, setGender] = useState('');
  const [typeFilter, setType]     = useState('');
  const [patients, setPatients]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(0);
  const [loading, setLoading]     = useState(false);

  const loadPage = useCallback((p, gender = genderFilter, type = typeFilter) => {
    setLoading(true);
    listPatients({ limit: PAGE_SIZE, offset: p * PAGE_SIZE, gender, patient_type: type })
      .then(({ patients: rows, total: t }) => { setPatients(rows); setTotal(t); setPage(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [genderFilter, typeFilter]);

  useEffect(() => { loadPage(0); }, []);

  // Search with debounce
  useEffect(() => {
    if (query.trim().length === 0) { loadPage(0); return; }
    if (query.trim().length < 2) return;
    const t = setTimeout(() => {
      setLoading(true);
      searchPatients(query, 50)
        .then((rows) => { setPatients(rows); setTotal(rows.length); setPage(0); })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Reload on filter change
  const applyFilter = (gender, type) => {
    setGender(gender);
    setType(type);
    setQuery('');
    setLoading(true);
    listPatients({ limit: PAGE_SIZE, offset: 0, gender, patient_type: type })
      .then(({ patients: rows, total: t }) => { setPatients(rows); setTotal(t); setPage(0); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const isSearching = query.trim().length >= 2;
  const totalPages  = Math.ceil(total / PAGE_SIZE);

  // Page number buttons (show at most 5)
  const pageButtons = () => {
    const pages = [];
    const start = Math.max(0, page - 2);
    const end   = Math.min(totalPages - 1, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50" dir="rtl">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 px-6 py-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-emerald-700/80" />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
              المرضى
            </h1>
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full min-w-[2rem] text-center">
              {loading ? '…' : total.toLocaleString('ar-SA')}
            </span>
          </div>

          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم، رقم الملف، الجوال..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium">تصفية:</span>

          {/* Gender */}
          {['', 'male', 'female'].map((g) => {
            const label = g === '' ? 'الكل' : GENDER_STYLE[g]?.label;
            const active = genderFilter === g;
            return (
              <button
                key={g || 'all-g'}
                onClick={() => applyFilter(g, typeFilter)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-teal-300 hover:text-teal-600'
                }`}
              >{label}</button>
            );
          })}

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Patient type */}
          {[['', 'كل الأنواع'], ['Normal', 'عادي'], ['Insurance', 'تأمين'], ['VIP', 'VIP']].map(([v, l]) => {
            const active = typeFilter === v;
            return (
              <button
                key={v || 'all-t'}
                onClick={() => applyFilter(genderFilter, v)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-teal-300 hover:text-teal-600'
                }`}
              >{l}</button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              {['المريض', 'رقم الملف', 'الجوال', 'العمر', 'الجنس', 'النوع'].map((h) => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500 tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <SkeletonRows />
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-gray-400 text-sm">
                  <User className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  لا يوجد مرضى
                </td>
              </tr>
            ) : (
              patients.map((p) => {
                const gs = GENDER_STYLE[p.gender?.toLowerCase()];
                const ts = TYPE_STYLE[p.patient_type] || TYPE_STYLE.Normal;
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    className="hover:bg-teal-50/60 cursor-pointer transition-colors group"
                  >
                    {/* Name + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} gender={p.gender} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors truncate">{p.name}</p>
                          {p.english_name && <p className="text-xs text-gray-400 truncate">{p.english_name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{p.mrn || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.mobile || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{p.age ? `${p.age} سنة` : '—'}</td>
                    <td className="px-4 py-3">
                      {gs ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${gs.bg} ${gs.text}`}>
                          {gs.label}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ts.bg} ${ts.text}`}>
                        {ts.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {!isSearching && totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-gray-400">
            عرض {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} من <span className="font-semibold text-gray-600">{total.toLocaleString('ar-SA')}</span> مريض
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => loadPage(0)}
              disabled={page === 0}
              className="px-2 py-1.5 rounded text-xs text-gray-500 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >«</button>
            <button
              onClick={() => loadPage(page - 1)}
              disabled={page === 0}
              className="p-1.5 rounded text-gray-500 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            ><ChevronRight className="w-4 h-4" /></button>

            {pageButtons().map((p2) => (
              <button
                key={p2}
                onClick={() => loadPage(p2)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  p2 === page
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >{p2 + 1}</button>
            ))}

            <button
              onClick={() => loadPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded text-gray-500 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            ><ChevronLeft className="w-4 h-4" /></button>
            <button
              onClick={() => loadPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1.5 rounded text-xs text-gray-500 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >»</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Queue patient detail ────────────────────────────────────────────────────

function QueuePatientDetail({ entry, onBack }) {
  const { patient, visit } = entry;
  const Row = ({ label, value }) => value ? (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  ) : null;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-teal-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-1 h-7 rounded-full bg-emerald-700/80" />
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
            Patient Profile
          </h1>
          <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full ml-2">تسجيل جديد</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-5 space-y-4">
        {/* Patient card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xl flex-shrink-0">
              {patient.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{patient.name}</h2>
              <p className="text-sm text-gray-400">{patient.mrn || "No MRN"} · {patient.mobile}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 border-t border-gray-100 pt-5">
            <Row label="الهوية الوطنية"  value={patient.nationalId} />
            <Row label="تاريخ الميلاد"  value={patient.dob} />
            <Row label="الجنس"          value={patient.gender} />
            <Row label="التأمين"        value={patient.insurance} />
            <Row label="العنوان"        value={patient.address} />
            <Row label="الجوال"         value={patient.mobile} />
          </div>
        </div>

        {/* Visit card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">تفاصيل الزيارة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <Row label="تاريخ الزيارة"  value={visit?.visitDate} />
            <Row label="العيادة"         value={visit?.clinic} />
            <Row label="الطبيب"          value={visit?.doctor} />
            <Row label="نوع الزيارة"     value={visit?.visitType} />
            <Row label="الدفع"           value={visit?.payment} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function PatientInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queuePatients = useAgialStore((s) => s.queuePatients);

  const {
    selectedPatient,
    visits,
    diagnosis, drugAllergies, generalNotes,
    setSelectedPatient,
    setVisits,
  } = useAgialStore();

  const [activeTab, setActiveTab] = useState('visits');

  // Check if this is a queue patient (id starts with "q-")
  const isQueueId = id?.startsWith('q-');
  const queueEntry = isQueueId
    ? queuePatients.find((e) => e.qid === Number(id.slice(2)))
    : null;

  useEffect(() => {
    if (!id || isQueueId) return;
    getPatient(Number(id)).then(setSelectedPatient).catch(() => {});
    getPatientVisits(Number(id)).then(setVisits).catch(() => {});
  }, [id]);

  // No ID → list
  if (!id) {
    return <PatientList onSelect={(pid) => navigate(`/unit/patients/${pid}`)} />;
  }

  // Queue patient → simple detail view
  if (isQueueId && queueEntry) {
    return <QueuePatientDetail entry={queueEntry} onBack={() => navigate('/unit/patients')} />;
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/unit/patients')}
              className="text-gray-400 hover:text-teal-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-1 h-7 rounded-full bg-emerald-700/80" />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
              ملف المريض
            </h1>
          </div>
          <PatientSearchBar onSelect={(pid) => navigate(`/unit/patients/${pid}`)} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
        {selectedPatient && (
          <>
            <PatientHeader patient={selectedPatient} onEdit={() => {}} onNewVisit={() => {}} />

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeTab === 'visits'      && <VisitHistory visits={visits} loading={false} error={null} />}
                {activeTab === 'diagnoses'   && <DiagnosisPanel diagnosis={diagnosis} drugAllergies={drugAllergies} generalNotes={generalNotes} />}
                {activeTab === 'medications' && <ComingSoon label="Medications" />}
                {activeTab === 'lab'         && <ComingSoon label="Lab Results" />}
                {activeTab === 'radiology'   && <ComingSoon label="Radiology" />}
                {activeTab === 'attachments' && <ComingSoon label="Attachments" />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
