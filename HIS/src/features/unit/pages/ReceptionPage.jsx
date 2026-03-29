import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAgialStore from "../store";
import { MOCK_DOCTORS, MOCK_SPECIALTIES } from "../mockCalendar";
import BookingTabs from "../components/BookingTabs";

const OCR_ENDPOINT = "/id_scanner";

const idTypes = ["رقم قومي", "جواز سفر"];
const genderOptions = ["ذكر", "أنثى"];
const governorates = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية", "الغربية",
  "كفر الشيخ", "البحيرة", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
  "بني سويف", "الفيوم", "بورسعيد", "الإسماعيلية", "السويس", "دمياط",
  "شمال سيناء", "جنوب سيناء", "البحر الأحمر", "الوادي الجديد", "مطروح",
];
const patientTypes = ["مريض عادي", "ذوي الهمم", "مريض تأمين"];
const financialCategories = ["نقدي (تحمل التكلفة كاملة)", "غير قادرين"];
const financialTreatments = ["نقدي صباحي", "نقدي مسائي", "تأمين"];
const visitTypes = ["كشف", "استشارة", "فتح ملف عائلي"];
const contractEntities = [
  "هيئة الشرطة", "القوات المسلحة", "وزارة الصحة", "الأزهر الشريف",
  "وزارة التعليم العالي", "وزارة التضامن", "جهة أخرى",
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

/** Extract DOB from Egyptian national ID (14 digits): [century][YY][MM][DD]... */
function dobFromNationalId(nid) {
  if (!nid || nid.length < 7) return "";
  const century = nid[0] === "2" ? "19" : nid[0] === "3" ? "20" : "";
  if (!century) return "";
  const yy = nid.slice(1, 3);
  const mm = nid.slice(3, 5);
  const dd = nid.slice(5, 7);
  const date = `${century}${yy}-${mm}-${dd}`;
  // validate
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return date;
}

export default function ReceptionScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const addToQueue = useAgialStore((s) => s.addToQueue);
  const addAppointment = useAgialStore((s) => s.addAppointment);
  const updateAppointment = useAgialStore((s) => s.updateAppointment);
  const upsertPatient = useAgialStore((s) => s.upsertPatient);

  const slotData = location.state?.slot || null;
  const isEditing = !!slotData?.event;

  const [patient, setPatient] = useState({
    idType: "رقم قومي", mrn: "", nationalId: "", firstName: "", secondName: "", thirdName: "", lastName: "",
    nationality: "مصري", dob: "", gender: "", mobile: "", insurance: "",
    governorate: "", city: "", address: "",
  });

  const [financial, setFinancial] = useState({
    patientType: "مريض عادي", category: "نقدي", treatmentType: "نقدي صباحي",
    contractEntity: "", insuranceCompany: "",
    adminLetterNo: "", issuingAuthority: "",
    decisionNo: "", decisionCode: "", decisionAmount: "", decisionDate: "",
  });

  const [visit, setVisit] = useState({
    specialty: slotData?.specialty || "", visitType: "كشف", clinic: "",
  });

  const [saved, setSaved] = useState(false);

  // Patient type flags
  const [patientType, setPatientType] = useState(null);
  const isForeigner = patientType === "foreigner";
  const isUnknown = patientType === "unknown";
  const isBaby = patientType === "baby";
  const toggleType = (type) => setPatientType((prev) => (prev === type ? null : type));

  const [ocrPreview, setOcrPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!slotData) return;
    if (slotData.event) {
      const ev = slotData.event;
      const parts = (ev.patient?.name || ev.patientName || "").split(" ");
      setPatient((prev) => ({
        ...prev,
        mrn: ev.patient?.mrn || "",
        nationalId: ev.patient?.nationalId || "",
        firstName: parts[0] || "", secondName: parts[1] || "",
        thirdName: parts[2] || "", lastName: parts.slice(3).join(" ") || "",
        dob: ev.patient?.dob || "", gender: ev.patient?.gender || "",
        mobile: ev.patient?.mobile || "", insurance: ev.patient?.insurance || "",
        address: ev.patient?.address || "",
      }));
      const doc = MOCK_DOCTORS.find(d => d.id === ev.doctorId);
      setVisit({
        specialty: doc?.specialty || slotData.specialty || "",
        visitType: ev.visit?.visitType || "متابعة",
        clinic: ev.visit?.clinic || "",
      });
    } else {
      setVisit((prev) => ({ ...prev, specialty: slotData.specialty || "" }));
    }
  }, [slotData]);

  const fullName = [patient.firstName, patient.secondName, patient.thirdName, patient.lastName].filter(Boolean).join(" ");
  const doctorsForSpecialty = MOCK_DOCTORS.filter(d => d.specialty === visit.specialty);
  const clinicsForSpecialty = doctorsForSpecialty.map(d => `عيادة ${visit.specialty} (${d.name})`);

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
      const np = (data.full_name || "").split(" ");
      setPatient((prev) => ({
        ...prev, firstName: np[0] || prev.firstName, secondName: np[1] || prev.secondName,
        thirdName: np[2] || prev.thirdName, lastName: np.slice(3).join(" ") || prev.lastName,
        nationalId: data.national_id ?? prev.nationalId,
      }));
    } catch (err) { setOcrError(err.message || "فشل التعرف الضوئي"); }
    finally { setOcrLoading(false); }
  };

  const buildAppointment = () => {
    const startTime = slotData?.time || "08:00";
    const [sh, sm] = startTime.split(":").map(Number);
    const endH = sm + 15 >= 60 ? sh + 1 : sh;
    const endM = (sm + 15) % 60;
    const doctorObj = doctorsForSpecialty[0] || slotData?.doctor;
    return {
      id: slotData?.event?.id || String(Date.now()),
      patientName: fullName, doctorId: doctorObj?.id || "",
      start: `${today}T${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}:00`,
      end: `${today}T${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`,
      status: "CONFIRMED",
      patient: { mrn: patient.mrn, name: fullName, nationalId: patient.nationalId, mobile: patient.mobile, dob: patient.dob, gender: patient.gender, insurance: patient.insurance, address: patient.address, isForeigner, isUnknown, isBaby, nationality: isForeigner ? patient.nationality : "" },
      visit: { clinic: visit.clinic, visitType: visit.visitType, payment: financial.category, specialty: visit.specialty },
    };
  };

  const handleSave = (e) => {
    e.preventDefault();
    const appt = buildAppointment();
    if (fullName) upsertPatient({ mrn: patient.mrn, name: fullName, nationalId: patient.nationalId, mobile: patient.mobile, dob: patient.dob, gender: patient.gender, insurance: patient.insurance, address: patient.address });
    if (isEditing) updateAppointment(slotData.event.id, appt);
    else addAppointment(appt);
    setSaved(true);
  };

  const handleSendToQueue = () => {
    const appt = buildAppointment();
    if (fullName) upsertPatient({ mrn: patient.mrn, name: fullName, nationalId: patient.nationalId, mobile: patient.mobile, dob: patient.dob, gender: patient.gender, insurance: patient.insurance, address: patient.address });
    if (isEditing) updateAppointment(slotData.event.id, appt);
    else addAppointment(appt);
    addToQueue({ patient: { name: fullName, nationalId: patient.nationalId, gender: patient.gender }, visit });
    setSaved(true);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-100 to-blue-50 flex items-start justify-center py-5 px-4 font-sans" dir="rtl">
      <div className="w-full">
        {/* ── Tabs ── */}
        <BookingTabs />

        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900 rounded-2xl mt-4">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="text-center py-10 relative overflow-hidden"
            style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              {isEditing ? "تعديل موعد" : "حجز عيادات"}
            </h1>
            {slotData && (
              <p className="text-teal-300/80 text-sm mt-2">
                {slotData.specialty && `${slotData.specialty} · `}
                {slotData.time && `${slotData.time} · `}
                {slotData.date || ""}
              </p>
            )}
          </div>
        </div>

        {saved && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              تم الحفظ بنجاح — تم تحديث بيانات الموعد والمريض
            </div>
            <button onClick={() => navigate("/unit/calendar")} className="text-sm font-bold text-teal-700 hover:text-teal-900 underline underline-offset-2">العودة للتقويم</button>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">

            {/* ══════ Left Card: بيانات الهوية والمريض ══════ */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center justify-end gap-2">
                  بيانات الهوية والمريض
                </h2>
              </div>
              <div className="p-6 space-y-4">

                {/* Patient type flags */}
                <div className="flex flex-wrap gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <Checkbox label="أجنبي" checked={isForeigner} onChange={() => toggleType("foreigner")} color="blue" />
                  <Checkbox label="مجهول الهوية" checked={isUnknown} onChange={() => toggleType("unknown")} color="amber" />
                  <Checkbox label="طفل" checked={isBaby} onChange={() => toggleType("baby")} color="pink" />
                </div>

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

                <Field label="رقم الملف الطبي" name="mrn" value={patient.mrn} onChange={(e) => setPatient({ ...patient, mrn: e.target.value })} placeholder="مثال: MRN-00123" />

                {/* ID type + ID number + search */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">نوع الهوية <span className="text-red-400">*</span></label>
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
                  <div className="flex items-end">
                    <button type="button" className="w-full py-2 rounded-lg text-sm font-semibold bg-teal-600/80 text-white hover:bg-teal-700/80 transition">
                      🔍 بحث
                    </button>
                  </div>
                </div>

                {/* 4-part name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الاسم الرباعي <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-4 gap-2">
                    <input type="text" value={patient.firstName} onChange={(e) => setPatient({ ...patient, firstName: e.target.value })} placeholder="الأول" required className={inputCls} />
                    <input type="text" value={patient.secondName} onChange={(e) => setPatient({ ...patient, secondName: e.target.value })} placeholder="الثاني" className={inputCls} />
                    <input type="text" value={patient.thirdName} onChange={(e) => setPatient({ ...patient, thirdName: e.target.value })} placeholder="الثالث" className={inputCls} />
                    <input type="text" value={patient.lastName} onChange={(e) => setPatient({ ...patient, lastName: e.target.value })} placeholder="الرابع" className={inputCls} />
                  </div>
                </div>

                {/* Nationality dropdown (foreigner only) */}
                {isForeigner && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">الجنسية <span className="text-red-400">*</span></label>
                    <SelectWrap>
                      <select value={patient.nationality} onChange={(e) => setPatient({ ...patient, nationality: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                        <option value="">— اختر الجنسية —</option>
                        {nationalities.map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </SelectWrap>
                  </div>
                )}

                <Field label="رقم الموبايل" name="mobile" value={patient.mobile} onChange={(e) => setPatient({ ...patient, mobile: e.target.value })} type="tel" placeholder="+20 1xx xxx xxxx" />

                {/* DOB + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">تاريخ الميلاد</label>
                    <input type="date" value={patient.dob} onChange={(e) => setPatient({ ...patient, dob: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">النوع (الجنس) <span className="text-red-400">*</span></label>
                    <SelectWrap>
                      <select value={patient.gender} onChange={(e) => setPatient({ ...patient, gender: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                        <option value="">اختر</option>
                        {genderOptions.map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </SelectWrap>
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">التأمين</label>
                  <SelectWrap>
                    <select value={patient.insurance} onChange={(e) => setPatient({ ...patient, insurance: e.target.value })} className={`${inputCls} pr-3 pl-9`}>
                      <option value="">— اختر شركة التأمين —</option>
                      {insuranceOptions.map((i) => <option key={i}>{i}</option>)}
                    </select>
                  </SelectWrap>
                </div>

                {/* Governorate + City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">المحافظة</label>
                    <SelectWrap>
                      <select value={patient.governorate} onChange={(e) => setPatient({ ...patient, governorate: e.target.value })} className={`${inputCls} pr-3 pl-9`}>
                        <option value="">اختر</option>
                        {governorates.map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </SelectWrap>
                  </div>
                  <Field label="المدينة / المركز" name="city" value={patient.city} onChange={(e) => setPatient({ ...patient, city: e.target.value })} />
                </div>

                <Field label="العنوان" name="address" value={patient.address} onChange={(e) => setPatient({ ...patient, address: e.target.value })} placeholder="المدينة، الشارع..." />
              </div>
            </div>

            {/* ══════ Right Card: الزيارة والماليات ══════ */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#1f7e74]/80 to-[#13534c]/80 px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center justify-end gap-2">
                  تسجيل الزيارة والماليات
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-1">

                {/* ── التخصص ونوع الزيارة ── */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-700">التخصص ونوع الزيارة</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {/* نوع الزيارة tabs */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2 text-right">نوع الزيارة <span className="text-red-400">*</span></label>
                      <div className="flex gap-2">
                        {visitTypes.map((t) => (
                          <button key={t} type="button" onClick={() => setVisit({ ...visit, visitType: t })}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                              visit.visitType === t
                                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20"
                                : "bg-white text-slate-600 border-slate-300 hover:border-teal-400 hover:text-teal-700"
                            }`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">التخصص <span className="text-red-400">*</span></label>
                      <SelectWrap>
                        <select value={visit.specialty} onChange={(e) => setVisit({ ...visit, specialty: e.target.value, clinic: "" })} className={`${inputCls} pr-3 pl-9`} required>
                          <option value="">— اختر التخصص —</option>
                          {MOCK_SPECIALTIES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </SelectWrap>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">العيادة / الغرفة (اختياري)</label>
                      <SelectWrap>
                        <select value={visit.clinic} onChange={(e) => setVisit({ ...visit, clinic: e.target.value })} className={`${inputCls} pr-3 pl-9`}>
                          <option value="">— اختر العيادة —</option>
                          {clinicsForSpecialty.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </SelectWrap>
                    </div>
                  </div>
                </div>

                {/* ── تصنيف الفئة والماليات ── */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-700">تصنيف الفئة والماليات</span>
                  </div>
                  <div className="p-4 space-y-4">
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
                        <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">تصنيف الفئة المالية <span className="text-red-400">*</span></label>
                        <SelectWrap>
                          <select value={financial.category} onChange={(e) => setFinancial({ ...financial, category: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                            <option value="">— اختر —</option>
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

                    {/* Insurance fields */}
                    {financial.category === "تأمين صحي" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">شركة التأمين <span className="text-red-400">*</span></label>
                          <SelectWrap>
                            <select value={financial.insuranceCompany} onChange={(e) => setFinancial({ ...financial, insuranceCompany: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                              <option value="">— اختر —</option>
                              {insuranceOptions.map((i) => <option key={i}>{i}</option>)}
                            </select>
                          </SelectWrap>
                        </div>
                        <Field label="رقم الخطاب الإداري" name="adminLetterNo" value={financial.adminLetterNo} onChange={(e) => setFinancial({ ...financial, adminLetterNo: e.target.value })} required />
                      </div>
                    )}

                    {/* State expense fields */}
                    {financial.category === "نفقة دولة" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <Field label="رقم القرار" name="decisionNo" value={financial.decisionNo} onChange={(e) => setFinancial({ ...financial, decisionNo: e.target.value })} required />
                        <Field label="كود القرار" name="decisionCode" value={financial.decisionCode} onChange={(e) => setFinancial({ ...financial, decisionCode: e.target.value })} />
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">قيمة القرار المالية</label>
                          <input type="number" value={financial.decisionAmount} onChange={(e) => setFinancial({ ...financial, decisionAmount: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">تاريخ القرار</label>
                          <input type="date" value={financial.decisionDate} onChange={(e) => setFinancial({ ...financial, decisionDate: e.target.value })} className={inputCls} />
                        </div>
                      </div>
                    )}

                    {/* Contract fields */}
                    {financial.category === "تعاقدات" && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">جهة التعاقد <span className="text-red-400">*</span></label>
                          <SelectWrap>
                            <select value={financial.contractEntity} onChange={(e) => setFinancial({ ...financial, contractEntity: e.target.value })} className={`${inputCls} pr-3 pl-9`} required>
                              <option value="">-- اختر الجهة --</option>
                              {contractEntities.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </SelectWrap>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="رقم الخطاب الإداري" name="adminLetterNo" value={financial.adminLetterNo} onChange={(e) => setFinancial({ ...financial, adminLetterNo: e.target.value })} required />
                          <Field label="جهة الإصدار" name="issuingAuthority" value={financial.issuingAuthority} onChange={(e) => setFinancial({ ...financial, issuingAuthority: e.target.value })} />
                        </div>
                      </div>
                    )}

                    {/* Financial summary */}
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">قيمة الخدمة (التسعيرة)</p>
                        <p className="text-lg font-bold text-slate-800">150 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">حصة التأمين</p>
                        <p className="text-lg font-bold text-slate-800">0 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">حصة المريض المطلوبة</p>
                        <p className="text-lg font-bold text-red-600">150 <span className="text-xs font-normal">ج.م</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">
                <button type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2">
                  {isEditing ? "تحديث الموعد" : "حفظ الحجز"}
                </button>
                <button type="button" onClick={() => window.print()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2">
                  طباعة التذكرة
                </button>
                <button type="button" onClick={handleSendToQueue}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2">
                  حفظ وإرسال للطابور
                </button>
              </div>
            </div>
          </div>
        </form>

        {slotData && (
          <button type="button" onClick={() => navigate("/unit/calendar")}
            className="mt-6 bg-teal-900/80 text-white hover:bg-teal-700/80 text-base rounded-2xl transition-colors px-6 py-3">
            العودة للتقويم
          </button>
        )}
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

function Field({ label, name, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 text-right">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className={inputCls} />
    </div>
  );
}

const checkboxColors = {
  blue:  { checked: "bg-blue-500 border-blue-500",  hover: "group-hover:border-blue-400" },
  amber: { checked: "bg-amber-500 border-amber-500", hover: "group-hover:border-amber-400" },
  pink:  { checked: "bg-pink-500 border-pink-500",   hover: "group-hover:border-pink-400" },
};

function Checkbox({ label, checked, onChange, color = "blue" }) {
  const c = checkboxColors[color] || checkboxColors.blue;
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div onClick={onChange}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          checked ? c.checked : `border-gray-300 bg-white ${c.hover}`
        }`}>
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
