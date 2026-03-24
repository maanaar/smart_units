import { useState } from "react";
import { ICD10 } from "../icd10";
import useAgialStore from "../store";
import Many2ManyField from "../components/Manytomany-labs";

const INPATIENT_URL = "https://sys.agialhospital.net/web#action=634&model=inpatient.admission&view_type=list&cids=1&menu_id=435";

// ── البيانات الثابتة ─────────────────────────────────────────────────────────
const RISK_FACTORS = [
  "التدخين", "الكحول", "السمنة", "السكري", "ارتفاع ضغط الدم",
  "أمراض القلب", "تاريخ عائلي بالسرطان", "قلة النشاط البدني", "أخرى",
];

const ROUTES = ["فموي", "وريدي", "عضلي", "تحت الجلد", "موضعي", "استنشاق", "تحت اللسان"];

const COMMON_LABS = [
  "صورة دم كاملة", "فحص الأيضات الأساسية", "فحص الأيضات الشامل", "وظائف الكبد",
  "وظائف الكلى", "الهيموغلوبين السكري", "الدهون الثلاثية", "هرمون الغدة الدرقية",
  "وقت التخثر", "تحليل البول",
];

const COMMON_RAD = [
  "أشعة صدر", "أشعة بطن", "طبقي محوري للرأس", "طبقي محوري للصدر",
  "طبقي محوري للبطن والحوض", "رنين مغناطيسي للدماغ", "رنين مغناطيسي للعمود الفقري",
  "موجات فوق صوتية للبطن", "مخطط صدى القلب",
];

// ── المساعدات ──────────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 bg-white transition placeholder:text-slate-300 text-right";
const sectionCls = "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden";
const headerCls  = "px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-teal-600/10";

// ── حقل إدخال الحساسية ────────────────────────────────────────────────────
function AllergyInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) setTags([...tags, val]);
    setInput("");
  };

  const remove = (t) => setTags(tags.filter((x) => x !== t));

  return (
    <div className="p-4 flex-1 space-y-2" dir="rtl">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && (e.preventDefault(), add())}
          placeholder="اكتب الحساسية واضغط Enter…"
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
        >
          إضافة
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-2 py-0.5 rounded-full"
            >
              {t}
              <button onClick={() => remove(t)} className="hover:text-red-900 leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── بحث تشخيصات ICD10 ────────────────────────────────────────────────────────
