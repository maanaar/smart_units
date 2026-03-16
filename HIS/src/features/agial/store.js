import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Agial unit store.
 * Holds the currently viewed patient and their loaded data.
 * queuePatients and appointments are persisted to localStorage.
 */
const useAgialStore = create(
  persist(
    (set, get) => ({
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

  // ── Appointments (calendar) ────────────────────────────────────
  appointments: [],  // saved appointments array

  addAppointment: (appt) =>
    set((state) => ({
      appointments: [...state.appointments, { ...appt, id: appt.id || String(Date.now()) }],
    })),

  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  removeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),

  // ── Patients registry (persisted) ──────────────────────────────
  patients: [],  // saved patient records

  upsertPatient: (patient) =>
    set((state) => {
      const key = patient.nationalId || patient.mrn;
      const exists = state.patients.findIndex(
        (p) => (p.nationalId && p.nationalId === patient.nationalId) || (p.mrn && p.mrn === patient.mrn)
      );
      if (exists >= 0) {
        const updated = [...state.patients];
        updated[exists] = { ...updated[exists], ...patient };
        return { patients: updated };
      }
      return { patients: [...state.patients, patient] };
    }),

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
  name: 'agial-store',
  partialize: (state) => ({
    queuePatients: state.queuePatients,
    appointments: state.appointments,
    patients: state.patients,
  }),
}
));

export default useAgialStore;
