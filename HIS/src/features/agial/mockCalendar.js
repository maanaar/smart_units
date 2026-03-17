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
  { id: '1',  patientName: 'فاطمة أحمد محمود',  doctorId: '1', start: `${TODAY}T08:00:00`, end: `${TODAY}T08:15:00`, status: 'CONFIRMED',
    patient: { mrn: 'F001234', name: 'فاطمة أحمد محمود', nationalId: '29206140100123', mobile: '01012345678', dob: '1992-06-14', gender: 'Female', insurance: 'GlobeMed Egypt', address: '15 شارع النيل، المعادي، القاهرة' },
    visit: { clinic: 'General Medicine', visitType: 'Follow-up', payment: 'Insurance' } },
  { id: '2',  patientName: 'نورهان يوسف',        doctorId: '1', start: `${TODAY}T08:15:00`, end: `${TODAY}T08:30:00`, status: 'ARRIVED',
    patient: { mrn: 'F001236', name: 'نورهان يوسف', nationalId: '29503220200456', mobile: '01123456789', dob: '1995-03-22', gender: 'Female', insurance: 'AXA', address: 'الإسكندرية، سموحة' },
    visit: { clinic: 'Cardiology', visitType: 'New', payment: 'Insurance' } },
  { id: '6',  patientName: 'ريم عبد الله',       doctorId: '1', start: `${TODAY}T09:30:00`, end: `${TODAY}T09:45:00`, status: 'ON_THE_FLY',
    patient: { mrn: '', name: 'ريم عبد الله', nationalId: '', mobile: '01055512345', dob: '', gender: 'Female', insurance: '', address: '' },
    visit: { clinic: 'General Medicine', visitType: 'New', payment: 'Cash' } },
  { id: '11', patientName: 'سمر طارق',           doctorId: '1', start: `${TODAY}T10:30:00`, end: `${TODAY}T10:45:00`, status: 'IN_CHAIR',
    patient: { mrn: 'M002001', name: 'سمر طارق', nationalId: '29001150300789', mobile: '01234500001', dob: '1990-01-15', gender: 'Female', insurance: 'MetLife', address: 'الجيزة، الدقي' },
    visit: { clinic: 'Dermatology', visitType: 'Follow-up', payment: 'Insurance' } },
  { id: '12', patientName: 'مروة جمال',          doctorId: '1', start: `${TODAY}T11:30:00`, end: `${TODAY}T11:45:00`, status: 'PAID',
    patient: { mrn: 'M002002', name: 'مروة جمال', nationalId: '28812100400321', mobile: '01098700002', dob: '1988-12-10', gender: 'Female', insurance: '', address: 'القاهرة، مصر الجديدة' },
    visit: { clinic: 'Orthopedics', visitType: 'Consultation', payment: 'Cash' } },
  // Doctor 2
  { id: '3',  patientName: 'سارة محمد علي',      doctorId: '2', start: `${TODAY}T08:00:00`, end: `${TODAY}T08:15:00`, status: 'IN_CHAIR',
    patient: { mrn: 'F002010', name: 'سارة محمد علي', nationalId: '29107080500654', mobile: '01155500003', dob: '1991-07-08', gender: 'Female', insurance: 'Allianz', address: 'القاهرة، المهندسين' },
    visit: { clinic: 'Neurology', visitType: 'Follow-up', payment: 'Insurance' } },
  { id: '4',  patientName: 'هناء إبراهيم',       doctorId: '2', start: `${TODAY}T09:00:00`, end: `${TODAY}T09:15:00`, status: 'ON_THE_FLY',
    patient: { mrn: '', name: 'هناء إبراهيم', nationalId: '', mobile: '01200012345', dob: '', gender: 'Female', insurance: '', address: '' },
    visit: { clinic: 'Pediatrics', visitType: 'New', payment: 'Cash' } },
  { id: '8',  patientName: 'دينا عمر',           doctorId: '2', start: `${TODAY}T10:00:00`, end: `${TODAY}T10:15:00`, status: 'IN_PAYMENT',
    patient: { mrn: 'F002020', name: 'دينا عمر', nationalId: '29305200600987', mobile: '01033300004', dob: '1993-05-20', gender: 'Female', insurance: 'GIG Insurance', address: 'الإسكندرية، ستانلي' },
    visit: { clinic: 'General Medicine', visitType: 'Follow-up', payment: 'Insurance' } },
  { id: '13', patientName: 'رنا وليد',           doctorId: '2', start: `${TODAY}T12:00:00`, end: `${TODAY}T12:15:00`, status: 'CONFIRMED',
    patient: { mrn: 'F002030', name: 'رنا وليد', nationalId: '29608150700111', mobile: '01177700005', dob: '1996-08-15', gender: 'Female', insurance: 'Misr Insurance', address: 'طنطا، شارع الجيش' },
    visit: { clinic: 'Cardiology', visitType: 'New', payment: 'Insurance' } },
  // Doctor 3
  { id: '5',  patientName: 'منى حسن سالم',       doctorId: '3', start: `${TODAY}T08:30:00`, end: `${TODAY}T08:45:00`, status: 'PAID',
    patient: { mrn: 'F003010', name: 'منى حسن سالم', nationalId: '28504120800222', mobile: '01099900006', dob: '1985-04-12', gender: 'Female', insurance: 'AXA', address: 'القاهرة، حلوان' },
    visit: { clinic: 'Orthopedics', visitType: 'Consultation', payment: 'Insurance' } },
  { id: '10', patientName: 'إيمان رضا',          doctorId: '3', start: `${TODAY}T11:00:00`, end: `${TODAY}T11:15:00`, status: 'CLOSED',
    patient: { mrn: 'F003020', name: 'إيمان رضا', nationalId: '29209250900333', mobile: '01222200007', dob: '1992-09-25', gender: 'Female', insurance: '', address: 'المنصورة، شارع الجمهورية' },
    visit: { clinic: 'Dermatology', visitType: 'Follow-up', payment: 'Cash' } },
  { id: '14', patientName: 'نهى صلاح',           doctorId: '3', start: `${TODAY}T09:15:00`, end: `${TODAY}T09:30:00`, status: 'ARRIVED',
    patient: { mrn: 'F003030', name: 'نهى صلاح', nationalId: '29711301000444', mobile: '01500100008', dob: '1997-11-30', gender: 'Female', insurance: 'MetLife', address: 'الزقازيق، شارع أحمد عرابي' },
    visit: { clinic: 'Neurology', visitType: 'New', payment: 'Insurance' } },
  // Doctor 4
  { id: '7',  patientName: 'أمل محمود',          doctorId: '4', start: `${TODAY}T08:00:00`, end: `${TODAY}T08:15:00`, status: 'CONFIRMED',
    patient: { mrn: 'F004010', name: 'أمل محمود', nationalId: '28901051100555', mobile: '01066600009', dob: '1989-01-05', gender: 'Female', insurance: 'Allianz', address: 'أسيوط، شارع الثورة' },
    visit: { clinic: 'General Medicine', visitType: 'Follow-up', payment: 'Insurance' } },
  { id: '15', patientName: 'شيماء عادل',         doctorId: '4', start: `${TODAY}T09:00:00`, end: `${TODAY}T09:15:00`, status: 'ON_THE_FLY',
    patient: { mrn: '', name: 'شيماء عادل', nationalId: '', mobile: '01144400010', dob: '', gender: 'Female', insurance: '', address: '' },
    visit: { clinic: 'Pediatrics', visitType: 'New', payment: 'Cash' } },
  { id: '16', patientName: 'ولاء فتحي',          doctorId: '4', start: `${TODAY}T10:30:00`, end: `${TODAY}T10:45:00`, status: 'ARRIVED',
    patient: { mrn: 'F004020', name: 'ولاء فتحي', nationalId: '29406181200666', mobile: '01288800011', dob: '1994-06-18', gender: 'Female', insurance: 'GIG Insurance', address: 'بني سويف، شارع صلاح سالم' },
    visit: { clinic: 'Cardiology', visitType: 'Consultation', payment: 'Insurance' } },
  // Doctor 5
  { id: '9',  patientName: 'لمياء خالد',         doctorId: '5', start: `${TODAY}T08:45:00`, end: `${TODAY}T09:00:00`, status: 'ARRIVED',
    patient: { mrn: 'F005010', name: 'لمياء خالد', nationalId: '29102031300777', mobile: '01355500012', dob: '1991-02-03', gender: 'Female', insurance: 'Misr Insurance', address: 'الأقصر، شارع خالد بن الوليد' },
    visit: { clinic: 'Orthopedics', visitType: 'Follow-up', payment: 'Insurance' } },
  { id: '17', patientName: 'غادة منير',          doctorId: '5', start: `${TODAY}T10:00:00`, end: `${TODAY}T10:15:00`, status: 'CONFIRMED',
    patient: { mrn: 'F005020', name: 'غادة منير', nationalId: '28708141400888', mobile: '01011100013', dob: '1987-08-14', gender: 'Female', insurance: '', address: 'أسوان، كورنيش النيل' },
    visit: { clinic: 'Dermatology', visitType: 'New', payment: 'Cash' } },
  { id: '18', patientName: 'نادية حمدي',         doctorId: '5', start: `${TODAY}T11:30:00`, end: `${TODAY}T11:45:00`, status: 'IN_PAYMENT',
    patient: { mrn: 'F005030', name: 'نادية حمدي', nationalId: '29003261500999', mobile: '01577700014', dob: '1990-03-26', gender: 'Female', insurance: 'AXA', address: 'الإسماعيلية، حي الشيخ زايد' },
    visit: { clinic: 'General Medicine', visitType: 'Follow-up', payment: 'Insurance' } },
];
