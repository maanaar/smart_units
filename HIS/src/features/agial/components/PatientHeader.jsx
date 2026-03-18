import { User, Pencil, PlusCircle } from 'lucide-react';

export default function PatientHeader({ patient, onEdit, onNewVisit }) {
  if (!patient) return null;

  const infoItems = [
    { label: 'رقم الملف',      value: patient.mrn },
    { label: 'العمر',          value: patient.age ? `${patient.age} سنة` : null },
    { label: 'الجنس',          value: patient.gender },
    { label: 'تاريخ الميلاد',  value: patient.date_of_birth || null },
    { label: 'الجوال',         value: patient.mobile },
    { label: 'التأمين',        value: patient.insurance_company || null },
    { label: 'الخطة',          value: patient.insurance_plan || null },
    { label: 'النوع',          value: patient.patient_type },
  ].filter((i) => i.value);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">

      {/* ── Dark green header band ── */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 px-6 py-4 flex items-center gap-5">

        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-white/80" />
        </div>

        {/* Name block */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white leading-tight truncate">
            {patient.name}
          </h2>
          {patient.english_name && (
            <p className="text-emerald-300 text-sm mt-0.5 truncate">{patient.english_name}</p>
          )}
          {/* MRN pill */}
          <span className="inline-block mt-1.5 text-xs font-semibold bg-white/10 text-emerald-200 px-2.5 py-0.5 rounded-full border border-white/10">
            رقم الملف: {patient.mrn}
          </span>
        </div>

        {/* Visit count badges */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <CountBadge label="IVF" value={patient.count_ivf_clinic} />
          <CountBadge label="OPD" value={patient.count_opd_clinic} />
          <CountBadge label="INP" value={patient.count_general_inpatient} />
          <CountBadge label="Cycles" value={patient.count_ivf_cycle} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            تعديل
          </button>
          <button
            onClick={onNewVisit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-teal-400 text-emerald-900 rounded-lg hover:bg-teal-300 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            زيارة جديدة
          </button>
        </div>
      </div>

      {/* ── Info bar ── */}
      <div className="bg-white px-6 py-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {infoItems.map((item, idx) => (
          <span key={item.label} className="flex items-center gap-1.5 text-sm">
            {idx > 0 && <span className="text-gray-200 select-none">|</span>}
            <span className="text-gray-400 font-medium">{item.label}:</span>
            <span className="text-gray-800 font-semibold">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CountBadge({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 min-w-[52px]">
      <span className="text-white font-bold text-lg leading-tight">{value ?? '—'}</span>
      <span className="text-emerald-300 text-[10px] font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
}
