import { create } from 'zustand';

/**
 * Agial unit store.
 * Holds the currently viewed patient and their loaded data.
 */
const useAgialStore = create((set) => ({
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
}));

export default useAgialStore;
