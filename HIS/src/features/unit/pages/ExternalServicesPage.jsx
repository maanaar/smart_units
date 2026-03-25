import { useState, useRef } from "react";
import BookingTabs from "../components/BookingTabs";
import useAgialStore from "../store";

const OCR_ENDPOINT = "/id_scanner";
const idTypes = ["رقم قومي", "جواز سفر", "رقم الملف الطبي"];
const requestSources = ["مريض خارجي (طبيب من خارج المستشفى)", "إحالة داخلية", "إحالة من مستشفى آخر"];
const serviceDepartments = ["التحاليل الطبية (المعمل)", "الأشعة التشخيصية", "العلاج الطبيعي", "المناظير", "أخرى"];
const servicesByDept = {
  "التحاليل الطبية (المعمل)": ["تحليل سكر تراكمي (HbA1c)", "صورة دم كاملة (CBC)", "وظائف كبد", "وظائف كلى", "تحليل بول"],
  "الأشعة التشخيصية": ["أشعة سينية (X-Ray)", "أشعة مقطعية (CT)", "رنين مغناطيسي (MRI)", "موجات صوتية (Ultrasound)"],
  "العلاج الطبيعي": ["جلسة علاج طبيعي", "جلسة تأهيل", "جلسة كهربائي"],
  "المناظير": ["منظار معدة", "منظار قولون", "منظار مثانة"],
  "أخرى": ["خدمة أخرى"],
};
const patientTypes = ["مريض عادي", "مريض VIP", "مريض تأمين"];
const financialCategories = ["نقدي (تحمل التكلفة كاملة)", "تأمين صحي", "نفقة دولة", "تعاقدات"];
const financialTreatments = ["نقدي صباحي", "نقدي مسائي", "تأمين"];

function dobFromNationalId(nid) {
  if (!nid || nid.length < 7) return "";
  const century = nid[0] === "2" ? "19" : nid[0] === "3" ? "20" : "";
  if (!century) return "";
  const date = `${century}${nid.slice(1, 3)}-${nid.slice(3, 5)}-${nid.slice(5, 7)}`;
  return isNaN(new Date(date).getTime()) ? "" : date;
}

