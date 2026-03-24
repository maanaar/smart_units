export const EGYPT_GOVERNORATES = [
  { value: 'cairo',      label: 'القاهرة'    },
  { value: 'giza',       label: 'الجيزة'     },
  { value: 'alexandria', label: 'الإسكندرية' },
]

export const UNITS_BY_GOVERNORATE = {
  cairo:      ['وحدة القاهرة المركزية', 'وحدة مدينة نصر', 'وحدة شبرا', 'وحدة حلوان', 'وحدة المعادي'],
  giza:       ['وحدة الجيزة المركزية', 'وحدة 6 أكتوبر', 'وحدة الشيخ زايد', 'وحدة الهرم'],
  alexandria: ['وحدة الإسكندرية المركزية', 'وحدة العجمي', 'وحدة برج العرب', 'وحدة المنتزه'],
}

export function getUnits(governorate) {
  if (!governorate) return []
  return (UNITS_BY_GOVERNORATE[governorate] || []).map(u => ({ value: u, label: u }))
}

// ── بيانات لوحة المرضى لكل محافظة ────────────────────────────────────────
const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export const PATIENTS_DATA = {
  default: {
    stats: [
      { title: 'إجمالي المرضى',   stat: '8,637', description: 'جميع المرضى المسجلين'       },
      { title: 'المقبولون اليوم', stat: '201',   description: 'حالات القبول الجديدة اليوم' },
      { title: 'الخارجون اليوم',  stat: '120',   description: 'المرضى الذين خرجوا اليوم'   },
      { title: 'الحالات الحرجة',  stat: '47',    description: 'المرضى في حالة حرجة'        },
    ],
    trend:  DAYS.map((name, i) => ({ name, value: [175,230,152,279,215,101,198][i] })),
    wards:  [{ name:'العناية',value:85},{ name:'الباطنة',value:180},{ name:'الجراحة',value:119},{ name:'الكلى',value:46},{ name:'الصدرية',value:79},{ name:'العظام',value:67}],
    status: [{ name:'مقبول',value:290},{ name:'حرج',value:47},{ name:'خارج',value:120}],
  },
  cairo: {
    stats: [
      { title: 'إجمالي المرضى',   stat: '3,812', description: 'جميع المرضى المسجلين'       },
      { title: 'المقبولون اليوم', stat: '87',    description: 'حالات القبول الجديدة اليوم' },
      { title: 'الخارجون اليوم',  stat: '54',    description: 'المرضى الذين خرجوا اليوم'   },
      { title: 'الحالات الحرجة',  stat: '21',    description: 'المرضى في حالة حرجة'        },
    ],
    trend:  DAYS.map((name, i) => ({ name, value: [72,91,65,110,88,43,79][i] })),
    wards:  [{ name:'العناية',value:35},{ name:'الباطنة',value:72},{ name:'الجراحة',value:48},{ name:'الكلى',value:19},{ name:'الصدرية',value:33},{ name:'العظام',value:28}],
    status: [{ name:'مقبول',value:120},{ name:'حرج',value:21},{ name:'خارج',value:54}],
  },
  giza: {
    stats: [
      { title: 'إجمالي المرضى',   stat: '2,145', description: 'جميع المرضى المسجلين'       },
      { title: 'المقبولون اليوم', stat: '51',    description: 'حالات القبول الجديدة اليوم' },
      { title: 'الخارجون اليوم',  stat: '29',    description: 'المرضى الذين خرجوا اليوم'   },
      { title: 'الحالات الحرجة',  stat: '11',    description: 'المرضى في حالة حرجة'        },
    ],
    trend:  DAYS.map((name, i) => ({ name, value: [45,62,38,74,56,25,53][i] })),
    wards:  [{ name:'العناية',value:22},{ name:'الباطنة',value:48},{ name:'الجراحة',value:31},{ name:'الكلى',value:12},{ name:'الصدرية',value:20},{ name:'العظام',value:17}],
    status: [{ name:'مقبول',value:75},{ name:'حرج',value:11},{ name:'خارج',value:29}],
  },
  alexandria: {
    stats: [
      { title: 'إجمالي المرضى',   stat: '2,680', description: 'جميع المرضى المسجلين'       },
      { title: 'المقبولون اليوم', stat: '63',    description: 'حالات القبول الجديدة اليوم' },
      { title: 'الخارجون اليوم',  stat: '37',    description: 'المرضى الذين خرجوا اليوم'   },
      { title: 'الحالات الحرجة',  stat: '15',    description: 'المرضى في حالة حرجة'        },
    ],
    trend:  DAYS.map((name, i) => ({ name, value: [58,77,49,95,71,33,66][i] })),
    wards:  [{ name:'العناية',value:28},{ name:'الباطنة',value:60},{ name:'الجراحة',value:40},{ name:'الكلى',value:15},{ name:'الصدرية',value:26},{ name:'العظام',value:22}],
    status: [{ name:'مقبول',value:95},{ name:'حرج',value:15},{ name:'خارج',value:37}],
  },
}

