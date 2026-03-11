import { useState } from "react";

const conditionsList = ["Diabetes", "Hypertension", "Cardiac Disease", "Asthma", "Surgery", "Other"];
const labOrders = ["CBC", "CRP", "CT Scan", "MRI", "X-Ray", "Urine Analysis"];

export default function DoctorScreen() {
  const [activePatient] = useState({
    queue: 15, name: "Ahmed Ali", age: 35, complaint: "Chest pain", status: "Waiting",
  });

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [pastHistory, setPastHistory] = useState([]);
  const [presentIllness, setPresentIllness] = useState([]);
  const [prescription, setPrescription] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [pastHistoryDrops, setPastHistoryDrops] = useState({ type: "", detail: "" });
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [examRows, setExamRows] = useState([{ dose: "", frequency: "", duration: "" }]);
  const [visitStarted, setVisitStarted] = useState(false);

  const toggleCheck = (list, setList, val) =>
    setList((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const toggleLab = (lab) =>
    setSelectedLabs((prev) => prev.includes(lab) ? prev.filter((l) => l !== lab) : [...prev, lab]);

  const handleSave = () => alert("Saved!\n" + JSON.stringify({ chiefComplaint, pastHistory, presentIllness, prescription, doctorNotes, selectedLabs }, null, 2));
  const handleComplete = () => alert("Visit completed!");

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#129459]/40 focus:border-[#129459] bg-white transition placeholder:text-slate-300";
  const sectionCls = "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden";
  const headerCls = "px-4 py-3 border-b border-slate-100 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 py-6 px-3 sm:px-6">
      <div className="max-w-8xl mx-auto space-y-5">

        {/* Page Header */}
 {/* Header */}
              <div className=" relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900  rounded-2xl">
      {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" />


        <div className="text-center py-10  relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900" style={{
          backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}>
         
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Doctor Screen
          </h1>
        </div>
        </div>


        {/* Doctor Queue */}
        <div className={sectionCls}>
          <div className={`${headerCls} bg-gradient-to-r  from-[#13534c] to-[#1f7e74] `}>
            <h2 className="text-white font-bold text-lg tracking-wide uppercase">Doctor Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Queue", "Patient", "Age", "Complaint", "Status", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-50 hover:bg-emerald-50/50 transition">
                  <td className="px-4 py-3 font-bold text-[#129459]">{activePatient.queue}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{activePatient.name}</td>
                  <td className="px-4 py-3 text-slate-600">{activePatient.age}</td>
                  <td className="px-4 py-3 text-slate-600">{activePatient.complaint}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block"></span>
                      {activePatient.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setVisitStarted(true)}
                        className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                      >Start</button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-[#129459] text-white rounded-lg hover:bg-emerald-700 transition shadow">Open</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Clinical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Chief Complaint + Past History */}
          <div className="flex flex-col gap-5">
            {/* Chief Complaint */}
            <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-[#129459]"></span>
                <h3 className="text-lg font-bold text-slate-700">Chief Complaint</h3>
              </div>
              <div className="p-4">
                <textarea
                  rows={3}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Describe the main complaint..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Past History Checkboxes */}
            <div className={`${sectionCls} flex-1`}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <h3 className="text-lg font-bold text-slate-700">Past History</h3>
              </div>
              <div className="p-4 space-y-2">
                {conditionsList.map((c) => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={pastHistory.includes(c)}
                      onChange={() => toggleCheck(pastHistory, setPastHistory, c)}
                      className="w-4 h-4 rounded border-slate-300 text-[#129459] accent-[#129459] cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* History of Present Illness + Prescription */}
          <div className="flex flex-col gap-5">
            {/* Present Illness */}
            <div className={`${sectionCls} flex-1`}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <h3 className="text-lg font-bold text-slate-700">History of Present Illness</h3>
              </div>
              <div className="p-4 space-y-2">
                {conditionsList.map((c) => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={presentIllness.includes(c)}
                      onChange={() => toggleCheck(presentIllness, setPresentIllness, c)}
                      className="w-4 h-4 rounded border-slate-300 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prescription */}
            <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <h3 className="text-lg font-bold text-slate-700">Prescription</h3>
              </div>
              <div className="p-4">
                <textarea
                  rows={3}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Enter prescription details..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Past History Dropdowns + Examination */}
          <div className="flex flex-col gap-5 md:col-span-2 xl:col-span-1">
            {/* Past History Selects */}
            <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <h3 className="text-lg font-bold text-slate-700">Past History</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <select
                  value={pastHistoryDrops.type}
                  onChange={(e) => setPastHistoryDrops({ ...pastHistoryDrops, type: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Type</option>
                  <option>Surgical</option>
                  <option>Medical</option>
                  <option>Family</option>
                  <option>Social</option>
                </select>
                <select
                  value={pastHistoryDrops.detail}
                  onChange={(e) => setPastHistoryDrops({ ...pastHistoryDrops, detail: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Detail</option>
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                  <option>Chronic</option>
                </select>
              </div>
            </div>

            {/* Examination / Lab Orders */}
            <div className={`${sectionCls} flex-1`}>
              <div className={`${headerCls}  bg-gradient-to-r  from-[#13534c] to-[#1f7e74]`}>
                <h3 className="text-lg font-bold text-white">Examination</h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Lab Orders Header */}
                <div className="grid grid-cols-4 gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  <span className="col-span-1">Lab Orders</span>
                  <span>Dose</span>
                  <span>Freq.</span>
                  <span>Duration</span>
                </div>

                {/* Lab Buttons */}
                <div className="flex flex-wrap gap-2">
                  {labOrders.map((lab) => (
                    <button
                      key={lab}
                      type="button"
                      onClick={() => toggleLab(lab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedLabs.includes(lab)
                          ? "bg-[#129459] text-white border-[#129459] shadow"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:border-[#129459] hover:text-[#129459]"
                      }`}
                    >
                      {lab}
                    </button>
                  ))}
                </div>

                {/* Exam Rows */}
                {selectedLabs.length > 0 && (
                  <div className="space-y-2">
                    {selectedLabs.map((lab, i) => (
                      <div key={lab} className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-xs font-semibold text-[#129459] truncate">{lab}</span>
                        <input placeholder="Dose" className={`${inputCls} text-xs py-1.5`} />
                        <input placeholder="Freq" className={`${inputCls} text-xs py-1.5`} />
                        <input placeholder="Days" className={`${inputCls} text-xs py-1.5`} />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="w-full mt-2 py-2 rounded-xl text-sm font-bold  bg-gradient-to-r  from-[#13534c] to-[#1f7e74] text-white hover:from-[#22877c]  hover:to-[#19423e] transition shadow"
                >
                  Send to Radiology
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Notes + Actions Footer */}
        <div className={`${sectionCls}`}>
          <div className={headerCls}>
            <span className="w-2 h-2 rounded-full bg-[#129459]"></span>
            <h3 className="text-lg font-bold text-slate-700">Doctor Notes</h3>
          </div>
          <div className="p-4">
            <textarea
              rows={3}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Add clinical notes, observations, or follow-up instructions..."
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="px-4 pb-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-sm bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-3 rounded-xl border border-slate-300  transition"
            >
               Save
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl text-sm font-bold  bg-[#1c6a60] hover:bg-[#226e59]  text-white  active:scale-95 text-white font-bold transition shadow-md"
            >
              Complete Visit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}