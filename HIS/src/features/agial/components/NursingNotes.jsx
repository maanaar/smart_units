import React, { useState } from 'react'

export default function NursingNotes() {
     const [nursingNotes, setNursingNotes] = useState("");
  return (
      <div className="">
          <div className="bg-gradient-to-r  from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Nursing Notes</h2>
           
          </div>
          <div className="px-4 py-3">
            <textarea
              value={nursingNotes}
              onChange={(e) => setNursingNotes(e.target.value)}
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 transition"
              placeholder="Enter nursing notes here..."
            />
          </div>
                  </div>
  )
}
