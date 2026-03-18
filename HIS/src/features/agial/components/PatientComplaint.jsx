import { useState } from 'react'

export default function PatientComplaint() {
  const [complaint, setComplaint] = useState({
    chiefComplaint: '',
    symptoms: false,
    recommends: false,
  });

  return (
    <div>
      <div className="p-5 space-y-4" dir="rtl">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">الشكوى الرئيسية</label>
          <input
            type="text"
            value={complaint.chiefComplaint}
            onChange={e => setComplaint(p => ({ ...p, chiefComplaint: e.target.value }))}
            placeholder="أدخل الشكوى الرئيسية..."
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition"
          />
        </div>
        <div className="flex items-center gap-6">
          {[
            { key: 'symptoms',   label: 'الأعراض'    },
            { key: 'recommends', label: 'التوصيات'   },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={complaint[key]}
                onChange={e => setComplaint(p => ({ ...p, [key]: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-400 accent-teal-600"
              />
              <span className="text-sm text-gray-700 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