// ── بيانات لوحة العمليات لكل محافظة ──────────────────────────────────────
export const OPERATIONS_DATA = {
  default: {
    stats: [
      { key:'total',   stat:'9,360',      description:'إجمالي الإجراءات المطلوبة'            },
      { key:'done',    stat:'7,570',      description:'إجراءات تم تنفيذها'                   },
      { key:'pending', stat:'1,790',      description:'إجراءات قيد الانتظار'                 },
      { key:'top',     stat:'جراحة عامة', description:'أكثر الإجراءات طلباً — ٩٥ هذا الشهر'  },
    ],
    trend:   DAYS.map((name, i) => ({ name, value: [41,58,46,76,63,22,50][i] })),
    clinics: [{ name:'جراحة عامة',value:95},{ name:'عظام',value:62},{ name:'قلب',value:49},{ name:'عيون',value:32},{ name:'أخرى',value:25}],
    status:  [{ name:'مكتمل',value:215},{ name:'قيد الانتظار',value:70},{ name:'ملغى',value:28}],
  },
  cairo: {
    stats: [
      { key:'total',   stat:'4,310',      description:'إجمالي الإجراءات المطلوبة'            },
      { key:'done',    stat:'3,520',      description:'إجراءات تم تنفيذها'                   },
      { key:'pending', stat:'790',        description:'إجراءات قيد الانتظار'                 },
      { key:'top',     stat:'تخطيط قلب', description:'أكثر الإجراءات طلباً — ٤٨٠ هذا الشهر' },
    ],
    trend:   DAYS.map((name, i) => ({ name, value: [18,25,21,34,28,10,22][i] })),
    clinics: [{ name:'جراحة عامة',value:42},{ name:'عظام',value:27},{ name:'قلب',value:21},{ name:'عيون',value:14},{ name:'أخرى',value:11}],
    status:  [{ name:'مكتمل',value:95},{ name:'قيد الانتظار',value:31},{ name:'ملغى',value:12}],
  },
  giza: {
    stats: [
      { key:'total',   stat:'2,180',      description:'إجمالي الإجراءات المطلوبة'            },
      { key:'done',    stat:'1,740',      description:'إجراءات تم تنفيذها'                   },
      { key:'pending', stat:'440',        description:'إجراءات قيد الانتظار'                 },
      { key:'top',     stat:'موجات فوق صوتية', description:'أكثر الإجراءات طلباً — ٢٢٠ هذا الشهر' },
    ],
    trend:   DAYS.map((name, i) => ({ name, value: [10,14,11,18,15,5,12][i] })),
    clinics: [{ name:'جراحة عامة',value:22},{ name:'عظام',value:15},{ name:'قلب',value:12},{ name:'عيون',value:8},{ name:'أخرى',value:6}],
    status:  [{ name:'مكتمل',value:52},{ name:'قيد الانتظار',value:17},{ name:'ملغى',value:7}],
  },
  alexandria: {
    stats: [
      { key:'total',   stat:'2,870',      description:'إجمالي الإجراءات المطلوبة'            },
      { key:'done',    stat:'2,310',      description:'إجراءات تم تنفيذها'                   },
      { key:'pending', stat:'560',        description:'إجراءات قيد الانتظار'                 },
      { key:'top',     stat:'تنظير معدة', description:'أكثر الإجراءات طلباً — ٣١٠ هذا الشهر' },
    ],
    trend:   DAYS.map((name, i) => ({ name, value: [13,19,14,24,20,7,16][i] })),
    clinics: [{ name:'جراحة عامة',value:31},{ name:'عظام',value:20},{ name:'قلب',value:16},{ name:'عيون',value:10},{ name:'أخرى',value:8}],
    status:  [{ name:'مكتمل',value:68},{ name:'قيد الانتظار',value:22},{ name:'ملغى',value:9}],
  },
}

