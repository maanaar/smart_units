import React from 'react'

export default function PatientQueue() {
  return (
       <div className=" ">
          {/* <div className="bg-[#9BD0CE] border-b border-gray-300 px-4 py-2"> */}
          <div className="bg-gradient-to-r  from-[#13534c] to-[#1f7e74] px-6 py-4">
            <h2 className="text-xl font-semibold text-white ">Patient Queue</h2>
          </div>
          <div className="">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-300">
                  <th className="py-2 font-semibold w-16 px-2  text-lg">Queue</th>
                  <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Patient</th>
                  <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Doctor</th>
                  <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Status</th>
                  <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-700">
                  <td className="py-2 px-2  text-base">15</td>
                  <td className="py-2 px-2 border-l border-gray-200 text-base">Ahmed Ali</td>
                  <td className="py-2 px-2 border-l border-gray-200 text-base">Dr. Hassan</td>
                  <td className="py-2 px-2 border-l border-gray-200 text-base">Waiting</td>
                  <td className="py-2 px-2 border-l border-gray-200 text-base flex gap-3">
                    <button className="  bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold px-6 py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2">
                      Start
                </button>
   
                                 <button className=" bg-teal-600 text-white active:scale-95 hover:bg-teal-700  font-bold   px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                      Start
                </button>
                
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  )
}
