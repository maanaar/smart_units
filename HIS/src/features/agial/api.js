import { searchPatients, getPatient, getPatientVisits } from '../../services/odooClient';

export { searchPatients, getPatient as fetchPatient };

export async function fetchAllVisits(patientId) {
  return getPatientVisits(patientId);
}
