import React from 'react'

export default function PatientQueue() {
  return (
       <div className="border-b border-gray-300">
          {/* <div className="bg-[#9BD0CE] border-b border-gray-300 px-4 py-2"> */}
          <div className="bg-gradient-to-r  from-[#13534c] to-[#1f7e74] px-6 py-4">
            <h2 className="text-3xl font-semibold text-white ">Patient Queue</h2>
          </div>
          <div className="">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-300">
                  <th className="py-2 font-semibold w-16 pl-2 border border-gray-200 text-lg">Queue</th>
                  <th className="py-2 font-semibold border pl-2 border-gray-200 text-lg">Patient</th>
                  <th className="py-2 font-semibold border pl-2 border-gray-200 text-lg">Doctor</th>
                  <th className="py-2 font-semibold border pl-2 border-gray-200 text-lg">Status</th>
                  <th className="py-2 font-semibold border pl-2 border-gray-200 text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-700">
                  <td className="py-2 pl-2 border border-gray-200 text-base">15</td>
                  <td className="py-2 pl-2 border border-gray-200 text-base">Ahmed Ali</td>
                  <td className="py-2 pl-2 border border-gray-200 text-base">Dr. Hassan</td>
                  <td className="py-2 pl-2 border border-gray-200 text-base">Waiting</td>
                  <td className="py-2 pl-2 border border-gray-200 text-base flex gap-3">
                    <button className=" text-teal-900 border border-teal-900 hover:text-white hover:bg-teal-900 rounded-2xl text-sm px-6 py-1  transition-colors">
                      Start
                              </button>
                                 <button className=" bg-teal-900 text-white hover:text-teal-900 hover:bg-white border border-teal-900 text-sm px-6 py-1 rounded-2xl transition-colors">
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
