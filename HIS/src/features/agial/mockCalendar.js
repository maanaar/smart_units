const TODAY = new Date().toISOString().slice(0, 10);

// These come from the API in production: fetchCalendarMeta() → { doctors, cycles }
export const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Ahmed Khalil' },
  { id: '2', name: 'Dr. Sara Mansour' },
  { id: '3', name: 'Dr. Omar Hassan' },
  { id: '4', name: 'Dr. Nada Fares' },
  { id: '5', name: 'Dr. Youssef Nabil' },
];

export const MOCK_CYCLES = [
  { id: '1', name: 'IVF',       specialty: 'IVF' },
  { id: '2', name: 'ICSI',      specialty: 'ICSI' },
  { id: '3', name: 'IUI',       specialty: 'IUI' },
  { id: '4', name: 'Retrieval', specialty: 'Retrieval' },
  { id: '5', name: 'FET',       specialty: 'FET' },
];

export const MOCK_EVENTS = [
  // Doctor 1
  { id: '1',  patientName: 'فاطمة أحمد محمود',  doctorId: '1', start: `${TODAY}T08:00:00`, end: `${TODAY}T08:15:00`, status: 'CONFIRMED' },
  { id: '2',  patientName: 'نورهان يوسف',        doctorId: '1', start: `${TODAY}T08:15:00`, end: `${TODAY}T08:30:00`, status: 'ARRIVED' },
  { id: '6',  patientName: 'ريم عبد الله',       doctorId: '1', start: `${TODAY}T09:30:00`, end: `${TODAY}T09:45:00`, status: 'ON_THE_FLY' },
  { id: '11', patientName: 'سمر طارق',           doctorId: '1', start: `${TODAY}T10:30:00`, end: `${TODAY}T10:45:00`, status: 'IN_CHAIR' },
  { id: '12', patientName: 'مروة جمال',          doctorId: '1', start: `${TODAY}T11:30:00`, end: `${TODAY}T11:45:00`, status: 'PAID' },
  // Doctor 2
  { id: '3',  patientName: 'سارة محمد علي',      doctorId: '2', start: `${TODAY}T08:00:00`, end: `${TODAY}T08:15:00`, status: 'IN_CHAIR' },
  { id: '4',  patientName: 'هناء إبراهيم',       doctorId: '2', start: `${TODAY}T09:00:00`, end: `${TODAY}T09:15:00`, status: 'ON_THE_FLY' },
  { id: '8',  patientName: 'دينا عمر',           doctorId: '2', start: `${TODAY}T10:00:00`, end: `${TODAY}T10:15:00`, status: 'IN_PAYMENT' },
  { id: '13', patientName: 'رنا وليد',           doctorId: '2', start: `${TODAY}T12:00:00`, end: `${TODAY}T12:15:00`, status: 'CONFIRMED' },
  // Doctor 3
  { id: '5',  patientName: 'منى حسن سالم',       doctorId: '3', start: `${TODAY}T08:30:00`, end: `${TODAY}T08:45:00`, status: 'PAID' },
  { id: '10', patientName: 'إيمان رضا',          doctorId: '3', start: `${TODAY}T11:00:00`, end: `${TODAY}T11:15:00`, status: 'CLOSED' },
  { id: '14', patientName: 'نهى صلاح',           doctorId: '3', start: `${TODAY}T09:15:00`, end: `${TODAY}T09:30:00`, status: 'ARRIVED' },
  // Doctor 4
  { id: '7',  patientName: 'أمل محمود',          doctorId: '4', start: `${TODAY}T08:00:00`, end: `${TODAY}T08:15:00`, status: 'CONFIRMED' },
  { id: '15', patientName: 'شيماء عادل',         doctorId: '4', start: `${TODAY}T09:00:00`, end: `${TODAY}T09:15:00`, status: 'ON_THE_FLY' },
  { id: '16', patientName: 'ولاء فتحي',          doctorId: '4', start: `${TODAY}T10:30:00`, end: `${TODAY}T10:45:00`, status: 'ARRIVED' },
  // Doctor 5
  { id: '9',  patientName: 'لمياء خالد',         doctorId: '5', start: `${TODAY}T08:45:00`, end: `${TODAY}T09:00:00`, status: 'ARRIVED' },
  { id: '17', patientName: 'غادة منير',          doctorId: '5', start: `${TODAY}T10:00:00`, end: `${TODAY}T10:15:00`, status: 'CONFIRMED' },
  { id: '18', patientName: 'نادية حمدي',         doctorId: '5', start: `${TODAY}T11:30:00`, end: `${TODAY}T11:45:00`, status: 'IN_PAYMENT' },
];