export default function ExternalServicesPage() {
  const upsertPatient = useAgialStore((s) => s.upsertPatient);

  const [patient, setPatient] = useState({
    idType: "رقم قومي", nationalId: "", name: "", gender: "", dob: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [service, setService] = useState({
    requestSource: "", department: "", serviceName: "", executionDate: "", executionTime: "",
  });
  const [financial, setFinancial] = useState({
    patientType: "مريض عادي", category: "نقدي (تحمل التكلفة كاملة)", treatmentType: "نقدي صباحي",
  });
  const [saved, setSaved] = useState(false);

  const [ocrPreview, setOcrPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const fileInputRef = useRef(null);

  const availableServices = servicesByDept[service.department] || [];

  const handleIdImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrPreview(URL.createObjectURL(file));
    setOcrError("");
  };

  const handleScan = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;
    setOcrLoading(true); setOcrError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(OCR_ENDPOINT, { method: "POST", body: form });
      if (!res.ok) throw new Error(`خطأ في السيرفر: ${res.status}`);
      const data = (await res.json()).extracted_data ?? {};
      setPatient((prev) => ({
        ...prev,
        name: data.full_name || prev.name,
        nationalId: data.national_id ?? prev.nationalId,
      }));
    } catch (err) { setOcrError(err.message || "فشل التعرف الضوئي"); }
    finally { setOcrLoading(false); }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (patient.name) upsertPatient({ ...patient, mrn: "" });
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
            <h1 className="text-4xl font-extrabold text-white tracking-tight">حجز خدمات خارجية</h1>
          </div>
        </div>

        {saved && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              تم حجز الخدمة الخارجية بنجاح
            </div>
            <button onClick={() => { setSaved(false); setOcrPreview(null); setOcrError(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="text-sm font-bold text-teal-700 hover:text-teal-900 underline underline-offset-2">حجز خدمة جديدة</button>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">

            {/* ── Left: بيانات المريض ── */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center justify-end gap-2">
                  بيانات المريض
                </h2>
              </div>

              {/* Search */}
              <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100">
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="قم بالبحث عن المريض برقم الهوية أو رقم الملف الطبي لاسترجاع البيانات الأساسية والتحقق من التغطية التأمينية"
                    className={inputCls + " ps-10 bg-white"} />
                  <div className="absolute start-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* OCR Scanner */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">مسح البطاقة الشخصية</p>
                  <div className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 rounded-lg bg-white border border-slate-200 hover:border-teal-400 transition"
                    onClick={() => fileInputRef.current?.click()}>
                    {ocrPreview ? (
                      <img src={ocrPreview} alt="معاينة البطاقة" className="max-h-32 rounded-lg object-contain mx-auto" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-xs text-slate-400">اضغط لرفع صورة البطاقة</span>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleIdImage} />
                  <div className="flex gap-2">
                    <button type="button" onClick={handleScan} disabled={!ocrPreview || ocrLoading}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold bg-teal-600/80 text-white hover:bg-teal-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                      {ocrLoading ? "جاري المسح…" : "مسح وتعبئة البيانات"}
                    </button>
                    {ocrPreview && (
                      <button type="button" onClick={() => { setOcrPreview(null); setOcrError(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-200 text-slate-600 hover:bg-slate-300 transition">
                        إزالة الصورة
                      </button>
                    )}
                  </div>
                  {ocrError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">{ocrError}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">نوع الهوية</label>
                    <SelectWrap>
                      <select value={patient.idType} onChange={(e) => setPatient({ ...patient, idType: e.target.value })} className={`${inputCls} pr-3 pl-9`}>
                        {idTypes.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </SelectWrap>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">رقم الهوية <span className="text-red-400">*</span></label>
                    <input type="text" value={patient.nationalId} onChange={(e) => {
                      const val = e.target.value;
                      const dob = patient.idType === "رقم قومي" ? dobFromNationalId(val) : "";
                      setPatient({ ...patient, nationalId: val, ...(dob ? { dob } : {}) });
                    }} placeholder="أدخل الرقم القومي أو رقم الملف الطبي" required className={inputCls} />
                  </div>
                  <Field label="اسم المريض رباعي" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">تاريخ الميلاد</label>
                    <input type="date" value={patient.dob} onChange={(e) => setPatient({ ...patient, dob: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الجنس</label>
                    <SelectWrap>
                      <select value={patient.gender} onChange={(e) => setPatient({ ...patient, gender: e.target.value })} className={`${inputCls} pr-3 pl-9`}>
                        <option value="">اختر</option>
                        <option>ذكر</option>
                        <option>أنثى</option>
                      </select>
                    </SelectWrap>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: تفاصيل الخدمة + الماليات ── */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#1f7e74]/80 to-[#13534c]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center justify-end gap-2">
                  تفاصيل الخدمة والماليات
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-1">

                {/* Service details */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-700">تفاصيل الخدمة الخارجية</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">جهة الطلب <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={service.requestSource} onChange={(e) => setService({ ...service, requestSource: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            <option value="">الرجاء الاختيار</option>
                            {requestSources.map((r) => <option key={r}>{r}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">نوع الخدمة (القسم) <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={service.department} onChange={(e) => setService({ ...service, department: e.target.value, serviceName: "" })} className={`${inputCls} pr-3 pl-9`} required>
                            <option value="">الرجاء الاختيار</option>
                            {serviceDepartments.map((d) => <option key={d}>{d}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الخدمة المطلوبة <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={service.serviceName} onChange={(e) => setService({ ...service, serviceName: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            <option value="">الرجاء الاختيار</option>
                            {availableServices.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">موعد التنفيذ <span className="text-red-400">*</span></label>
                        <input type="date" value={service.executionDate} onChange={(e) => setService({ ...service, executionDate: e.target.value })} className={inputCls} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">وقت التنفيذ</label>
                        <input type="time" value={service.executionTime} onChange={(e) => setService({ ...service, executionTime: e.target.value })} className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-700">التصنيف والماليات</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">نوع المريض</label>
                        <SelectWrap>
                          <select value={financial.patientType} onChange={(e) => setFinancial({ ...financial, patientType: e.target.value })} className={`${inputCls} pr-3 pl-9`}>
                            {patientTypes.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الفئة المالية <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={financial.category} onChange={(e) => setFinancial({ ...financial, category: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            {financialCategories.map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">نوع المعاملة المالية</label>
                        <SelectWrap>
                          <select value={financial.treatmentType} onChange={(e) => setFinancial({ ...financial, treatmentType: e.target.value })} className={`${inputCls} pr-3 pl-9`}>
                            {financialTreatments.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                    </div>

                    {/* Financial summary */}
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">قيمة الخدمة الأساسية</p>
                        <p className="text-lg font-bold text-slate-800">150 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">حصة التأمين</p>
                        <p className="text-lg font-bold text-slate-800">0 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">حصة المريض المطلوبة للدفع</p>
                        <p className="text-lg font-bold text-red-600">150 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">
                <button type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2">
                  حجز الخدمة الخارجية
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