// ── بيانات لوحة الصيدلية لكل محافظة ──────────────────────────────────────
export const PHARMACY_DATA = {
  default: {
    stats: [
      { key:'total',    stat:'26,025',   description:'إجمالي الوصفات الطبية'              },
      { key:'dispensed',stat:'57,350',   description:'الأدوية المصروفة'                   },
      { key:'top',      stat:'Panadol',  description:'أكثر الأدوية استخداماً هذا الشهر'   },
      { key:'alerts',   stat:'88',       description:'تنبيهات مخزون — دواء قارب على النفاد' },
    ],
    trend:    DAYS.map((name, i) => ({ name, value: [292,396,251,452,354,195,329][i] })),
    topDrugs: [{ name:'أموكسيسيلين',value:169},{ name:'إيبوبروفين',value:133},{ name:'ميتفورمين',value:113},{ name:'أتورفاستاتين',value:81},{ name:'أخرى',value:61}],
    status:   [{ name:'تم الصرف',value:332},{ name:'قيد الانتظار',value:123},{ name:'غير متوفر',value:41}],
  },
  cairo: {
    stats: [
      { key:'total',    stat:'11,240',  description:'إجمالي الوصفات الطبية'              },
      { key:'dispensed',stat:'24,800',  description:'الأدوية المصروفة'                   },
      { key:'top',      stat:'Panadol', description:'أكثر الأدوية استخداماً هذا الشهر'   },
      { key:'alerts',   stat:'38',      description:'تنبيهات مخزون — دواء قارب على النفاد' },
    ],
    trend:    DAYS.map((name, i) => ({ name, value: [125,168,107,192,150,84,140][i] })),
    topDrugs: [{ name:'أموكسيسيلين',value:72},{ name:'إيبوبروفين',value:56},{ name:'ميتفورمين',value:48},{ name:'أتورفاستاتين',value:35},{ name:'أخرى',value:27}],
    status:   [{ name:'تم الصرف',value:140},{ name:'قيد الانتظار',value:52},{ name:'غير متوفر',value:18}],
  },
  giza: {
    stats: [
      { key:'total',    stat:'6,315',   description:'إجمالي الوصفات الطبية'              },
      { key:'dispensed',stat:'13,900',  description:'الأدوية المصروفة'                   },
      { key:'top',      stat:'Metformin', description:'أكثر الأدوية استخداماً هذا الشهر' },
      { key:'alerts',   stat:'21',      description:'تنبيهات مخزون — دواء قارب على النفاد' },
    ],
    trend:    DAYS.map((name, i) => ({ name, value: [72,98,62,112,88,48,81][i] })),
    topDrugs: [{ name:'أموكسيسيلين',value:42},{ name:'إيبوبروفين',value:33},{ name:'ميتفورمين',value:28},{ name:'أتورفاستاتين',value:20},{ name:'أخرى',value:15}],
    status:   [{ name:'تم الصرف',value:82},{ name:'قيد الانتظار',value:30},{ name:'غير متوفر',value:10}],
  },
  alexandria: {
    stats: [
      { key:'total',    stat:'8,470',    description:'إجمالي الوصفات الطبية'              },
      { key:'dispensed',stat:'18,650',   description:'الأدوية المصروفة'                   },
      { key:'top',      stat:'Ibuprofen', description:'أكثر الأدوية استخداماً هذا الشهر'  },
      { key:'alerts',   stat:'29',       description:'تنبيهات مخزون — دواء قارب على النفاد' },
    ],
    trend:    DAYS.map((name, i) => ({ name, value: [95,130,82,148,116,63,108][i] })),
    topDrugs: [{ name:'أموكسيسيلين',value:55},{ name:'إيبوبروفين',value:44},{ name:'ميتفورمين',value:37},{ name:'أتورفاستاتين',value:26},{ name:'أخرى',value:19}],
    status:   [{ name:'تم الصرف',value:110},{ name:'قيد الانتظار',value:41},{ name:'غير متوفر',value:13}],
  },
}
