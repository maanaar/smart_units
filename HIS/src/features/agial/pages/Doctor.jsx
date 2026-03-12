import { useState } from "react";
import { ICD10 } from "../icd10";
import useAgialStore from "../store";

const INPATIENT_URL = "https://sys.agialhospital.net/web#action=634&model=inpatient.admission&view_type=list&cids=1&menu_id=435";

// ── static data ─────────────────────────────────────────────────────────────
const RISK_FACTORS = [
  "Smoking", "Alcohol", "Obesity", "Diabetes", "Hypertension",
  "Cardiac Disease", "Family History of Cancer", "Sedentary Lifestyle", "Other",
];

const ROUTES = ["Oral", "IV", "IM", "SC", "Topical", "Inhaled", "Sublingual"];

const COMMON_LABS = [
  "CBC", "BMP", "CMP", "LFT", "RFT", "HbA1c",
  "Lipid Panel", "TSH", "PT/INR", "Urinalysis",
];

const COMMON_RAD = [
  "Chest X-Ray", "Abdominal X-Ray", "CT Head", "CT Chest",
  "CT Abdomen/Pelvis", "MRI Brain", "MRI Spine", "Ultrasound Abdomen", "Echocardiogram",
];

// ── helpers ──────────────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 bg-white transition placeholder:text-slate-300";
const sectionCls = "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden";
const headerCls  = "px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-teal-600/10";
const dotCls     = (color) => `w-2 h-2 rounded-full bg-${color}`;

