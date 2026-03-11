import React, { useState } from 'react'
import { Field } from './input';

export default function VitalSigns() {
      const [vitals, setVitals] = useState({
        bloodPressure: "",
        temperature: "",
        tempUnit: "°C",
        pulse: "",
        respiratoryRate: "",
        respiratoryUnit: "m2",
        oxygenSaturation: "",
        weight: "",
        height: "",
        bmi: "",
      });
     const handleVitalChange = (field, value) => {
        setVitals((prev) => ({ ...prev, [field]: value }));
    
        if (field === "weight" || field === "height") {
          const w = field === "weight" ? parseFloat(value) : parseFloat(vitals.weight);
          const h = field === "height" ? parseFloat(value) : parseFloat(vitals.height);
          if (w && h) {
            const heightM = h / 100;
            setVitals((prev) => ({
              ...prev,
              [field]: value,
              bmi: (w / (heightM * heightM)).toFixed(1),
            }));
          }
        }
      };
  return (
     <div className="">
          <div className="bg-gradient-to-r  from-[#13534c] to-[#1f7e74] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Vital Signs</h2>
          </div>
          <div className="px-4 py-3 space-y-3">
            {/* Row 1 */}
            <div className="flex items-center gap-4 flex-wrap">
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)]">
                        <Field label={'Blood Pressure:'} type='text' name={'bloodPressure'} value={vitals.bloodPressure} onChange={(e) => handleVitalChange("bloodPressure", e.target.value)}  />
              </div>
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)]">
                                    <Field label={'Temperature:'} type='text' name={'temperature'} value={vitals.temperature} onChange={(e) => handleVitalChange("temperature", e.target.value)}  />
            
                {/* <select
                  value={vitals.tempUnit}
                  onChange={(e) => handleVitalChange("tempUnit", e.target.value)}
                  className="border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option>°C</option>
                  <option>°F</option>
                </select> */}
              </div>
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)] relative">
                                    <Field label={'Pulse:'} type='text' name={'pulse'} value={vitals.pulse} onChange={(e) => handleVitalChange("pulse", e.target.value)}  />
        
              <span className="text-xs text-gray-500 absolute top-[50%] right-[10px]">nm</span>
        
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 flex-wrap">
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)]">
            <Field label={'Respiratory Rate:'} type='text' name={'respiratoryRate'} value={vitals.respiratoryRate} onChange={(e) => handleVitalChange("respiratoryRate", e.target.value)}  />
          </div>
           <div className='w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)]'>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">m2</span>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 transition">
                  <option></option>
                  <option>Normal</option>
                  <option>Abnormal</option>
              </select>
              </div>
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)] relative">
                        <Field label={'Oxygen Saturation:'} type='text' name={'oxygenSaturation'} value={vitals.oxygenSaturation} onChange={(e) => handleVitalChange("oxygenSaturation", e.target.value)}  />
                <span className="text-xs text-gray-500 absolute top-[50%] right-[10px]">mgnl</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 flex-wrap">
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)]">
                                    <Field label={'Weight:'} type='text' name={'weight'} value={vitals.weight} onChange={(e) => handleVitalChange("weight", e.target.value)}  />
              </div>
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)] relative">
                                                <Field label={'Height:'} type='text' name={'height'} value={vitals.height} onChange={(e) => handleVitalChange("height", e.target.value)}  />
               
                <span className="text-xs text-gray-500 absolute top-[50%] right-[5px]">hg</span>
              </div>
          <div className="w-full md:w-[calc(100%/2-16px)] lg:w-[calc(100%/3-16px)] relative">
                                                <Field label={'BMI:'} type='text' name={'bmi'} value={vitals.bmi} onChange={(e) => handleVitalChange("bmi", e.target.value)}  />
                <span className="text-xs text-gray-500 absolute top-[50%] right-[5px]">hg</span>
              </div>
            </div>
          </div>
        </div>
  )
}
