import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAgialStore from "../store";
import { MOCK_DOCTORS } from "../mockCalendar";

const OCR_ENDPOINT = "/id_scanner";

const genderOptions = ["ذكر", "أنثى"];
const visitTypes = ["جديد", "متابعة", "استشارة"];
const paymentTypes = ["نقدي", "تأمين صحي", "نفقة دولة", "تعاقدات", "مجاني"];
const contractEntities = [
  "هيئة الشرطة", "القوات المسلحة", "وزارة الصحة", "الأزهر الشريف",
  "وزارة التعليم العالي", "وزارة التضامن", "جهة أخرى",
];
const clinics = ["قلب", "عظام", "أعصاب", "جلدية", "أطفال", "باطنة"];
const specialties = [
  "طب عام", "باطنة", "قلب وأوعية دموية", "جراحة عامة", "عظام", "مخ وأعصاب",
  "أنف وأذن وحنجرة", "عيون", "جلدية", "أطفال", "نساء وتوليد",
  "مسالك بولية", "أسنان", "طب طوارئ", "تخدير وعناية مركزة", "أشعة", "معامل",
];
const insuranceOptions = ["مصر للتأمين", "AXA", "MetLife", "GIG", "Allianz", "GlobeMed"];
const nationalities = [
  "سعودي", "إماراتي", "كويتي", "بحريني", "عماني", "قطري",
  "أردني", "لبناني", "سوري", "فلسطيني", "عراقي", "يمني", "ليبي", "تونسي", "جزائري", "مغربي", "سوداني",
  "أمريكي", "بريطاني", "فرنسي", "ألماني", "إيطالي", "كندي", "أسترالي",
  "هندي", "باكستاني", "بنغالي", "فلبيني", "إندونيسي", "صيني", "تركي", "نيجيري", "إثيوبي",
  "أخرى",
];

const today = new Date().toISOString().split("T")[0];