// ── Allergy Tag Input ─────────────────────────────────────────────────────────
function AllergyInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) setTags([...tags, val]);
    setInput("");
  };

  const remove = (t) => setTags(tags.filter((x) => x !== t));

  return (
    <div className="p-4 space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && (e.preventDefault(), add())}
          placeholder="Type allergy and press Enter…"
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full"
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

// ── ICD10 Diagnoses Search ────────────────────────────────────────────────────
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
    <div className="p-4 space-y-3">
      {/* Search */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search ICD-10 code or description…"
        className={inputCls}
      />

      {/* ICD-10 table — always visible, filtered by search */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="max-h-56 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-500 w-24">Code</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-500">Description</th>
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
                  <td colSpan={2} className="px-3 py-6 text-center text-slate-400 text-xs">No results</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected diagnoses */}
      {selected.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Selected Diagnoses</p>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-44 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 w-24">Code</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500">Description</th>
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

// ── Medication Profile ────────────────────────────────────────────────────────
function MedicationProfile({ rows, setRows }) {
  const empty = () => ({ drug: "", dose: "", freq: "", duration: "", route: "" });

  const update = (i, field, val) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: val };
    setRows(next);
  };

  const remove = (i) => setRows(rows.filter((_, idx) => idx !== i));

  return (
    <div className="p-4 space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-100">
              {["Drug Name", "Dose", "Frequency", "Duration", "Route", ""].map((h) => (
                <th key={h} className="px-2 py-2 text-left font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-50">
                <td className="px-1 py-1.5">
                  <input value={row.drug} onChange={(e) => update(i, "drug", e.target.value)} placeholder="Drug name" className={`${inputCls} text-xs py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <input value={row.dose} onChange={(e) => update(i, "dose", e.target.value)} placeholder="e.g. 500mg" className={`${inputCls} text-xs py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <input value={row.freq} onChange={(e) => update(i, "freq", e.target.value)} placeholder="e.g. BID" className={`${inputCls} text-xs py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <input value={row.duration} onChange={(e) => update(i, "duration", e.target.value)} placeholder="e.g. 7 days" className={`${inputCls} text-xs py-1.5`} />
                </td>
                <td className="px-1 py-1.5">
                  <select value={row.route} onChange={(e) => update(i, "route", e.target.value)} className={`${inputCls} text-xs py-1.5`}>
                    <option value="">Route</option>
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
        className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition flex items-center gap-1"
      >
        <span className="text-base leading-none">+</span> Add Medication
      </button>
    </div>
  );
}

// ── Orders Panel (Lab / Rad) ──────────────────────────────────────────────────
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
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {presets.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
              className="w-4 h-4 rounded border-slate-300 accent-teal-600 cursor-pointer"
            />
            <span className="text-xs text-slate-600 group-hover:text-slate-900 transition">{item}</span>
          </label>
        ))}
      </div>

      {custom.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {custom.map((item) => (
            <span key={item} className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-full">
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
        placeholder="Add custom order and press Enter…"
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DoctorScreen() {
  const queuePatients      = useAgialStore((s) => s.queuePatients);
  const updateQueueStatus  = useAgialStore((s) => s.updateQueueStatus);

  const queueRows = queuePatients.length > 0 ? queuePatients : [
    { qid: 0, patient: { name: "Ahmed Ali", dob: "", mrn: "", mobile: "" }, visit: { doctor: "Dr. Hassan", clinic: "General Medicine" }, _status: "Waiting" },
  ];

  // ── selected patient ──────────────────────────────────────────────────────
  const [selectedQid, setSelectedQid] = useState(null);
  const [savedData,   setSavedData]   = useState({}); // qid → form snapshot

  // ── live form state ───────────────────────────────────────────────────────
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

  const bmi = vitals.weight && vitals.height
    ? (vitals.weight / ((vitals.height / 100) ** 2)).toFixed(1)
    : "";

  const toggleRisk = (r) =>
    setRiskFactors((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const selectedEntry = queueRows.find((e) => e.qid === selectedQid) ?? null;
  const isReadOnly    = selectedEntry?._status === "Complete";

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
    if (!selectedQid) return alert("Select a patient from the queue first.");
    setSavedData((prev) => ({ ...prev, [selectedQid]: snapshot() }));
    alert("Saved!");
  };

  const handleComplete = () => {
    if (!selectedQid) return alert("Select a patient from the queue first.");
    setSavedData((prev) => ({ ...prev, [selectedQid]: snapshot() }));
    updateQueueStatus(selectedQid, "Complete");
    alert("Visit completed!");
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900 rounded-2xl">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="text-center py-8 relative" style={{
            backgroundImage: "linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Doctor Screen</h1>
          </div>
        </div>

        {/* Doctor Queue */}
        <div className={sectionCls}>
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-[#13534c]/80 to-[#1f7e74]/80 flex items-center gap-2">
            <h2 className="text-white font-bold text-lg uppercase tracking-wide">Doctor Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Queue", "Patient", "Clinic", "Doctor", "Status", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queueRows.map((entry, i) => {
                  const isSelected  = entry.qid === selectedQid;
                  const isCompleted = entry._status === "Complete";
                  return (
                    <tr
                      key={entry.qid}
                      onClick={() => selectPatient(entry)}
                      className={`border-b border-slate-50 cursor-pointer transition ${
                        isSelected ? "bg-teal-50 border-l-4 border-l-teal-500" : "hover:bg-emerald-50/50"
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-teal-700">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{entry.patient.name}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.visit?.clinic || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.visit?.doctor || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                          {entry._status || "Waiting"}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition">Open</button>
                          <button
                            onClick={() => window.open(INPATIENT_URL, "_blank")}
                            className="px-3 py-1.5 text-xs font-bold bg-violet-600/80 text-white rounded-lg hover:bg-violet-700/80 transition shadow"
                          >
                            Inpatient
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Patient info banner */}
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
              <span className="text-xs font-bold bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full">Visit Complete — Read Only</span>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-center text-sm text-slate-400">
            Click a patient row above to open their visit
          </div>
        )}

        {/* Clinical sections — disabled when visit is complete */}
        <div className={isReadOnly ? "pointer-events-none opacity-60 select-none" : ""}>

        {/* Diagnoses — full width row */}
        <div className={sectionCls}>
          <div className={headerCls}>
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <h3 className="text-sm font-bold text-slate-700">Diagnoses</h3>
            <span className="ml-auto text-xs text-slate-400">ICD-10</span>
          </div>
          <DiagnosesPanel selected={diagnoses} setSelected={setDiagnoses} />
        </div>
        {/* Lab + Radiology — 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className={sectionCls}>
            <div className={headerCls}>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-bold text-slate-700">Lab Orders</h3>
              <span className="ml-auto text-xs text-slate-400">ALB</span>
            </div>
            <OrdersPanel
              presets={COMMON_LABS}
              selected={labSelected}
              setSelected={setLabSelected}
              custom={labCustom}
              setCustom={setLabCustom}
            />
          </div>

          <div className={sectionCls}>
            <div className={headerCls}>
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <h3 className="text-sm font-bold text-slate-700">Radiology Orders</h3>
              <span className="ml-auto text-xs text-slate-400">RAD</span>
            </div>
            <OrdersPanel
              presets={COMMON_RAD}
              selected={radSelected}
              setSelected={setRadSelected}
              custom={radCustom}
              setCustom={setRadCustom}
            />
          </div>
        </div>

        {/* Clinical Grid — 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Col 1: Chief Complaint + Allergy */}
          <div className="flex flex-col gap-5">
            <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <h3 className="text-sm font-bold text-slate-700">Chief Complaint</h3>
              </div>
              <div className="p-4">
                <textarea
                  rows={4}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Describe the main complaint…"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            <div className={`${sectionCls} flex-1`}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <h3 className="text-sm font-bold text-slate-700">Allergy</h3>
              </div>
              <AllergyInput tags={allergies} setTags={setAllergies} />
            </div>
          </div>

          {/* Col 2: Vital Signs + Risk Factors */}
          <div className="flex flex-col gap-5">
            <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <h3 className="text-sm font-bold text-slate-700">Vital Signs</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">BP Systolic</label>
                  <input value={vitals.bpSys} onChange={(e) => setVitals({ ...vitals, bpSys: e.target.value })} placeholder="mmHg" className={`${inputCls} text-xs py-1.5`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">BP Diastolic</label>
                  <input value={vitals.bpDia} onChange={(e) => setVitals({ ...vitals, bpDia: e.target.value })} placeholder="mmHg" className={`${inputCls} text-xs py-1.5`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Pulse</label>
                  <input value={vitals.pulse} onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })} placeholder="bpm" className={`${inputCls} text-xs py-1.5`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Temperature</label>
                  <input value={vitals.temp} onChange={(e) => setVitals({ ...vitals, temp: e.target.value })} placeholder="°C" className={`${inputCls} text-xs py-1.5`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">O₂ Saturation</label>
                  <input value={vitals.o2sat} onChange={(e) => setVitals({ ...vitals, o2sat: e.target.value })} placeholder="%" className={`${inputCls} text-xs py-1.5`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Weight (kg)</label>
                  <input value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} placeholder="kg" className={`${inputCls} text-xs py-1.5`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Height (cm)</label>
                  <input value={vitals.height} onChange={(e) => setVitals({ ...vitals, height: e.target.value })} placeholder="cm" className={`${inputCls} text-xs py-1.5`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">BMI</label>
                  <div className={`${inputCls} text-xs py-1.5 bg-slate-50 text-slate-500`}>
                    {bmi || "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${sectionCls} flex-1`}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h3 className="text-sm font-bold text-slate-700">Risk Factors</h3>
              </div>
              <div className="p-4 grid grid-cols-1 gap-2">
                {RISK_FACTORS.map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={riskFactors.includes(r)}
                      onChange={() => toggleRisk(r)}
                      className="w-4 h-4 rounded border-slate-300 accent-teal-600 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{r}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3: Medication Profile */}
          <div className="flex flex-col gap-5">
            <div className={`${sectionCls} flex-1`}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold text-slate-700">Medication Profile</h3>
              </div>
              <MedicationProfile rows={medications} setRows={setMedications} />
            </div>
          </div>
        </div>

        </div>{/* end clinical read-only wrapper */}

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition active:scale-95"
          >
            Save
          </button>
          <button
            onClick={handleComplete}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-700/80 hover:bg-teal-800/80 text-white transition shadow active:scale-95"
          >
            Complete Visit
          </button>
        </div>

      </div>
    </div>
  );
}
