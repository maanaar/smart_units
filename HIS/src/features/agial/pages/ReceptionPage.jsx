import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OCR_ENDPOINT = "/id_scanner";

const genderOptions = ["Male", "Female",];
const visitTypes = ["New", "Follow-up", "Consultation"];
const paymentTypes = ["Cash", "Insurance", "Contract"];

const today = new Date().toISOString().split("T")[0];

export default function ReceptionScreen() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    mrn: "", name: "", nationalId: "", mobile: "",
    dob: "", gender: "", insurance: "", address: "",
  });
  const [visit, setVisit] = useState({
    visitDate: today, clinic: "", doctor: "",
    visitType: "New", payment: "Cash",
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
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      const data = json.extracted_data ?? {};
      setPatient((prev) => ({
        ...prev,
        name:       data.full_name   ?? prev.name,
        nationalId: data.national_id ?? prev.nationalId,
        address:    data.address     ?? prev.address,
      }));
    } catch (err) {
      setOcrError(err.message || "OCR failed");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleCreateVisit = (e) => {
    e.preventDefault();
    alert("Visit created!\n" + JSON.stringify({ patient, visit }, null, 2));
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-100 to-blue-50 flex items-start justify-center py-5 px-4 font-sans">
      <div className="w-full ">
        {/* Header */}
              <div className=" relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900  rounded-2xl">
      {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" />


        <div className="text-center py-10  relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900" style={{
          backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}>
         
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Reception Screen
          </h1>
          {/* <p className="text-[#bdbdbd] text-sm mt-1">Register patients and manage visit queues</p> */}
        </div>
        </div>

        <form onSubmit={handleCreateVisit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">

            {/* Patient Search & Registration */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r  from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4 ">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                   Patient Search & Registration
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <Field label="MRN" name="mrn" value={patient.mrn} onChange={handlePatient} placeholder="e.g. MRN-00123" />
                <Field label="Name" name="name" value={patient.name} onChange={handlePatient} placeholder="Full name" required />

                {/* ── ID Card OCR Scanner ── */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scan National ID Card</p>

                  <div
                    className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4 rounded-lg bg-white border border-slate-200 hover:border-teal-400 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {ocrPreview ? (
                      <img src={ocrPreview} alt="ID preview" className="max-h-32 rounded-lg object-contain" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-xs text-slate-400">Click to upload ID image</span>
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
                        Scanning…
                      </>
                    ) : "Scan & Fill Fields"}
                  </button>

                  {ocrError && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{ocrError}</p>
                  )}
                </div>

                <Field label="National ID" name="nationalId" value={patient.nationalId} onChange={handlePatient} placeholder="National ID number" />
                <Field label="Mobile" name="mobile" value={patient.mobile} onChange={handlePatient} type="tel" placeholder="+20 1xx xxx xxxx" />

                {/* DOB + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Date of Birth
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
                      Gender
                    </label>
                    <select name="gender" value={patient.gender} onChange={handlePatient} className={inputCls}>
                      <option value="">Select</option>
                      {genderOptions.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Insurance
                  </label>
                  <select name="insurance" value={patient.insurance} onChange={handlePatient} className={inputCls}>
                    <option value="">— Select Insurance —</option>
                    <option>Misr Insurance</option>
                    <option>AXA</option>
                    <option>MetLife</option>
                    <option>GIG Insurance</option>
                    <option>Allianz</option>
                  </select>
                </div>

                <Field label="Address" name="address" value={patient.address} onChange={handlePatient} placeholder="City, Street..." />
              </div>
            </div>

            {/* Visit Registration */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r  from-[#1f7e74]/80 to-[#13534c]/80  px-6 py-4">
                <h2 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                   Visit Registration
                </h2>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Visit Date
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
                    Clinic
                  </label>
                  <select name="clinic" value={visit.clinic} onChange={handleVisit} className={inputCls} required>
                    <option value="">— Select Clinic —</option>
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Neurology</option>
                    <option>Dermatology</option>
                    <option>Pediatrics</option>
                    <option>General Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Doctor
                  </label>
                  <select name="doctor" value={visit.doctor} onChange={handleVisit} className={inputCls} required>
                    <option value="">— Select Doctor —</option>
                    <option>Dr. Ahmed Hassan</option>
                    <option>Dr. Sara Mahmoud</option>
                    <option>Dr. Khaled Nasser</option>
                    <option>Dr. Mona Ibrahim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Visit Type
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
                    Payment
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
                   Create Visit
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                   Print Ticket
                </button>
                <button
                  type="button"
                  className="flex-1 bg-teal-600/80 hover:bg-teal-700/80 active:scale-95 text-white font-bold py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                   Send to Queue
                </button>
              </div>
            </div>
          </div>
        </form>
        <div>
          <button
            id="arButton"
            type="button"
            onClick={() => navigate("/agial/AR/ReceptionPage")}
            className="mt-6 bg-teal-900/80 text-white hover:bg-teal-700/80 text-base rounded-2xl transition-colors px-6 py-3"
          >
            AR
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 transition";

function Field({ label, name, value, onChange, type = "text", placeholder = "", required = false }) {
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
        className={inputCls}
      />
    </div>
  );
}