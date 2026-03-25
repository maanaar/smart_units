export const MOCK_PHARMACY_STATS = [
  { key: 'total',    stat: '3,842',    description: 'إجمالي الوصفات الطبية'         },
  { key: 'dispensed', stat: '8,420',  description: 'الأدوية المصروفة'               },
  { key: 'top',      stat: 'Paracetamol', description: 'أكثر الأدوية استخداماً هذا الشهر' },
  { key: 'alerts',   stat: '14',      description: 'تنبيهات مخزون — دواء قارب على النفاد' },
];

export const MOCK_PHARMACY_LIST = [
  { id: 1, patient: 'أحمد محمود السيد',      mrn: '#PAT-88492', drug: 'Amoxicillin 500mg',   dose: 'كبسولة كل ٨ ساعات لمدة ٧ أيام',  rx: 'RX-20394', doctor: 'د. محمد صالح',    date: '١٢ أكتوبر ٢٠٢٣',  status: ['تم الصرف']     },
  { id: 2, patient: 'سارة مصطفى كمال',       mrn: '#PAT-33214', drug: 'Metformin 1000mg',    dose: 'قرص مرتين يومياً',                rx: 'RX-20395', doctor: 'د. ريم عبد الله', date: 'اليوم - ١٢:١٥ م',  status: ['قيد الانتظار'] },
  { id: 3, patient: 'محمد عبد الله إبراهيم', mrn: '#PAT-11930', drug: 'Lisinopril 10mg',     dose: 'قرص واحد يومياً في الصباح',        rx: 'RX-20396', doctor: 'د. طارق حسن',     date: '١٥ سبتمبر ٢٠٢٣',  status: ['تم الصرف']     },
  { id: 4, patient: 'نور علي حسن',            mrn: '#PAT-55421', drug: 'Ibuprofen 400mg',     dose: 'قرص عند الألم، لا تتجاوز ٣ مرات', rx: 'RX-20397', doctor: 'د. منى جمال',     date: '١٤ أكتوبر ٢٠٢٣',  status: ['غير متوفر']    },
  { id: 5, patient: 'عمر طارق ياسين',         mrn: '#PAT-99823', drug: 'Salbutamol Inhaler',  dose: 'بخة عند اللزوم، ٦ ساعات على الأقل', rx: 'RX-20398', doctor: 'د. هاني شاكر',   date: 'أمس - ٠٢:٣٠ م',    status: ['تم الصرف']     },
  { id: 6, patient: 'فاطمة أحمد محمود',      mrn: '#PAT-77612', drug: 'Omeprazole 20mg',     dose: 'كبسولة يومياً قبل الإفطار',        rx: 'RX-20399', doctor: 'د. سامي الغزالي', date: '١٨ مارس ٢٠٢٦',    status: ['قيد الانتظار'] },
  { id: 7, patient: 'خالد ناصر العتيبي',     mrn: '#PAT-44201', drug: 'Atorvastatin 40mg',   dose: 'قرص واحد مساءً',                   rx: 'RX-20400', doctor: 'د. أحمد رشيد',    date: '١٨ مارس ٢٠٢٦',    status: ['قيد الانتظار'] },
];
