import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Agial unit store.
 * Holds the currently viewed patient and their loaded data.
 * queuePatients is persisted to localStorage.
 */
const useAgialStore = create(
  persist(
    (set) => ({
  // ── Unit identity ──────────────────────────────────────────────
  unitName: 'Agial Hospital',
  unitCode: 'agial',

  // ── Patient search / selection ─────────────────────────────────
  selectedPatient: null,       // full patient record from Odoo
  patientLoading: false,
  patientError: null,

  // ── Visit history ──────────────────────────────────────────────
  visits: [],
  visitsLoading: false,
  visitsError: null,

  // ── Diagnosis HTML ─────────────────────────────────────────────
  diagnosis: '',
  drugAllergies: '',
  generalNotes: '',

  // ── Reception queue ────────────────────────────────────────────
  queuePatients: [],
  addToQueue: (entry) =>
    set((state) => ({
      queuePatients: [...state.queuePatients, { ...entry, qid: Date.now() }],
    })),
  removeFromQueue: (qid) =>
    set((state) => ({
      queuePatients: state.queuePatients.filter((p) => p.qid !== qid),
    })),
  updateQueueStatus: (qid, status) =>
    set((state) => ({
      queuePatients: state.queuePatients.map((p) =>
        p.qid === qid ? { ...p, _status: status } : p
      ),
    })),

  // ── Actions ────────────────────────────────────────────────────
  setPatientLoading: (loading) => set({ patientLoading: loading }),
  setPatientError:   (err)     => set({ patientError: err }),
  setSelectedPatient: (patient) =>
    set({
      selectedPatient: patient,
      diagnosis: patient?.diagnostic || '',
      drugAllergies: patient?.Drug_Allergies || '',
      generalNotes: patient?.general_notes || '',
      patientError: null,
    }),

  setVisitsLoading: (loading) => set({ visitsLoading: loading }),
  setVisitsError:   (err)     => set({ visitsError: err }),
  setVisits:        (visits)  => set({ visits, visitsError: null }),

  clearPatient: () =>
    set({
      selectedPatient: null,
      visits: [],
      diagnosis: '',
      drugAllergies: '',
      generalNotes: '',
      patientError: null,
      visitsError: null,
    }),
}),
{
  name: 'agial-queue',          // localStorage key
  partialize: (state) => ({ queuePatients: state.queuePatients }),
}
));

export default useAgialStore;
