import React, { useState } from 'react'

export default function NursingNotes() {
     const [nursingNotes, setNursingNotes] = useState("");
  return (
      <div>
          <div className="bg-gradient-to-r  from-[#13534c] to-[#1f7e74] px-6 py-4">
            <h2 className="text-3xl font-semibold text-white">Nursing Notes</h2>
           
          </div>
          <div className="px-4 py-3">
            <textarea
              value={nursingNotes}
              onChange={(e) => setNursingNotes(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
              placeholder="Enter nursing notes here..."
            />
          </div>
                  </div>
  )
}
