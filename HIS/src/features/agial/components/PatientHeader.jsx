import { User } from 'lucide-react';

export default function PatientHeader({ patient, onEdit, onNewVisit }) {
  if (!patient) return null;

  const infoItems = [
    { label: 'MRN',      value: patient.mrn },
    { label: 'Age',      value: patient.age ? `${patient.age}` : null },
    { label: 'Gender',   value: patient.gender },
    { label: 'Type',     value: patient.patient_type },
    { label: 'Phone',    value: patient.mobile },
    { label: 'Insurance',value: patient.insurance_company || null },
  ].filter((i) => i.value);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Top row: avatar + name + actions */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="w-7 h-7 text-gray-500" />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{patient.name}</h2>
          {patient.english_name && (
            <p className="text-sm text-gray-400">{patient.english_name}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onNewVisit}
            className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            New Visit
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 mt-3 text-sm text-gray-600">
        {infoItems.map((item, idx) => (
          <span key={item.label} className="flex items-center gap-1">
            {idx > 0 && <span className="text-gray-300 mr-1">|</span>}
            <span className="font-semibold text-gray-800">{item.label}:</span>
            <span>{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
