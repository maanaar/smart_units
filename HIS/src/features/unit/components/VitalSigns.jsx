import { useState } from 'react'
import { Field } from './input';

export default function VitalSigns() {
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    temperature: '',
    pulse: '',
    respiratoryRate: '',
    respiratoryType: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bmi: '',
  });

  const handleVitalChange = (field, value) => {
    setVitals((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'weight' || field === 'height') {
        const w = field === 'weight' ? parseFloat(value) : parseFloat(prev.weight);
        const h = field === 'height' ? parseFloat(value) : parseFloat(prev.height);
        if (w && h) next.bmi = (w / ((h / 100) ** 2)).toFixed(1);
      }
      return next;
    });
  };

  const fields = [
    { label: 'ضغط الدم',       name: 'bloodPressure',   unit: 'mmHg' },
    { label: 'درجة الحرارة',    name: 'temperature',     unit: '°C'   },
    { label: 'النبض',           name: 'pulse',           unit: 'نبضة/د' },
    { label: 'معدل التنفس',     name: 'respiratoryRate', unit: 'مرة/د' },
    { label: 'تشبع الأكسجين',   name: 'oxygenSaturation',unit: '%'    },
    { label: 'الوزن',           name: 'weight',          unit: 'كغ'   },
    { label: 'الطول',           name: 'height',          unit: 'سم'   },
    { label: 'مؤشر كتلة الجسم', name: 'bmi',             unit: 'kg/m²', readOnly: true },
  ];

  return (
    <div>
      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" dir="rtl">
        {fields.map(({ label, name, unit, readOnly }) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
            <div className="relative">
              <input
                type="text"
                value={vitals[name]}
                onChange={e => !readOnly && handleVitalChange(name, e.target.value)}
                readOnly={readOnly}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition pr-12
                  ${readOnly
                    ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-default'
                    : 'bg-white border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-400'
                  }`}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium whitespace-nowrap">{unit}</span>
            </div>
          </div>
        ))}

        {/* Respiratory type select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">نوع التنفس</label>
          <select
            value={vitals.respiratoryType}
            onChange={e => handleVitalChange('respiratoryType', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition"
          >
            <option value="">اختر...</option>
            <option value="طبيعي">طبيعي</option>
            <option value="غير طبيعي">غير طبيعي</option>
          </select>
        </div>
      </div>
    </div>
  );
}
