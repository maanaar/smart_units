import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ODOO_URL || 'https://sys.agialhospital.net';

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,        // send Odoo session cookie
});

export async function fetchAppointments(date) {
  const { data } = await http.get(`/agial/calendar/appointments?date=${date}`);
  return data; // { doctors: [], events: [] }
}

export async function fetchCalendarMeta() {
  const { data } = await http.get('/agial/calendar/meta');
  return data; // { cycles: [], doctors: [], patients: [] }
}

export async function fetchDefaultDate() {
  const { data } = await http.get('/agial/calendar/default-date');
  return data.day || '';
}
