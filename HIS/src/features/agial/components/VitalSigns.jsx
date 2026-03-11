import React, { useState } from 'react'

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
     <div className="border-b border-gray-300">
          <div className="bg-gradient-to-r  from-[#13534c] to-[#1f7e74] px-6 py-4">
            <h2 className="text-3xl font-semibold text-white">Vital Signs</h2>
          </div>
          <div className="px-4 py-3 space-y-3">
            {/* Row 1 */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">Blood Pressure:</label>
                <input
                  type="text"
                  value={vitals.bloodPressure}
                  onChange={(e) => handleVitalChange("bloodPressure", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">Temperature:</label>
                <input
                  type="text"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalChange("temperature", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                {/* <select
                  value={vitals.tempUnit}
                  onChange={(e) => handleVitalChange("tempUnit", e.target.value)}
                  className="border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option>°C</option>
                  <option>°F</option>
                </select> */}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-gray-600 whitespace-nowrap">Pulse:</label>
                <input
                  type="text"
                  value={vitals.pulse}
                  onChange={(e) => handleVitalChange("pulse", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-xs text-gray-500">nm</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">Respiratory Rate:</label>
                <input
                  type="text"
                  value={vitals.respiratoryRate}
                  onChange={(e) => handleVitalChange("respiratoryRate", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-xs text-gray-500">m2</span>
                <select className="border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option></option>
                  <option>Normal</option>
                  <option>Abnormal</option>
                </select>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-gray-600 whitespace-nowrap">Oxygen Saturation:</label>
                <input
                  type="text"
                  value={vitals.oxygenSaturation}
                  onChange={(e) => handleVitalChange("oxygenSaturation", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-xs text-gray-500">mgnl</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">Weight:</label>
                <input
                  type="text"
                  value={vitals.weight}
                  onChange={(e) => handleVitalChange("weight", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">Height:</label>
                <input
                  type="text"
                  value={vitals.height}
                  onChange={(e) => handleVitalChange("height", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-xs text-gray-500">hg</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">BMI:</label>
                <input
                  type="text"
                  value={vitals.bmi}
                  readOnly
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-24 bg-gray-50 focus:outline-none"
                />
                <span className="text-xs text-gray-500">hg</span>
              </div>
            </div>
          </div>
        </div>
  )
}
