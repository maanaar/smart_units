import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Loader2, User } from 'lucide-react';

import useAgialStore from '../store';
import { fetchPatient, fetchAllVisits, searchPatients } from '../api';
import PatientHeader from '../components/PatientHeader';
import VisitHistory from '../components/VisitHistory';
import DiagnosisPanel from '../components/DiagnosisPanel';

// ── Tab definitions ────────────────────────────────────────────────────────

const TABS = [
  { id: 'visits',      label: 'Visits History' },
  { id: 'diagnoses',   label: 'Diagnoses' },
  { id: 'medications', label: 'Medications' },
  { id: 'lab',         label: 'Lab Results' },
  { id: 'radiology',   label: 'Radiology' },
  { id: 'attachments', label: 'Attachments' },
];

// ── Placeholder for unbuilt tabs ───────────────────────────────────────────

function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <span className="text-lg">📋</span>
      </div>
      {label} coming soon
    </div>
  );
}

// ── Patient search bar ─────────────────────────────────────────────────────

function PatientSearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 2) { setResults([]); setOpen(false); return; }
    setSearching(true);
    setOpen(true);
    try {
      const data = await searchPatients(val);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const pick = (patient) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    onSelect(patient.id);
  };

  return (
    <div className="relative w-72">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          value={query}
          onChange={handleChange}
          placeholder="Search patient…"
          className="w-full pl-9 pr-8 py-1.5 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-md border border-gray-200 shadow-lg z-20 max-h-56 overflow-y-auto">
          {searching ? (
            <div className="flex items-center justify-center py-5">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-5">No patients found</p>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.mrn} · {p.mobile || '—'}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function PatientInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedPatient,
    patientLoading, patientError,
    visits, visitsLoading, visitsError,
    diagnosis, drugAllergies, generalNotes,
    setSelectedPatient, setPatientLoading, setPatientError,
    setVisits, setVisitsLoading, setVisitsError,
    clearPatient,
  } = useAgialStore();

  const [activeTab, setActiveTab] = useState('visits');

  useEffect(() => {
    if (!id) return;
    loadPatient(Number(id));
  }, [id]);

  async function loadPatient(patientId) {
    clearPatient();
    setPatientLoading(true);
    try {
      const patient = await fetchPatient(patientId);
      if (!patient) throw new Error('Patient not found');
      setSelectedPatient(patient);
    } catch (err) {
      setPatientError(err.message);
    } finally {
      setPatientLoading(false);
    }

    setVisitsLoading(true);
    try {
      const all = await fetchAllVisits(patientId);
      setVisits(all);
    } catch (err) {
      setVisitsError(err.message);
    } finally {
      setVisitsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page title bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Patient Profile Screen</h1>
          <PatientSearchBar onSelect={(pid) => navigate(`/agial/patients/${pid}`)} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-5 space-y-4">

        {/* Loading */}
        {patientLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error */}
        {patientError && (
          <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {patientError}
          </div>
        )}

        {/* Empty state */}
        {!id && !selectedPatient && !patientLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 text-sm">
            <Search className="w-10 h-10 mb-3 opacity-30" />
            Search for a patient using the search bar above
          </div>
        )}

        {/* Patient loaded */}
        {selectedPatient && !patientLoading && (
          <>
            {/* Header card */}
            <PatientHeader
              patient={selectedPatient}
              onEdit={() => {}}
              onNewVisit={() => {}}
            />

            {/* Tabs + content */}
            <div className="bg-white rounded-xl border border-gray-200">
              {/* Tab bar */}
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

              {/* Tab content */}
              <div className="p-4">
                {activeTab === 'visits' && (
                  <VisitHistory
                    visits={visits}
                    loading={visitsLoading}
                    error={visitsError}
                  />
                )}
                {activeTab === 'diagnoses' && (
                  <DiagnosisPanel
                    diagnosis={diagnosis}
                    drugAllergies={drugAllergies}
                    generalNotes={generalNotes}
                  />
                )}
                {activeTab === 'medications'  && <ComingSoon label="Medications" />}
                {activeTab === 'lab'          && <ComingSoon label="Lab Results" />}
                {activeTab === 'radiology'    && <ComingSoon label="Radiology" />}
                {activeTab === 'attachments'  && <ComingSoon label="Attachments" />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
