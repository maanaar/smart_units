import { useState } from "react";
import BookingTabs from "../components/BookingTabs";
import useAgialStore from "../store";

const genderOptions = ["ذكر", "أنثى"];
const arrivalMethods = ["سيارة إسعاف", "مشي", "سيارة خاصة", "إحالة من مستشفى", "أخرى"];
const triageLevels = [
  "أحمر – حرج (Resuscitation)",
  "برتقالي – طوارئ (Emergency)",
  "أصفر – مستعجل (Urgent)",
  "أخضر – أقل استعجالاً (Less Urgent)",
  "أزرق – غير مستعجل (Non-Urgent)",
];
const financialTypes = ["طوارئ مجاني (أول 48 ساعة)", "نقدي", "تأمين صحي", "نفقة دولة", "تعاقدات"];
const destinations = ["غرفة الفرز (Triage)", "غرفة الطوارئ", "العناية المركزة", "غرفة العمليات", "قسم الملاحظة"];

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function EmergencyPage() {
  const addToQueue = useAgialStore((s) => s.addToQueue);

  const [patient, setPatient] = useState({
    name: "مجهول الهوية / unknown patient", gender: "", companionName: "", companionPhone: "",
  });
  const [triage, setTriage] = useState({
    arrivalTime: now(), arrivalMethod: "", triageLevel: "", chiefComplaint: "",
  });
  const [financial, setFinancial] = useState({
    type: "طوارئ مجاني (أول 48 ساعة)", destination: "غرفة الفرز (Triage)",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    addToQueue({
      patient: { name: patient.name, gender: patient.gender },
      visit: { visitType: "طوارئ", payment: financial.type, triageLevel: triage.triageLevel },
    });
    setSaved(true);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-100 to-blue-50 flex items-start justify-center py-5 px-4 font-sans" dir="rtl">
      <div className="w-full">
        <BookingTabs />

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900 rounded-2xl mt-4">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="text-center py-10 relative overflow-hidden"
            style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">حجز طوارئ</h1>
          </div>
        </div>

        {saved && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              تم تسجيل حالة الطوارئ بنجاح
            </div>
            <button onClick={() => { setSaved(false); setPatient({ name: "مجهول الهوية / unknown patient", gender: "", companionName: "", companionPhone: "" }); }}
              className="text-sm font-bold text-teal-700 hover:text-teal-900 underline underline-offset-2">تسجيل حالة جديدة</button>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">

            {/* ── Left: بيانات مريض الطوارئ السريعة ── */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center justify-end gap-2">
                  بيانات مريض الطوارئ السريعة
                </h2>
              </div>

              <div className="px-6 py-2 bg-blue-50 border-b border-blue-100">
                <p className="text-xs text-blue-700">
                  ℹ يتم تسجيل المريض مبدئياً كـ &quot;مجهول الهوية&quot; لسرعة التوجيه الطبي والعلاج. ويمكن استكمال بيانات الهوية لاحقاً من شاشة ملفات المرضى بعد استقرار الحالة
                </p>
              </div>

              <div className="p-6 space-y-4">
                <Field label="الاسم" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">النوع (الجنس) <span className="text-red-400">*</span></label>
                  <SelectWrap>
                    <select value={patient.gender} onChange={(e) => setPatient({ ...patient, gender: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                      <option value="">اختر</option>
                      {genderOptions.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </SelectWrap>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="اسم المرافق (اختياري)" value={patient.companionName} onChange={(e) => setPatient({ ...patient, companionName: e.target.value })} placeholder="أدخل اسم المرافق للرجوع إليه" />
                  <Field label="رقم هاتف المرافق (اختياري)" value={patient.companionPhone} onChange={(e) => setPatient({ ...patient, companionPhone: e.target.value })} placeholder="رقم للتواصل في حالة الطوارئ" type="tel" />
                </div>
              </div>
            </div>

            {/* ── Right: الوصول والفرز + الماليات ── */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#1f7e74]/80 to-[#13534c]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center justify-end gap-2">
                  الوصول والفرز والماليات
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-1">

                {/* Triage section */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-700">بيانات الوصول والفرز (Triage)</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">وقت الوصول</label>
                        <input type="time" value={triage.arrivalTime} readOnly className={inputCls + " bg-slate-100"} />
                        <p className="text-[10px] text-slate-400 mt-0.5 text-right">(الوقت الحالي)</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">وسيلة الوصول <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={triage.arrivalMethod} onChange={(e) => setTriage({ ...triage, arrivalMethod: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            <option value="">الرجاء الاختيار</option>
                            {arrivalMethods.map((m) => <option key={m}>{m}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">مستوى الفرز المبدئي (Triage Level) <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={triage.triageLevel} onChange={(e) => setTriage({ ...triage, triageLevel: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            <option value="">الرجاء الاختيار</option>
                            {triageLevels.map((l) => <option key={l}>{l}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الشكوى الرئيسية (اختياري)</label>
                      <textarea value={triage.chiefComplaint} onChange={(e) => setTriage({ ...triage, chiefComplaint: e.target.value })}
                        placeholder="وصف مبدئي للشكوى (مثال: ألم بالصدر، حادث...)"
                        className={inputCls + " min-h-[60px] resize-none"} />
                    </div>
                  </div>
                </div>

                {/* Financial section */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-700">التوجيه والماليات (طوارئ)</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">نوع المعاملة المالية <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={financial.type} onChange={(e) => setFinancial({ ...financial, type: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            {financialTypes.map((f) => <option key={f}>{f}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">جهة التوجيه (القوة/السرير) <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={financial.destination} onChange={(e) => setFinancial({ ...financial, destination: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            {destinations.map((d) => <option key={d}>{d}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                    </div>

                    {/* Financial summary */}
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">قيمة تذكرة الطوارئ</p>
                        <p className="text-lg font-bold text-slate-800">0 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">حصة التأمين</p>
                        <p className="text-lg font-bold text-slate-800">0 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">حصة المريض المطلوبة فوراً</p>
                        <p className="text-lg font-bold text-red-600">0 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">
                <button type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2">
                  تسجيل حالة الطوارئ
                </button>
                <button type="button" onClick={() => window.print()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2">
                  طباعة
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Shared UI ── */
const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-slate-50 transition appearance-none";

const dropdownArrow = (
  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

function SelectWrap({ children }) {
  return <div className="relative">{children}{dropdownArrow}</div>;
}

function Field({ label, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={inputCls} />
    </div>
  );
}
