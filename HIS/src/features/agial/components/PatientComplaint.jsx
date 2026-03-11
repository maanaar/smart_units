import React, { useState } from 'react'

export default function PatientComplaint() {
      const [complaint, setComplaint] = useState({
    chiefComplaint: "",
    symptoms: false,
    recommends: false,
  });

  return (
     <div className="border-b border-gray-300">
          <div className="bg-gradient-to-r  from-[#13534c] to-[#1f7e74] px-6 py-4">
            <h2 className="text-3xl font-semibold text-white">Patient Complaint</h2>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-base text-gray-600 whitespace-nowrap">Chief Complaint:</label>
              <input
                type="text"
                value={complaint.chiefComplaint}
                onChange={(e) => setComplaint((prev) => ({ ...prev, chiefComplaint: e.target.value }))}
                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={complaint.symptoms}
                  onChange={(e) => setComplaint((prev) => ({ ...prev, symptoms: e.target.checked }))}
                  className="rounded"
                />
                Symptoms
              </label>
              <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={complaint.recommends}
                  onChange={(e) => setComplaint((prev) => ({ ...prev, recommends: e.target.checked }))}
                  className="rounded"
                />
                Recommends
              </label>
            </div>
          </div>
        </div>
  )
}
