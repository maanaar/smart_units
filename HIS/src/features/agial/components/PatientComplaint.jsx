import React, { useState } from 'react'
import { Field } from './input';

export default function PatientComplaint() {
      const [complaint, setComplaint] = useState({
    chiefComplaint: "",
    symptoms: false,
    recommends: false,
  });

  return (
     <div className="">
          <div className="bg-gradient-to-r  from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Patient Complaint</h2>
          </div>
          <div className="px-4 py-3 space-y-3">
        <div className="">
                                  <Field label={'Chief Complaint:'} type='text' name={'chiefComplaint'} value={complaint.chiefComplaint} onChange={(e) => setComplaint((prev) => ({ ...prev, chiefComplaint: e.target.value }))}  />

            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={complaint.symptoms}
                  onChange={(e) => setComplaint((prev) => ({ ...prev, symptoms: e.target.checked }))}
                  className="rounded "
                />
                Symptoms
              </label>
              <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={complaint.recommends}
                  onChange={(e) => setComplaint((prev) => ({ ...prev, recommends: e.target.checked }))}
                  className="rounded "
                />
                Recommends
              </label>
            </div>
          </div>
        </div>
  )
}
