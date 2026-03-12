import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ← replace with your OCR endpoint
const OCR_ENDPOINT = "/id_scanner";

const genderOptions = ["ذكر", "أنثى"];
const visitTypes = ["جديد", "متابعة", "استشارة"];
const paymentTypes = ["نقدي", "تأمين", "عقد"];

const today = new Date().toISOString().split("T")[0];

export default function ReceptionScreenAR() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    mrn: "", name: "", nationalId: "", mobile: "",
    dob: "", gender: "", insurance: "", address: "",
  });
  const [visit, setVisit] = useState({
    visitDate: today, clinic: "", doctor: "",
    visitType: "جديد", payment: "نقدي",
  });

  const [ocrPreview, setOcrPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const fileInputRef = useRef(null);

  const handlePatient = (e) =>
    setPatient({ ...patient, [e.target.name]: e.target.value });
  const handleVisit = (e) =>
    setVisit({ ...visit, [e.target.name]: e.target.value });

  const handleIdImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrPreview(URL.createObjectURL(file));
    setOcrError("");
  };

  const handleScan = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;
    setOcrLoading(true);
    setOcrError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(OCR_ENDPOINT, { method: "POST", body: form });
      if (!res.ok) throw new Error(`خطأ في الخادم: ${res.status}`);
      const json = await res.json();
      const data = json.extracted_data ?? {};
      setPatient((prev) => ({
        ...prev,
        name:       data.full_name   ?? prev.name,
        nationalId: data.national_id ?? prev.nationalId,
        address:    data.address     ?? prev.address,
      }));
    } catch (err) {
      setOcrError(err.message || "فشل التعرف الضوئي");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleCreateVisit = (e) => {
    e.preventDefault();
    alert("تم إنشاء الزيارة!\n" + JSON.stringify({ patient, visit }, null, 2));
  };

  return (
    <div dir="rtl" className="h-full overflow-y-auto bg-gradient-to-br from-slate-100 to-blue-50 flex items-start justify-center py-5 px-4 font-sans">
      <div className="w-full">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900 rounded-2xl">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />

          <div className="text-center py-10 relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900" style={{
            backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              شاشة الاستقبال
            </h1>
          </div>
        </div>

        <form onSubmit={handleCreateVisit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">

            {/* Patient Search & Registration */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-l from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                  بحث وتسجيل المريض
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <Field label="رقم السجل الطبي" name="mrn" value={patient.mrn} onChange={handlePatient} placeholder="مثال: MRN-00123" />
                <Field label="الاسم" name="name" value={patient.name} onChange={handlePatient} placeholder="الاسم الكامل" required />

                {/* ── ماسح بطاقة الهوية ── */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">مسح بطاقة الهوية الوطنية</p>

                  <div
                    className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 rounded-lg bg-white border border-slate-200 hover:border-teal-400 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {ocrPreview ? (
                      <img src={ocrPreview} alt="معاينة الهوية" className="max-h-32 rounded-lg object-contain" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-xs text-slate-400">انقر لرفع صورة الهوية</span>
                      </>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIdImage}
                  />

                  <button
                    type="button"
                    onClick={handleScan}
                    disabled={!ocrPreview || ocrLoading}
                    className="w-full py-2 rounded-lg text-sm font-semibold bg-teal-600/80 text-white hover:bg-teal-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {ocrLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        جارٍ المسح…
                      </>
                    ) : "مسح وملء الحقول"}
                  </button>

                  {ocrError && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{ocrError}</p>
                  )}
                </div>

                <Field label="الرقم الوطني" name="nationalId" value={patient.nationalId} onChange={handlePatient} placeholder="رقم الهوية الوطنية" />
                <Field label="الجوال" name="mobile" value={patient.mobile} onChange={handlePatient} type="tel" placeholder="+20 1xx xxx xxxx" ltr />

                {/* DOB + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      تاريخ الميلاد
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={patient.dob}
                      onChange={handlePatient}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      الجنس
                    </label>
                    <select name="gender" value={patient.gender} onChange={handlePatient} className={`${inputCls} pr-[30px]`}>
                      <option value="">اختر</option>
                      {genderOptions.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    التأمين
                  </label>
                  <select name="insurance" value={patient.insurance} onChange={handlePatient} className={`${inputCls} pr-[30px]`}>
                    <option value="">— اختر التأمين —</option>
                    <option>تأمين مصر</option>
                    <option>AXA</option>
                    <option>ميتلايف</option>
                    <option>GIG للتأمين</option>
                    <option>أليانز</option>
                  </select>
                </div>

                <Field label="العنوان" name="address" value={patient.address} onChange={handlePatient} placeholder="المدينة، الشارع..." />
              </div>
            </div>

            {/* Visit Registration */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-l from-[#1f7e74]/80 to-[#13534c]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                  تسجيل الزيارة
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    تاريخ الزيارة
                  </label>
                  <input
                    type="date"
                    name="visitDate"
                    value={visit.visitDate}
                    onChange={handleVisit}
                    className={inputCls}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    العيادة
                  </label>
                  <select name="clinic" value={visit.clinic} onChange={handleVisit} className={`${inputCls} pr-[30px]`} required>
                    <option value="">— اختر العيادة —</option>
                    <option>القلب</option>
                    <option>العظام</option>
                    <option>الأعصاب</option>
                    <option>الجلدية</option>
                    <option>طب الأطفال</option>
                    <option>الطب العام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    الطبيب
                  </label>
                  <select name="doctor" value={visit.doctor} onChange={handleVisit} className={`${inputCls} pr-[30px]`} required>
                    <option value="">— اختر الطبيب —</option>
                    <option>د. أحمد حسن</option>
                    <option>د. سارة محمود</option>
                    <option>د. خالد ناصر</option>
                    <option>د. منى إبراهيم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    نوع الزيارة
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {visitTypes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setVisit({ ...visit, visitType: t })}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          visit.visitType === t
                            ? "bg-teal-600/80 text-white border-teal-600/80 shadow"
                            : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    الدفع
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {paymentTypes.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setVisit({ ...visit, payment: p })}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          visit.payment === p
                            ? "bg-teal-600/80 text-white border-teal-600/80 shadow"
                            : "bg-white text-slate-600 border-slate-300 hover:border-teal-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#1c6a60]/80 hover:bg-[#048171]/80 active:scale-95 text-white font-bold py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  إنشاء زيارة
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  طباعة التذكرة
                </button>
                <button
                  type="button"
                  className="flex-1 bg-teal-600/80 hover:bg-teal-700/80 active:scale-95 text-white font-bold py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  إرسال للقائمة
                </button>
              </div>
            </div>
          </div>
        </form>
          <div>
            <button
              type="button"
              onClick={() => navigate("/agial/ReceptionPage")}
              className="mt-6 bg-teal-900/80 text-white hover:bg-teal-700/80 text-base rounded-2xl transition-colors px-6 py-3"
            >
              EN
            </button>
          </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 transition";

function Field({ label, name, value, onChange, type = "text", placeholder = "", required = false, ltr = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        dir={ltr ? "ltr" : "rtl"}
        className={inputCls}
      />
    </div>
  );
}