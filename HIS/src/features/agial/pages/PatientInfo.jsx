import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, User } from 'lucide-react';

import useAgialStore from '../store';
import { MOCK_PATIENT, MOCK_VISITS, MOCK_PATIENTS_LIST } from '../mockData';
import PatientHeader from '../components/PatientHeader';
import VisitHistory from '../components/VisitHistory';
import DiagnosisPanel from '../components/DiagnosisPanel';

const TABS = [
  { id: 'visits',      label: 'Visits History' },
  { id: 'diagnoses',   label: 'Diagnoses' },
  { id: 'medications', label: 'Medications' },
  { id: 'lab',         label: 'Lab Results' },
  { id: 'radiology',   label: 'Radiology' },
  { id: 'attachments', label: 'Attachments' },
];

function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <span className="text-lg">📋</span>
      </div>
      {label} — coming soon
    </div>
  );
}

// ── Search bar (filters mock list) ─────────────────────────────────────────

function PatientSearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);

  const results = query.trim().length >= 1
    ? MOCK_PATIENTS_LIST.filter((p) =>
        p.name.includes(query) ||
        p.english_name.toLowerCase().includes(query.toLowerCase()) ||
        p.mrn.toLowerCase().includes(query.toLowerCase()) ||
        p.mobile.includes(query)
      )
    : [];

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
          placeholder="Search patient…"
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

// ── Patient List ────────────────────────────────────────────────────────────

function PatientList({ onSelect }) {
  const [query, setQuery] = useState('');

  const filtered = MOCK_PATIENTS_LIST.filter((p) =>
    p.name.includes(query) ||
    p.english_name.toLowerCase().includes(query.toLowerCase()) ||
    p.mrn.toLowerCase().includes(query.toLowerCase()) ||
    p.mobile.includes(query)
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-emerald-700/80" />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
              Patients
            </h1>
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, MRN, mobile…"
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-5xl mx-auto px-6 py-5 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No patients found</div>
        )}
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-teal-400 hover:shadow-sm transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{p.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.english_name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-mono font-medium text-gray-600">{p.mrn}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.mobile}</p>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function PatientInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedPatient,
    visits,
    diagnosis, drugAllergies, generalNotes,
    setSelectedPatient,
    setVisits,
  } = useAgialStore();

  const [activeTab, setActiveTab] = useState('visits');

  useEffect(() => {
    if (!id) return;
    const match = MOCK_PATIENTS_LIST.find((p) => p.id === Number(id));
    setSelectedPatient(match ? { ...MOCK_PATIENT, ...match } : MOCK_PATIENT);
    setVisits(MOCK_VISITS);
  }, [id]);

  // No ID selected → show patient list
  if (!id) {
    return <PatientList onSelect={(pid) => navigate(`/agial/patients/${pid}`)} />;
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/agial/patients')}
              className="text-gray-400 hover:text-teal-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-1 h-7 rounded-full bg-emerald-700/80" />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
              Patient Profile
            </h1>
          </div>
          <PatientSearchBar onSelect={(pid) => navigate(`/agial/patients/${pid}`)} />
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
