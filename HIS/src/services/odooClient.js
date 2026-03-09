import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ODOO_URL || 'https://sys.agialhospital.net';

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Odoo type='json' routes expect JSON-RPC wrapping.
 * Params are passed as the `params` key and Odoo unpacks them as **kw.
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

// ── Auth ────────────────────────────────────────────────────────────────────

export async function odooLogin(db, login, password) {
  return call('/web/session/authenticate', { db, login, password });
}

// ── Smart Unit patient API ──────────────────────────────────────────────────

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

export default { searchPatients, getPatient, getPatientVisits };