function DiagnosesPanel({ selected, setSelected }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim().length >= 2
    ? ICD10.filter(
        (r) =>
          r.code.toLowerCase().includes(query.toLowerCase()) ||
          r.desc.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 100)
    : ICD10.slice(0, 100);

  const pick = (item) => {
    if (!selected.find((s) => s.code === item.code))
      setSelected([...selected, item]);
  };

  const remove = (code) => setSelected(selected.filter((s) => s.code !== code));

  return (
    <div className="p-4 space-y-3" dir="rtl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث بكود ICD-10 أو الوصف…"
        className={inputCls}
      />

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="max-h-56 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
              <tr>
                <th className="px-3 py-2 text-right font-semibold text-slate-500 w-24">الكود</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-500">الوصف</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.code}
                  onClick={() => pick(r)}
                  className={`border-b border-slate-50 cursor-pointer transition-colors ${
                    selected.find((s) => s.code === r.code)
                      ? "bg-teal-50"
                      : "hover:bg-teal-50"
                  }`}
                >
                  <td className="px-3 py-2 font-mono font-bold text-teal-700">{r.code}</td>
                  <td className="px-3 py-2 text-slate-700">{r.desc}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-3 py-6 text-center text-slate-400 text-sm">لا توجد نتائج</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1.5">التشخيصات المختارة</p>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-44 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-right font-semibold text-slate-500 w-24">الكود</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-500">الوصف</th>
                    <th className="px-3 py-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {selected.map((s) => (
                    <tr key={s.code} className="border-b border-slate-50 last:border-0">
                      <td className="px-3 py-2 font-mono font-bold text-teal-700">{s.code}</td>
                      <td className="px-3 py-2 text-slate-700">{s.desc}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => remove(s.code)}
                          className="text-slate-300 hover:text-red-500 transition text-base leading-none"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ملف الأدوية ────────────────────────────────────────────────────────────
function MedicationProfile({ rows, setRows }) {
  const empty = () => ({ drug: "", dose: "", freq: "", duration: "", route: "" });

  const update = (i, field, val) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: val };
    setRows(next);
  };

  const remove = (i) => setRows(rows.filter((_, idx) => idx !== i));

  return (
    <div className="p-4 space-y-3" dir="rtl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-100">
              {["اسم الدواء", "الجرعة", "التكرار", "المدة", "طريقة الإعطاء", ""].map((h) => (
                <th key={h} className="px-2 py-2 text-right font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-50">
                <td className="px-1 py-1.5">
                  <input value={row.drug} onChange={(e) => update(i, "drug", e.target.value)} placeholder="اسم الدواء" className={`${inputCls} text-sm py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <input value={row.dose} onChange={(e) => update(i, "dose", e.target.value)} placeholder="مثال: 500mg" className={`${inputCls} text-sm py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <input value={row.freq} onChange={(e) => update(i, "freq", e.target.value)} placeholder="مثال: مرتين يومياً" className={`${inputCls} text-sm py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <input value={row.duration} onChange={(e) => update(i, "duration", e.target.value)} placeholder="مثال: 7 أيام" className={`${inputCls} text-sm py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <select value={row.route} onChange={(e) => update(i, "route", e.target.value)} className={`${inputCls} text-sm py-1.5`}>
                    <option value="">طريقة الإعطاء</option>
                    {ROUTES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-1 py-1.5">
                  <button onClick={() => remove(i)} className="text-slate-300 hover:text-red-500 transition text-lg leading-none">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => setRows([...rows, empty()])}
        className="text-sm font-semibold text-teal-600 hover:text-teal-800 transition flex items-center gap-1"
      >
        <span className="text-base leading-none">+</span> إضافة دواء
      </button>
    </div>
  );
}

// ── لوحة الطلبات (مختبر / أشعة) ──────────────────────────────────────────
function OrdersPanel({ presets, selected, setSelected, custom, setCustom }) {
  const [input, setInput] = useState("");

  const toggle = (item) =>
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

  const addCustom = () => {
    const val = input.trim();
    if (val && !custom.includes(val)) setCustom([...custom, val]);
    setInput("");
  };

  const removeCustom = (item) => setCustom(custom.filter((x) => x !== item));

  return (
    <div className="p-4 space-y-3" dir="rtl">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {presets.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
              className="w-4 h-4 rounded border-slate-300 accent-teal-600 cursor-pointer"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{item}</span>
          </label>
        ))}
      </div>

      {custom.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {custom.map((item) => (
            <span key={item} className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 text-sm font-medium px-2 py-0.5 rounded-full">
              {item}
              <button onClick={() => removeCustom(item)} className="hover:text-red-500 leading-none">×</button>
            </span>
          ))}
        </div>
      )}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter") && (e.preventDefault(), addCustom())}
        placeholder="أضف طلباً مخصصاً واضغط Enter…"
        className={inputCls}
      />
    </div>
  );
}

const EMPTY_FORM = {
  chiefComplaint: "", allergies: [],
  vitals: { bpSys: "", bpDia: "", pulse: "", temp: "", o2sat: "", weight: "", height: "" },
  riskFactors: [], diagnoses: [],
  medications: [{ drug: "", dose: "", freq: "", duration: "", route: "" }],
  labSelected: [], labCustom: [], radSelected: [], radCustom: [],
};

// ── الصفحة الرئيسية ───────────────────────────────────────────────────────
export default function DoctorScreen() {
  const queuePatients      = useAgialStore((s) => s.queuePatients);
  const updateQueueStatus  = useAgialStore((s) => s.updateQueueStatus);
  const addLabRequest      = useAgialStore((s) => s.addLabRequest);
  const addRadRequest      = useAgialStore((s) => s.addRadRequest);
  const LAB_OPTIONS = [
  { id: 1, label: "معامل المختبر" },
  { id: 2, label: "معامل البرج" },
  { id: 3, label: "معمل ألفا لاب" },
  { id: 4, label: "معامل رويال" },

];

  const Requiredtests = [
  { id: 1, label: "صورة دم كاملة" },
  { id: 2, label: "فحص الأيضات الأساسية"},
  { id: 3, label: "فحص الأيضات الشامل" },
  { id: 4, label: "وظائف الكبد"},
  { id: 5, label: "وظائف الكلى"},
  { id: 6, label: "الهيموغلوبين السكري"},
  { id: 7, label: "الدهون الثلاثية"},
  { id: 8, label: "هرمون الغدة الدرقية"},
  { id: 9, label: "وقت التخثر"},
  { id: 10, label: "تحليل البول"},
];


 const RequiredRadtests = [
  { id: 1, label: " أشعة صدر " },
  { id: 2, label: "أشعة بطن"},
  { id: 3, label: "طبقي محوري للصدر" },
  { id: 4, label: "رنين مغناطيسي للعمود الفقري"},
  { id: 5, label:  "رنين مغناطيسي للدماغ"},
  { id: 6, label:  "طبقي محوري للبطن والحوض"},
  { id: 7, label: "الدهون الثلاثية"},
  { id: 8, label: "مخطط صدى القلب"},
  { id: 9, label: "موجات فوق صوتية للبطن"},

];



  const Rad_cate = [
  { id: 1, label: "CT" },
  { id: 2, label: " MRI"},
  { id: 3, label: " X-RAY" },



];


  const LAB_Models = [
  { id: 1, label: "تعداد الدم الكامل " },
  { id: 2, label: "فحصوصات تكيس المبايض"},
  { id: 3, label: "فحص الأيضات الشامل" },
  { id: 4, label: "وظائف الكبد"},
  { id: 5, label: "وظائف الكلى"},

];

  const queueRows = queuePatients.length > 0 ? queuePatients : [
    { qid: 0, patient: { name: "أحمد علي", dob: "", mrn: "", mobile: "" }, visit: { doctor: "د. حسن", clinic: "الطب العام" }, _status: "في الانتظار" },
  ];

  // ── المريض المختار ──────────────────────────────────────────────────────
  const [selectedQid, setSelectedQid] = useState(null);
  const [savedData,   setSavedData]   = useState({});

  // ── حالة النموذج الحي ───────────────────────────────────────────────────
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [allergies,      setAllergies]      = useState([]);
  const [vitals,         setVitals]         = useState(EMPTY_FORM.vitals);
  const [riskFactors,    setRiskFactors]    = useState([]);
  const [diagnoses,      setDiagnoses]      = useState([]);
  const [medications,    setMedications]    = useState(EMPTY_FORM.medications);
  const [labSelected,    setLabSelected]    = useState([]);
  const [labCustom,      setLabCustom]      = useState([]);
  const [radSelected,    setRadSelected]    = useState([]);
  const [radCustom,      setRadCustom]      = useState([]);
  const [selectedTests, setSelectedTests]    = useState([]);
  const [selectedModel, setSelectedModel]    = useState([]);
  const [selectedRequiredtests, setRequiredtests]    = useState([]);
  const [selectedRadcate, setSelectedRad_cate]    = useState([]);
    const [selectedRequiredRadtests, setRequiredRadtests]    = useState([]);
  const [showLaboratoryrequests,  Laboratoryrequests]  = useState(false);
  const [showXrayrequests, Xrayrequests] = useState(false);

  const bmi = vitals.weight && vitals.height
    ? (vitals.weight / ((vitals.height / 100) ** 2)).toFixed(1)
    : "";

  const toggleRisk = (r) =>
    setRiskFactors((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);

  const selectedEntry = queueRows.find((e) => e.qid === selectedQid) ?? null;
  const isReadOnly    = selectedEntry?._status === "مكتمل";

  const loadForm = (d) => {
    setChiefComplaint(d.chiefComplaint); setAllergies(d.allergies);
    setVitals(d.vitals);                 setRiskFactors(d.riskFactors);
    setDiagnoses(d.diagnoses);           setMedications(d.medications);
    setLabSelected(d.labSelected);       setLabCustom(d.labCustom);
    setRadSelected(d.radSelected);       setRadCustom(d.radCustom);
  };

  const selectPatient = (entry) => {
    setSelectedQid(entry.qid);
    loadForm(savedData[entry.qid] ?? EMPTY_FORM);
  };

  const snapshot = () => ({
    chiefComplaint, allergies, vitals, riskFactors, diagnoses,
    medications, labSelected, labCustom, radSelected, radCustom,
  });

  const handleSave = () => {
    if (!selectedQid && selectedQid !== 0) return alert("الرجاء اختيار مريض من قائمة الانتظار أولاً.");
    setSavedData((prev) => ({ ...prev, [selectedQid]: snapshot() }));
    alert("تم الحفظ!");
  };

  const handleComplete = () => {
    if (!selectedQid && selectedQid !== 0) return alert("الرجاء اختيار مريض من قائمة الانتظار أولاً.");
    setSavedData((prev) => ({ ...prev, [selectedQid]: snapshot() }));
    updateQueueStatus(selectedQid, "مكتمل");
    alert("تمت الزيارة!");
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">
      <div className="mx-auto px-4 py-6 space-y-5">

        {/* الترويسة */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900 rounded-2xl">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="text-center py-8 relative" style={{
            backgroundImage: "linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}>
            <h1 className="text-4xl font-extrabold text-white tracking-tight font-Almarai">شاشة الطبيب</h1>
          </div>
        </div>

        {/* قائمة انتظار الطبيب */}
        <div className={sectionCls}>
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-l from-[#13534c]/80 to-[#1f7e74]/80 flex items-center gap-2">
            <h2 className="text-white font-bold text-lg uppercase tracking-wide font-[Almarai]">قائمة انتظار </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["الرقم", "المريض", "العيادة", "الطبيب", "الحالة", "التحويل"].map((h) => (
                    <th key={h} className="px-4 py-3 text-right text-sm font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queueRows.map((entry, i) => {
                  const isSelected  = entry.qid === selectedQid;
                  const isCompleted = entry._status === "مكتمل" || entry._status === "Complete";
                  return (
                    <tr
                      key={entry.qid}
                      onClick={() => selectPatient(entry)}
                      className={`border-b border-slate-50 cursor-pointer transition ${
                        isSelected ? "bg-teal-50 border-r-4 border-r-teal-500" : "hover:bg-emerald-50/50"
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-teal-700">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{entry.patient.name}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.visit?.clinic || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.visit?.doctor || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                          {isCompleted ? "مكتمل" : (entry._status || "في الانتظار")}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          {/* <button className="px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition">فتح</button>
                          <button
                            onClick={() => window.open(INPATIENT_URL, "_blank")}
                            className="px-3 py-1.5 text-sm font-bold bg-violet-600/80 text-white rounded-lg hover:bg-violet-700/80 transition shadow"
                          >
                            داخلي
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* بانر معلومات المريض */}
        {selectedEntry ? (
          <div className={`rounded-2xl border px-5 py-3 flex items-center gap-4 ${
            isReadOnly
              ? "bg-emerald-50 border-emerald-200"
              : "bg-teal-50 border-teal-200"
          }`}>
            <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center flex-shrink-0 text-teal-700 font-bold text-sm">
              {selectedEntry.patient.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800">{selectedEntry.patient.name}</p>
              <p className="text-xs text-slate-500">{selectedEntry.visit?.clinic} · {selectedEntry.visit?.doctor}</p>
            </div>
            {selectedEntry.patient.mrn && <span className="text-xs font-mono text-slate-500">{selectedEntry.patient.mrn}</span>}
            {isReadOnly && (
              <span className="text-xs font-bold bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full">الزيارة مكتملة — للقراءة فقط</span>
            )}

             {/* الأزرار */}
    <button
      onClick={() => Laboratoryrequests(true)}
      className="px-3 py-1.5 text-xs font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow"
    >
      طلبات المختبر
    </button>
    <button
      onClick={() => Xrayrequests(true)}
      className="px-3 py-1.5 text-xs font-bold bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition shadow"
    >
     طلبات الأشعة
    </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-center text-sm text-slate-400">
            انقر على صف مريض أعلاه لفتح زيارته
          </div>
        )}

        
{/* popup بيانات المريض */}

{showLaboratoryrequests && (
  <div
    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    onClick={() => Laboratoryrequests(false)}
  >
    <div
      className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "90vh" }}
      onClick={(e) => e.stopPropagation()}
      dir="rtl"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <h2 className="text-base font-bold text-slate-800">بيانات المريض</h2>
        <button
          onClick={() => Laboratoryrequests(false)}
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">

        {/* Patient info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2">
            <span className="text-slate-500 shrink-0">الاسم</span>
            <span className="font-semibold text-slate-800">
              {selectedEntry?.patient.name || "—"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 shrink-0">تاريخ</span>
            <span className="font-semibold text-slate-800">
              {selectedEntry?.patient.dob || "—"}
            </span>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center gap-2 bg-teal-50 rounded-xl px-4 py-2.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
          <h3 className="text-sm font-bold text-teal-700">متطلبات المختبر</h3>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <Many2ManyField
            label="المختبر"
            options={LAB_OPTIONS}
            selected={selectedTests}
            setSelected={setSelectedTests}
            placeholder="ابحث واختر المعامل..."
          />
          <Many2ManyField
            label="النموذج"
            options={LAB_Models}
            selected={selectedModel}
            setSelected={setSelectedModel}
            placeholder="اختر النماذج..."
          />
          <Many2ManyField
            label="التحاليل"
            options={Requiredtests}
            selected={selectedRequiredtests}
            setSelected={setRequiredtests}
            placeholder="اختر التحاليل المطلوبة..."
          />
        </div>
      </div>

      {/* ── Footer actions ── */}
      <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-100 shrink-0">
        <button
          onClick={() => Laboratoryrequests(false)}
          className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={() => {
            if (!selectedEntry) return;
            addLabRequest({
              date: new Date().toLocaleDateString('ar-EG'),
              patientName: selectedEntry.patient.name,
              lab: selectedTests.map((t) => t.label),
              template: selectedModel.map((t) => t.label),
              tests: selectedRequiredtests.map((t) => t.label),
            });
            setSelectedTests([]);
            setSelectedModel([]);
            setRequiredtests([]);
            Laboratoryrequests(false);
          }}
          className="px-5 py-2 text-sm rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
        >
          حفظ الطلب
        </button>
      </div>
    </div>
  </div>
)}




{/* popup سجل الزيارات */}
{showXrayrequests && (




  <div
    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    onClick={() => Xrayrequests(false)}
  >
    <div
      className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "90vh" }}
      onClick={(e) => e.stopPropagation()}
      dir="rtl"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <h2 className="text-base font-bold text-slate-800">بيانات المريض</h2>
        <button
          onClick={() => Xrayrequests(false)}
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">

        {/* Patient info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2">
            <span className="text-slate-500 shrink-0">الاسم</span>
            <span className="font-semibold text-slate-800">
              {selectedEntry?.patient.name || "—"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 shrink-0">تاريخ</span>
            <span className="font-semibold text-slate-800">
              {selectedEntry?.patient.dob || "—"}
            </span>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center gap-2 bg-teal-50 rounded-xl px-4 py-2.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
          <h3 className="text-sm font-bold text-teal-700">متطلبات الاشعة</h3>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          
          <Many2ManyField
            label="الفئة"
            options={Rad_cate}
            selected={selectedRadcate}
            setSelected={setSelectedRad_cate}
            placeholder="اختر النماذج..."
            className="w-[40px]"
          />
          <Many2ManyField
            label="الأشعة"
            options={RequiredRadtests}
            selected={selectedRequiredRadtests}
            setSelected={setRequiredRadtests}
            placeholder="اختر الأشعة المطلوبة..."
          />
        </div>
      </div>

      {/* ── Footer actions ── */}
      <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-100 shrink-0">
        <button
          onClick={() => Xrayrequests(false)}
          className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={() => {
            if (!selectedEntry) return;
            addRadRequest({
              daterad: new Date().toLocaleDateString('ar-EG'),
              patientName: selectedEntry.patient.name,
              category: selectedRadcate.map((t) => t.label.trim()),
              testsRad: selectedRequiredRadtests.map((t) => t.label.trim()),
            });
            setSelectedRad_cate([]);
            setRequiredRadtests([]);
            Xrayrequests(false);
          }}
          className="px-5 py-2 text-sm rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
        >
          حفظ الطلب
        </button>
      </div>
    </div>
  </div>


  // <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => Xrayrequests(false)}>
  //   <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()} dir="rtl">
  //     <div className="flex items-center justify-between mb-4">
  //       <h2 className="text-lg font-bold text-slate-800">طلبات الأشعة</h2>
  //       <button onClick={() => Xrayrequests(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
  //     </div>
  //     <div className="text-center py-8 text-slate-400 text-sm">
  //       لا توجد زيارات سابقة
  //     </div>
  //   </div>
  // </div>
)}
        

        {/* الأقسام السريرية */}
        <div className={`space-y-5 ${isReadOnly ? "pointer-events-none opacity-60 select-none" : ""}`}>

          {/* الصف 1 — 3 أعمدة */}
          <div className={sectionCls}>
            <div className={headerCls}>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <h3 className="text-lg font-bold text-slate-700">التشخيصات</h3>
              <span className="mr-auto text-sm text-slate-400">ICD-10</span>
            </div>
            <DiagnosesPanel selected={diagnoses} setSelected={setDiagnoses} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

            {/* الشكوى الرئيسية */}
            <div className={`${sectionCls} flex flex-col`}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <h3 className="text-lg font-bold text-slate-700">الشكوى الرئيسية</h3>
              </div>
              <div className="p-4 flex-1 flex flex-col" dir="rtl">
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="اوصف الشكوى الرئيسية…"
                  className={`${inputCls} resize-none flex-1`}
                />
              </div>
            </div>

            {/* الحساسية */}
            <div className={`${sectionCls} flex flex-col`}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <h3 className="text-lg font-bold text-slate-700">الحساسية</h3>
              </div>
              <AllergyInput tags={allergies} setTags={setAllergies} />

              
            </div>

            {/* العلامات الحيوية + عوامل الخطر */}
            {/* <div className="flex flex-col gap-5"> */}
              <div className={sectionCls}>
                <div className={headerCls}>
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <h3 className="text-lg font-bold text-slate-700">العلامات الحيوية</h3>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2" dir="rtl">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">الضغط الانقباضي</label>
                    <input value={vitals.bpSys} onChange={(e) => setVitals({ ...vitals, bpSys: e.target.value })} placeholder="mmHg" className={`${inputCls} text-xs py-1.5`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">الضغط الانبساطي</label>
                    <input value={vitals.bpDia} onChange={(e) => setVitals({ ...vitals, bpDia: e.target.value })} placeholder="mmHg" className={`${inputCls} text-xs py-1.5`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">النبض</label>
                    <input value={vitals.pulse} onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })} placeholder="نبضة/دقيقة" className={`${inputCls} text-xs py-1.5`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">درجة الحرارة</label>
                    <input value={vitals.temp} onChange={(e) => setVitals({ ...vitals, temp: e.target.value })} placeholder="°م" className={`${inputCls} text-xs py-1.5`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">تشبع الأكسجين</label>
                    <input value={vitals.o2sat} onChange={(e) => setVitals({ ...vitals, o2sat: e.target.value })} placeholder="%" className={`${inputCls} text-xs py-1.5`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold  text-slate-600 mb-1">الوزن (كجم)</label>
                    <input value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} placeholder="كجم" className={`${inputCls} text-xs py-1.5`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold  text-slate-600 mb-1">الطول (سم)</label>
                    <input value={vitals.height} onChange={(e) => setVitals({ ...vitals, height: e.target.value })} placeholder="سم" className={`${inputCls} text-xs py-1.5`} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold  text-slate-600 mb-1">مؤشر كتلة الجسم</label>
                    <div className={`${inputCls} text-sm py-1.5 bg-slate-50 text-slate-500`}>{bmi || "—"}</div>
                  </div>
                </div>
              </div>

              <div className={sectionCls}>
                <div className={headerCls}>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-lg font-bold text-slate-700">عوامل الخطر</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4" dir="rtl">
                  {RISK_FACTORS.map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={riskFactors.includes(r)}
                        onChange={() => toggleRisk(r)}
                        className="w-5 h-5 rounded border-slate-300 accent-teal-600 cursor-pointer"
                      />
                      <span className="text-sm font-semibold  text-slate-600 group-hover:text-slate-900 transition">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
            {/* </div> */}
          </div>
          {/* <div className={sectionCls}>
            <div className={headerCls}>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <h3 className="text-lg font-bold text-slate-700">التشخيصات</h3>
              <span className="mr-auto text-sm text-slate-400">ICD-10</span>
            </div>
            <DiagnosesPanel selected={diagnoses} setSelected={setDiagnoses} />
          </div> */}
          {/* الصف 2 — ملف الأدوية */}
          <div className={sectionCls}>
            <div className={headerCls}>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-lg font-bold text-slate-700 font-[Alexandria]">ملف الأدوية</h3>
            </div>
            <MedicationProfile rows={medications} setRows={setMedications} />
          </div>

          {/* الصف 3 — التشخيصات */}
          {/* <div className={sectionCls}>
            <div className={headerCls}>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <h3 className="text-lg font-bold text-slate-700">التشخيصات</h3>
              <span className="mr-auto text-sm text-slate-400">ICD-10</span>
            </div>
            <DiagnosesPanel selected={diagnoses} setSelected={setDiagnoses} />
          </div> */}

          {/* الصف 4 — طلبات المختبر والأشعة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <h3 className="text-lg font-bold text-slate-700">طلبات المختبر</h3>
                <span className="mr-auto text-sm text-slate-400">ALB</span>
              </div>
              <OrdersPanel
                presets={COMMON_LABS}
                selected={labSelected}
                setSelected={setLabSelected}
                custom={labCustom}
                setCustom={setLabCustom}
              />
            </div> */}
            {/* <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                <h3 className="text-lg font-bold text-slate-700">طلبات الأشعة</h3>
                <span className="mr-auto text-sm text-slate-400">RAD</span>
              </div>
              <OrdersPanel
                presets={COMMON_RAD}
                selected={radSelected}
                setSelected={setRadSelected}
                custom={radCustom}
                setCustom={setRadCustom}
              />
            </div> */}
          </div>

        </div>{/* نهاية القسم السريري */}

        {/* أزرار الإجراءات */}
        <div className="flex justify-start gap-3 pb-4">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition active:scale-95"
          >
            حفظ
          </button>
          <button
            onClick={handleComplete}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-700/80 hover:bg-teal-800/80 text-white transition shadow active:scale-95"
          >
            إتمام الزيارة
          </button>
        </div>

      </div>
    </div>
  );
}