export default function ReceptionScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const addToQueue = useAgialStore((s) => s.addToQueue);
  const addAppointment = useAgialStore((s) => s.addAppointment);
  const updateAppointment = useAgialStore((s) => s.updateAppointment);
  const upsertPatient = useAgialStore((s) => s.upsertPatient);

  // Route state from calendar or appointments list
  const slotData = location.state?.slot || null;
  const isEditing = !!slotData?.event;

  const [patient, setPatient] = useState({
    mrn: "", name: "", nationalId: "", mobile: "",
    dob: "", gender: "", insurance: "", address: "",
  });
  const [visit, setVisit] = useState({
    visitDate: today, clinic: "", doctor: "", specialty: "",
    visitType: "جديد", payment: "نقدي",
  });
  // Financial fields for payment types
  const [financial, setFinancial] = useState({
    adminLetterNo: "",   // رقم الخطاب الاداري (insurance / contracts)
    issuingAuthority: "", // جهة الاصدار
    decisionNo: "",       // رقم القرار (state expense)
    decisionCode: "",     // كود القرار
    decisionAmount: "",   // قيمة القرار المالية
    decisionDate: "",     // تاريخ القرار
    contractEntity: "",   // جهة التعاقد
    attachmentFile: null,  // إرفاق صورة
  });
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const attachmentRef = useRef(null);

  const handleFinancial = (e) =>
    setFinancial({ ...financial, [e.target.name]: e.target.value });

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFinancial({ ...financial, attachmentFile: file });
    setAttachmentPreview(URL.createObjectURL(file));
  };

  const [saved, setSaved] = useState(false);

  // Patient type: null | 'foreigner' | 'unknown' | 'baby'
  const [patientType, setPatientType] = useState(null);
  const [nationality, setNationality] = useState("");

  const isForeigner = patientType === 'foreigner';
  const isUnknown = patientType === 'unknown';
  const isBaby = patientType === 'baby';

  const toggleType = (type) => setPatientType(prev => prev === type ? null : type);

  const nameRequired = !isUnknown && !isBaby;
  const idRequired = !isUnknown && !isBaby && !isForeigner;

  const [ocrPreview, setOcrPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const fileInputRef = useRef(null);

  // Pre-fill from route state
  useEffect(() => {
    if (!slotData) return;

    if (slotData.event) {
      const ev = slotData.event;
      setPatient({
        mrn: ev.patient?.mrn || "",
        name: ev.patient?.name || ev.patientName || "",
        nationalId: ev.patient?.nationalId || "",
        mobile: ev.patient?.mobile || "",
        dob: ev.patient?.dob || "",
        gender: ev.patient?.gender || "",
        insurance: ev.patient?.insurance || "",
        address: ev.patient?.address || "",
      });
      const doctorName = MOCK_DOCTORS.find(d => d.id === ev.doctorId)?.name || "";
      setVisit({
        visitDate: ev.start?.slice(0, 10) || today,
        clinic: ev.visit?.clinic || "",
        doctor: doctorName,
        specialty: ev.visit?.specialty || "",
        visitType: ev.visit?.visitType || "متابعة",
        payment: ev.visit?.payment || "نقدي",
      });
    } else {
      // Empty slot
      setPatient({ mrn: "", name: "", nationalId: "", mobile: "", dob: "", gender: "", insurance: "", address: "" });
      setVisit({
        visitDate: slotData.date || today,
        clinic: "",
        doctor: slotData.doctor?.name || "",
        specialty: "",
        visitType: "جديد",
        payment: "نقدي",
      });
    }
  }, [slotData]);

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
      if (!res.ok) throw new Error(`خطأ في السيرفر: ${res.status}`);
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

  const buildAppointment = () => {
    const startTime = slotData?.time || "08:00";
    const [sh, sm] = startTime.split(":").map(Number);
    const endH = sm + 15 >= 60 ? sh + 1 : sh;
    const endM = (sm + 15) % 60;
    const dateStr = visit.visitDate;
    const doctorObj = MOCK_DOCTORS.find(d => d.name === visit.doctor) || slotData?.doctor;

    return {
      id: slotData?.event?.id || String(Date.now()),
      patientName: patient.name,
      doctorId: doctorObj?.id || "",
      start: `${dateStr}T${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}:00`,
      end: `${dateStr}T${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`,
      status: "CONFIRMED",
      patient: { ...patient, isForeigner, isUnknown, isBaby, nationality: isForeigner ? nationality : "" },
      visit: { clinic: visit.clinic, visitType: visit.visitType, payment: visit.payment },
    };
  };

  const handleSave = (e) => {
    e.preventDefault();
    const appt = buildAppointment();
    if (patient.name) upsertPatient(patient);
    if (isEditing) {
      updateAppointment(slotData.event.id, appt);
    } else {
      addAppointment(appt);
    }
    setSaved(true);
  };

  const handleSendToQueue = () => {
    const appt = buildAppointment();
    if (patient.name) upsertPatient(patient);
    if (isEditing) {
      updateAppointment(slotData.event.id, appt);
    } else {
      addAppointment(appt);
    }
    addToQueue({ patient, visit });
    setSaved(true);
  };

  const handleBackToCalendar = () => {
    navigate("/unit/calendar");
  };

  return (
    <div dir="rtl" className="h-full overflow-y-auto bg-gradient-to-br from-slate-100 to-blue-50 flex items-start justify-center py-5 px-4 font-sans">
      <div className="w-full">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900 rounded-2xl">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />

          <div
            className="text-center py-10 relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          >
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              {isEditing ? "تعديل موعد" : "شاشة الاستقبال"}
            </h1>
            {slotData && (
              <p className="text-teal-300/80 text-sm mt-2">
                {slotData.doctor?.name && `${slotData.doctor.name} · `}
                {slotData.time && `${slotData.time} · `}
                {slotData.date || ""}
              </p>
            )}
          </div>
        </div>

        {/* Success banner */}
        {saved && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              تم الحفظ بنجاح — تم تحديث بيانات الموعد والمريض
            </div>
            <button
              onClick={handleBackToCalendar}
              className="text-sm font-bold text-teal-700 hover:text-teal-900 underline underline-offset-2"
            >
              العودة للتقويم
            </button>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">

            {/* Patient Search & Registration */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                  بحث وتسجيل المريض
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {/* ── Patient type flags ── */}
                <div className="flex flex-wrap gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <Checkbox label="أجنبي" checked={isForeigner} onChange={() => toggleType('foreigner')} color="blue" />
                  <Checkbox label="مجهول الهوية" checked={isUnknown} onChange={() => toggleType('unknown')} color="amber" />
                  <Checkbox label="طفل" checked={isBaby} onChange={() => toggleType('baby')} color="pink" />
                </div>

                <Field label="رقم الملف الطبي" name="mrn" value={patient.mrn} onChange={handlePatient} placeholder="مثال: MRN-00123" />
                <Field label="الاسم الكامل" name="name" value={patient.name} onChange={handlePatient} placeholder={isUnknown ? "مجهول" : isBaby ? "اسم الطفل (اختياري)" : "اسم المريض"} required={nameRequired} />

                {/* Nationality (foreigner only) */}
                {isForeigner && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الجنسية <span className="text-red-400">*</span></label>
                    <SelectWrap>
                      <select value={nationality} onChange={(e) => setNationality(e.target.value)} className={`${inputCls} pe-3 ps-9`} required>
                        <option value="">— اختر الجنسية —</option>
                        {nationalities.map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </SelectWrap>
                  </div>
                )}

                {/* ── ID Card OCR Scanner ── */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">مسح البطاقة الشخصية</p>

                  <div
                    className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 rounded-lg bg-white border border-slate-200 hover:border-teal-400 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {ocrPreview ? (
                      <img src={ocrPreview} alt="معاينة البطاقة" className="max-h-32 rounded-lg object-contain" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-xs text-slate-400">اضغط لرفع صورة البطاقة</span>
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
                        جاري المسح…
                      </>
                    ) : "مسح وتعبئة البيانات"}
                  </button>

                  {ocrError && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{ocrError}</p>
                  )}
                </div>

                {isForeigner ? (
                  <Field label="رقم جواز السفر" name="nationalId" value={patient.nationalId} onChange={handlePatient} placeholder="رقم جواز السفر" required />
                ) : (
                  <Field label="الرقم القومي" name="nationalId" value={patient.nationalId} onChange={handlePatient} placeholder="الرقم القومي" required={idRequired} />
                )}
                <Field label="رقم الموبايل" name="mobile" value={patient.mobile} onChange={handlePatient} type="tel" placeholder="+20 1xx xxx xxxx" />

                {/* DOB + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">تاريخ الميلاد</label>
                    <input type="date" name="dob" value={patient.dob} onChange={handlePatient} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">النوع</label>
                    <SelectWrap>
                      <select name="gender" value={patient.gender} onChange={handlePatient} className={`${inputCls} pe-3 ps-9`}>
                        <option value="">اختر</option>
                        {genderOptions.map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </SelectWrap>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">التأمين</label>
                  <SelectWrap>
                    <select name="insurance" value={patient.insurance} onChange={handlePatient} className={`${inputCls} pe-3 ps-9`}>
                      <option value="">— اختر شركة التأمين —</option>
                      {insuranceOptions.map((i) => <option key={i}>{i}</option>)}
                    </select>
                  </SelectWrap>
                </div>

                <Field label="العنوان" name="address" value={patient.address} onChange={handlePatient} placeholder="المدينة، الشارع..." />
              </div>
            </div>

            {/* Visit Registration */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#1f7e74]/80 to-[#13534c]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                  تسجيل الزيارة
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">تاريخ الزيارة</label>
                  <input type="date" name="visitDate" value={visit.visitDate} onChange={handleVisit} className={inputCls} required />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">العيادة</label>
                  <SelectWrap>
                    <select name="clinic" value={visit.clinic} onChange={handleVisit} className={`${inputCls} pe-3 ps-9`} required>
                      <option value="">— اختر العيادة —</option>
                      {clinics.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </SelectWrap>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الطبيب</label>
                  <SelectWrap>
                    <select name="doctor" value={visit.doctor} onChange={handleVisit} className={`${inputCls} pe-3 ps-9`} required>
                      <option value="">— اختر الطبيب —</option>
                      {MOCK_DOCTORS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </SelectWrap>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">التخصص</label>
                  <SelectWrap>
                    <select name="specialty" value={visit.specialty} onChange={handleVisit} className={`${inputCls} pe-3 ps-9`}>
                      <option value="">— اختر التخصص —</option>
                      {specialties.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </SelectWrap>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">نوع الزيارة</label>
                  <div className="flex gap-2 flex-wrap">
                    {visitTypes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setVisit({ ...visit, visitType: t })}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          visit.visitType === t
                            ? "bg-teal-600/80 text-white border-teal-600/80 shadow"
                            : "bg-white text-slate-600 border-slate-300 hover:border-teal-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── الوجهة المالية للمريض ── */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 text-right">طريقة الدفع</span>
                    {/* Attachment button */}
                    <button
                      type="button"
                      onClick={() => attachmentRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-300 rounded-lg px-3 py-1.5 hover:border-teal-400 transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                      </svg>
                      {attachmentPreview ? "تم الإرفاق" : "إرفاق صورة"}
                    </button>
                    <input ref={attachmentRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleAttachment} />
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Payment type dropdown */}
                    <SelectWrap>
                      <select
                        name="payment"
                        value={visit.payment}
                        onChange={handleVisit}
                        className={`${inputCls} pe-3 ps-9`}
                        required
                      >
                        <option value="">— اختر طريقة الدفع —</option>
                        {paymentTypes.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </SelectWrap>

                    {/* ── تأمين صحي fields ── */}
                    {visit.payment === "تأمين صحي" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">رقم الخطاب الاداري <span className="text-red-400">*</span></label>
                          <input type="text" name="adminLetterNo" value={financial.adminLetterNo} onChange={handleFinancial} placeholder="رقم الخطاب" className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">جهة الاصدار</label>
                          <input type="text" name="issuingAuthority" value={financial.issuingAuthority} onChange={handleFinancial} placeholder="جهة الاصدار" className={inputCls} />
                        </div>
                      </div>
                    )}

                    {/* ── نفقة دولة fields ── */}
                    {visit.payment === "نفقة دولة" && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">رقم القرار <span className="text-red-400">*</span></label>
                            <input type="text" name="decisionNo" value={financial.decisionNo} onChange={handleFinancial} placeholder="رقم القرار" className={inputCls} required />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">كود القرار</label>
                            <input type="text" name="decisionCode" value={financial.decisionCode} onChange={handleFinancial} placeholder="كود القرار" className={inputCls} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">قيمة القرار المالية</label>
                            <input type="number" name="decisionAmount" value={financial.decisionAmount} onChange={handleFinancial} placeholder="القيمة" className={inputCls} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">تاريخ القرار</label>
                            <input type="date" name="decisionDate" value={financial.decisionDate} onChange={handleFinancial} className={inputCls} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── تعاقدات fields ── */}
                    {visit.payment === "تعاقدات" && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">اختر جهة التعاقد <span className="text-red-400">*</span></label>
                          <SelectWrap>
                            <select name="contractEntity" value={financial.contractEntity} onChange={handleFinancial} className={`${inputCls} pe-3 ps-9`} required>
                              <option value="">-- اختر الجهة --</option>
                              {contractEntities.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </SelectWrap>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">رقم الخطاب الاداري <span className="text-red-400">*</span></label>
                            <input type="text" name="adminLetterNo" value={financial.adminLetterNo} onChange={handleFinancial} placeholder="رقم الخطاب" className={inputCls} required />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">جهة الاصدار</label>
                            <input type="text" name="issuingAuthority" value={financial.issuingAuthority} onChange={handleFinancial} placeholder="جهة الاصدار" className={inputCls} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isEditing ? "تحديث الموعد" : "حفظ الموعد"}
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
                  onClick={handleSendToQueue}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  حفظ وإرسال للطابور
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Back to calendar */}
        {slotData && (
          <button
            type="button"
            onClick={handleBackToCalendar}
            className="mt-6 bg-teal-900/80 text-white hover:bg-teal-700/80 text-base rounded-2xl transition-colors px-6 py-3"
          >
            العودة للتقويم
          </button>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-slate-50 transition appearance-none";

const checkboxColors = {
  blue:  { checked: "bg-blue-500 border-blue-500",  hover: "group-hover:border-blue-400" },
  amber: { checked: "bg-amber-500 border-amber-500", hover: "group-hover:border-amber-400" },
  pink:  { checked: "bg-pink-500 border-pink-500",   hover: "group-hover:border-pink-400" },
};

function Checkbox({ label, checked, onChange, color = "blue" }) {
  const c = checkboxColors[color] || checkboxColors.blue;
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div
        onClick={onChange}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          checked ? c.checked : `border-gray-300 bg-white ${c.hover}`
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
    </label>
  );
}

const dropdownArrow = (
  <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

function SelectWrap({ children }) {
  return (
    <div className="relative">
      {children}
      {dropdownArrow}
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputCls}
      />
    </div>
  );
}
