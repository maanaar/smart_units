import { useState } from 'react'
import { Users, Stethoscope, AlertTriangle, Repeat } from 'lucide-react'
import DashboardBoxes from '../components/DashboardBoxes'
import Card from '../../dashboards/components/cards'
import MiniChart from '../../dashboards/components/MiniChart'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import LocationFilters from '../../dashboards/components/LocationFilters'
import AlertCard from '../components/alert'
import StatsCards from '../components/services'

/* ───── أولاً: إجمالي زيارات العيادات الخارجية ───── */
const visitStats = [
  { title: 'عدد الزيارات',             stat: '12,450', description: 'عن الشهر الماضي ‎+5.2%', descColor: 'text-emerald-500', icon: <Stethoscope size={20} /> },
  { title: 'عدد المرضى',              stat: '8,320',  description: 'عن الشهر الماضي ‎+2.1%', descColor: 'text-emerald-500', icon: <Users size={20} />       },
  { title: 'حالات الطوارئ',    stat: '412',    description: 'عن الشهر الماضي ‎+12%',  descColor: 'text-red-500',     icon: <AlertTriangle size={20} /> },
  { title: 'معدل التردد (Avg Visits/Patient)', stat: '3.4', description: 'مستقر ٦ شهور',        descColor: 'text-gray-400',    icon: <Repeat size={20} />      },
]

/* ───── التوزيع حسب النوع والجنسية ───── */
const genderData = [
  { name: 'ذكور', value: 48 },
  { name: 'إناث', value: 52 },
]

/* ───── التوزيع حسب الفئات العمرية ───── */
const ageData = [
  { name: 'أقل من ٥', value: 12 },
  { name: '٥ - ١٨', value: 18 },
  { name: '١٩ - ٤٠', value: 35 },
  { name: '٤١ - ٦٠', value: 25 },
  { name: 'أكبر من ٦٠', value: 10 },
]

/* ───── أعلى العيادات تردداً ───── */
const topClinics = [
  { name: 'الباطنة',        value: 3240 },
  { name: 'الأطفال',        value: 2850 },
  { name: 'نساء و توليد',   value: 1920 },
  { name: 'العظام',         value: 1400 },
]

/* ───── ثانياً: خدمات التشخيص (DashboardBoxes) ───── */
const labHeader = 'التحاليل المعملية'
const labContent = [
  { title: 'مطلوبة', number: 8400, color: 'darkslategrey' },
  { title: 'ما تم',  number: 7900, color: 'green' },
  { title: 'لم يتم', number: 500,  color: 'red' },
]
const labText = 'CBC, Lipid Profile, HbA1c :أكثر التحاليل طلباً'

const radHeader = 'خدمات الأشعة'
const radContent = [
  { title: 'مطلوبة', number: 3200, color: 'darkslategrey' },
  { title: 'ما تم',  number: 3050, color: 'green' },
  { title: 'لم يتم', number: 150,  color: 'red' },
]
const radText = 'Chest X-Ray, Abdominal Ultrasound :أكثر الأشعة طلباً'

/* ───── ثالثاً: الإجراءات الطبية ───── */
const procHeader = 'الإجراءات الطبية'
const procContent = [
  { title: 'إجمالي الإجراءات', number: 1450, color: 'darkslategrey' },
  { title: 'ما تم',            number: 1420, color: 'green' },
  { title: 'لم يتم',           number: 30,   color: 'red' },
]
const procText = '(ECG) أكثر الإجراءات طلباً: رسم قلب'

/* ───── رابعاً: التشخيصات (ICD-11) ───── */
const diagnosisItems = [
  { label: 'إجمالي التشخيصات المسجلة', value: '10,800' },
  { label: 'تشخيصات أمراض مزمنة',      value: '4,200', pct: '38%' },
]
const topDiagnoses = ['Hypertension', 'Type 2 Diabetes', 'Gastroenteritis']

/* ───── خامساً: الأدوية والوصفات ───── */
const medHeader = 'الأدوية والوصفات الطبية'
const medContent = [
  { title: 'الأدوية المصروفة', number: 9600,  color: 'darkslategrey' },
  { title: 'إجمالي الوصفات',  number: 22400, color: 'green' },
]
const medText = 'Paracetamol, Amoxicillin, Metformin :أكثر الأدوية استخداماً'

/* ───── سادساً: مؤشرات زمن الانتظار ───── */
const waitStats = [
  { label: 'متوسط الانتظار الفعلي', value: '32', unit: 'دقيقة' },
  { label: 'أعلى انتظار (المنشأة)', value: '55', unit: 'دقيقة', highlight: true },
]

