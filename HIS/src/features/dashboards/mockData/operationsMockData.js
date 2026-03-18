export const MOCK_OPERATIONS_STATS = [
  { key: 'total',     stat: '1,245', description: 'إجمالي الإجراءات المطلوبة' },
  { key: 'done',      stat: '980',   description: 'إجراءات تم تنفيذها'        },
  { key: 'pending',   stat: '265',   description: 'إجراءات قيد الانتظار'      },
  { key: 'top',       stat: 'تخطيط قلب', description: 'أكثر الإجراءات طلباً — ١٤٢ هذا الشهر' },
];

export const MOCK_OPERATIONS_LIST = [
  { id: 1, patient: 'أحمد محمود السيد',   mrn: '#PAT-88492', procedure: 'تخطيط قلب كهربائي (ECG)', clinic: 'الباطنة',       doctor: 'د. محمد صالح',    datetime: '١٢ أكتوبر ٢٠٢٣ - ١٠:٣٠ ص', status: ['مكتمل']       },
  { id: 2, patient: 'سارة مصطفى كمال',    mrn: '#PAT-33214', procedure: 'جلسة ليزر علاجي',         clinic: 'الجلدية',        doctor: 'د. ريم عبد الله', datetime: 'اليوم - ١٢:١٥ م',           status: ['قيد الانتظار'] },
  { id: 3, patient: 'محمد عبد الله إبراهيم', mrn: '#PAT-11930', procedure: 'جبيرة وتثبيت كسر',     clinic: 'العظام',         doctor: 'د. طارق حسن',     datetime: '١٥ سبتمبر ٢٠٢٣ - ٠٩:٠٠ ص', status: ['مكتمل']       },
  { id: 4, patient: 'نور علي حسن',         mrn: '#PAT-55421', procedure: 'أشعة موجات فوق صوتية',  clinic: 'النساء والتوليد', doctor: 'د. منى جمال',     datetime: '١٤ أكتوبر ٢٠٢٣ - ١١:٤٥ ص', status: ['ملغى']        },
  { id: 5, patient: 'عمر طارق ياسين',      mrn: '#PAT-99823', procedure: 'غسيل أذن',               clinic: 'الأنف والأذن',   doctor: 'د. هاني شاكر',    datetime: 'أمس - ٠٢:٣٠ م',             status: ['مكتمل']       },
  { id: 6, patient: 'فاطمة أحمد محمود',   mrn: '#PAT-77612', procedure: 'تنظير معدة',              clinic: 'الجهاز الهضمي',  doctor: 'د. سامي الغزالي', datetime: '١٨ مارس ٢٠٢٦ - ٠٨:٠٠ ص',  status: ['قيد الانتظار'] },
  { id: 7, patient: 'خالد ناصر العتيبي',  mrn: '#PAT-44201', procedure: 'غسيل كلى',               clinic: 'الكلى',          doctor: 'د. أحمد رشيد',    datetime: '١٨ مارس ٢٠٢٦ - ١٠:٠٠ ص',  status: ['قيد الانتظار'] },
];
