import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ODOO_URL || 'http://localhost:8077';

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Odoo type='json' routes expect JSON-RPC wrapping.
 */
async function call(endpoint, params = {}) {
  const { data } = await client.post(endpoint, {
    jsonrpc: '2.0',
    method: 'call',
    params,
  });
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || 'Request failed');
  }
  return data.result;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function odooLogin(db, login, password) {
  return call('/web/session/authenticate', { db, login, password });
}

// ── Patient ───────────────────────────────────────────────────────────────────

export async function searchPatients(term, limit = 20) {
  const result = await call('/smart_unit/api/patient/search', { term, limit });
  if (result.error) throw new Error(result.error);
  return result.patients;
}

export async function getPatient(patientId) {
  const result = await call(`/smart_unit/api/patient/${patientId}`);
  if (result.error) throw new Error(result.error);
  return result.patient;
}

export async function getPatientVisits(patientId) {
  const result = await call(`/smart_unit/api/patient/${patientId}/visits`);
  if (result.error) throw new Error(result.error);
  return result.visits;
}

// ── Doctors & Clinics ─────────────────────────────────────────────────────────

export async function getDoctors() {
  const result = await call('/smart_unit/api/doctors');
  return result.doctors || [];
}

export async function getClinics(clinicType = '') {
  const result = await call('/smart_unit/api/clinics', { clinic_type: clinicType });
  return result.clinics || [];
}

// ── OPD Bookings ──────────────────────────────────────────────────────────────

export async function createBooking(data) {
  const result = await call('/smart_unit/api/booking/create', data);
  if (result.error) throw new Error(result.error);
  return result;
}

export async function listBookings({ date = '', status = '', limit = 200 } = {}) {
  const result = await call('/smart_unit/api/bookings', { date, status, limit });
  return result.bookings || [];
}

// ── OPD Visit / Consultation ──────────────────────────────────────────────────

export async function createOpdVisit(data) {
  const result = await call('/smart_unit/api/opd/visit/create', data);
  if (result.error) throw new Error(result.error);
  return result;
}

// ── Lab / Rad Requests ────────────────────────────────────────────────────────

export async function createLabRequest(data) {
  const result = await call('/smart_unit/api/lab/create', data);
  if (result.error) throw new Error(result.error);
  return result;
}

export async function createRadRequest(data) {
  const result = await call('/smart_unit/api/rad/create', data);
  if (result.error) throw new Error(result.error);
  return result;
}

export async function listLabRequests({ date = '', patient_id = null, limit = 200 } = {}) {
  const result = await call('/smart_unit/api/lab/list', { date, patient_id, limit });
  return result.lab_requests || [];
}

export async function listRadRequests({ date = '', patient_id = null, limit = 200 } = {}) {
  const result = await call('/smart_unit/api/rad/list', { date, patient_id, limit });
  return result.rad_requests || [];
}

// ── Prescription ──────────────────────────────────────────────────────────────

export async function createPrescription(data) {
  const result = await call('/smart_unit/api/prescription/create', data);
  if (result.error) throw new Error(result.error);
  return result;
}

// ── Nursing Queue ─────────────────────────────────────────────────────────────

export async function getNursingQueue(date = '') {
  const result = await call('/smart_unit/api/nursing/queue', { date });
  return result.queue || [];
}

export async function updateNursingStatus(bookingId, status) {
  const result = await call('/smart_unit/api/nursing/update-status', {
    booking_id: bookingId,
    status,
  });
  if (result.error) throw new Error(result.error);
  return result;
}

// ── Emergency ─────────────────────────────────────────────────────────────────

export async function createEmergency(data) {
  const result = await call('/smart_unit/api/emergency/create', data);
  if (result.error) throw new Error(result.error);
  return result;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export async function getDashboardStats() {
  return call('/smart_unit/api/dashboard/stats');
}

export default {
  searchPatients, getPatient, getPatientVisits,
  getDoctors, getClinics,
  createBooking, listBookings,
  createOpdVisit,
  createLabRequest, createRadRequest, listLabRequests, listRadRequests,
  createPrescription,
  getNursingQueue, updateNursingStatus,
  createEmergency,
  getDashboardStats,
};