/* ───── سابعاً: مؤشرات أداء الأطباء ───── */
const doctorKPIs = [
  { label: 'متوسط عدد المرضى يومياً / طبيب', value: '28' },
  { label: 'متوسط زمن الكشف',                value: '12 دقيقة' },
  { label: 'إجمالي الكشوفات المسجلة بالنظام', value: '12,450' },
]
const alerts = [
  {
    id: 1,
    type: "outbreak",
    severity: "critical",
    titleAr: "تفشٍّ محتمل (Possible Outbreak)",
    subtitleAr: "Gastroenteritis",
    detailAr: "خلال 3 أيار 27 - بمنطقة السلام (El Salam)",
    icon: "⚠️",
    bg: "from-red-600 to-red-700",
    border: "border-red-400",
    badge: "bg-red-900/40 text-red-200",
    badgeText: "حرج",
    pulse: true,
  },
  {
    id: 2,
    type: "waiting",
    severity: "warning",
    titleAr: "وقت انتظار مرتفع (High Waiting Time)",
    subtitleAr: "",
    detailAr: "متوسط الطاولة الفردي: متوسط الانتظار > 45 دقيقة حالياً",
    icon: "🕐",
    bg: "from-orange-500 to-orange-600",
    border: "border-orange-400",
    badge: "bg-orange-900/40 text-orange-200",
    badgeText: "تحذير",
    pulse: false,
  },
];

export default function OperationInternal() {
  const [date, setDate] = useState('')
  return (
    <div dir="rtl" className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Header */}
      <DashboardHeader
        title="مؤشرات أداء العيادات الخارجية"
        addLabel="تصدير التقرير"
        dateValue={date}
        onDateChange={setDate}
        onAdd={() => {}}
        filters={<LocationFilters />}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <AlertCard alerts={alerts} />
        <StatsCards/>
        {/* ══════ أولاً: إجمالي الزيارات ══════ */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">أولاً: إجمالي زيارات العيادات الخارجية 👥</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visitStats.map((s) => (
              <Card key={s.title} title={s.title} stat={s.stat} description={s.description} descriptionColor={s.descColor} icon={s.icon} />
            ))}
          </div>
        </section>

        {/* ── التوزيعات + أعلى العيادات ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniChart title="التوزيع حسب النوع والجنسية" type="pie" data={genderData} dataKey="value" nameKey="name" />
          <MiniChart title="التوزيع حسب الفئات العمرية" type="bar" data={ageData} dataKey="value" nameKey="name" color="#3b82f6" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-600 mb-4">أعلى العيادات والتخصصات تردداً</p>
            <div className="space-y-3">
              {topClinics.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{c.value.toLocaleString()}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {Math.round((c.value / 12450) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ ثانياً: خدمات التشخيص ══════ */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">ثانياً: إجمالي خدمات التشخيص</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardBoxes header={labHeader} content={labContent} text={labText} />
            <DashboardBoxes header={radHeader} content={radContent} text={radText} />
          </div>
        </section>

        {/* ══════ ثالثاً ورابعاً: الإجراءات والتشخيصات ══════ */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">ثالثاً ورابعاً: الإجراءات والتشخيصات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardBoxes header={procHeader} content={procContent} text={procText} />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">التشخيصات المرضية (ICD-11)</h3>
              <div className="space-y-3">
                {diagnosisItems.map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{d.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">{d.value}</span>
                      {d.pct && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{d.pct}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">أكثر التشخيصات شيوعاً</p>
                <div className="flex flex-wrap gap-2">
                  {topDiagnoses.map((d) => (
                    <span key={d} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ خامساً: الأدوية ══════ */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">خامساً: الأدوية والوصفات الطبية</h2>
          <DashboardBoxes header={medHeader} content={medContent} text={medText} />
        </section>

        {/* ══════ سادساً وسابعاً: الأداء وزمن الانتظار ══════ */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">سادساً وسابعاً: الأداء وزمن الانتظار</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Waiting time */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">مؤشرات زمن الانتظار</h3>
              <div className="grid grid-cols-2 gap-6">
                {waitStats.map((w) => (
                  <div key={w.label} className="text-center">
                    <p className="text-xs text-gray-500 mb-2">{w.label}</p>
                    <p className={`text-3xl font-bold ${w.highlight ? 'text-red-500' : 'text-gray-800'}`}>{w.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{w.unit}</p>
                  </div>
                ))}
              </div>
            </div>
            <StatsCards/>
            {/* Doctor KPIs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">(Doctor KPIs) مؤشرات أداء الأطباء</h3>
              <div className="space-y-4">
                {doctorKPIs.map((k) => (
                  <div key={k.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{k.label}</span>
                    <span className="text-lg font-bold text-gray-800">{k.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
