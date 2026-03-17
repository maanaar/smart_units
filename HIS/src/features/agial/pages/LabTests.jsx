import React from 'react'
import { useState } from 'react';
import ListView from '../components/ListView';

// export  function LabTests() {

//   return (
//       <div>
//           <div className="h-screen py-5 px-4 overflow-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
//               {/* Header */}
//               <div class="flex-shrink-0 px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
//                   <div class="w-1 h-7 rounded-full bg-emerald-600"></div>
//                   <div className='flex justify-between w-full items-center'>
//                       <div>
//                           <h1 class="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">Lab Request</h1>
//                           </div>
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">      
//                         3 Requests
//                       </span>
//                       </div>
//               </div>
    
//               {/* Content */}
//                 <div className="my-5 rounded-2xl  overflow-hidden border border-gray-200">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className=" text-white  bg-teal-700">
//               <th className="py-2 font-semibold  px-2 text-lg w-16">Date</th>
//               <th className="py-2 font-semibold  px-2 border-l border-gray-200 text-lg">Patient Name</th>
//               <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg w-[25%]">Lab</th>
//               <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg w-[25%]">Template</th>
//               <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg w-[25%]">Lab Tests</th>
//                           </tr>
                          
//           </thead>
//          <tbody>
          
//               <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  rounded-2xl bg-teal-100'>El-Moktaber</div>
//                                       <div className='p-2 px-4 rounded-2xl bg-teal-100'>Alfa</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                   </div>
//                 </td>
//               </tr>
//               <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  rounded-2xl bg-teal-100'>El-Moktaber</div>
//                                       <div className='p-2 px-4 rounded-2xl bg-teal-100'>Alfa</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                   </div>
//                 </td>
//                           </tr>
//                             <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  rounded-2xl bg-teal-100'>El-Moktaber</div>
//                                       <div className='p-2 px-4 rounded-2xl bg-teal-100'>Alfa</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                   </div>
//                 </td>
//                           </tr>
//                             <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  rounded-2xl bg-teal-100'>El-Moktaber</div>
//                                       <div className='p-2 px-4 rounded-2xl bg-teal-100'>Alfa</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                   </div>
//                 </td>
//               </tr>
//               <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  rounded-2xl bg-teal-100'>El-Moktaber</div>
//                                       <div className='p-2 px-4 rounded-2xl bg-teal-100'>Alfa</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                   </div>
//                 </td>
//                           </tr>
//                             <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  rounded-2xl bg-teal-100'>El-Moktaber</div>
//                                       <div className='p-2 px-4 rounded-2xl bg-teal-100'>Alfa</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OH P4</div>
//                                       <div className='p-2 px-4 bg-emerald-100 rounded-2xl'>17 OHP</div>
//                                   </div>
//                 </td>
//               </tr>
//           </tbody>
//         </table>
//       </div>
//           </div>
         
//     </div>
//   )
// }


function TodayDate() {
  const [today] = useState(new Date());
  return (
    <p>{today.toLocaleDateString()}</p>
  );
}

export default function LabTestsAR() {
const columnsLab = [
  { key: 'date', title: 'التاريخ',type:'date' },
  { key: 'patientName', title: 'اسم المريض', type:'text' },
  { key: 'lab', title: 'المعمل', type:'tag1' },
  { key: 'template', title: 'النموذج', type:'tag2' },
  { key: 'tests', title: 'التحاليل', type:'tag3' },
  ];
  const dataLab = [
    {
      date:'16/03/2026',
      patientName:'فاطمة أحمد محمود',
      lab: ['المختبر', 'ألفا'],
      template: ['تعداد الدم الكامل', 'فحوصات تكيس المبايض'],
      tests: ['١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب', '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب'],
    },
     {
      date:'17/03/2026',
      patientName:'فاطمة أحمد محمود',
      lab: ['المختبر', 'ألفا'],
      template: ['تعداد الدم الكامل', 'فحوصات تكيس المبايض'],
      tests: ['١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب', '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب'],
    }
  ];
  return (
      <div>
          <div className="h-screen py-5 px-4 overflow-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">
              {/* Header */}
              <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
                  <div className="w-1 h-7 rounded-full bg-emerald-600"></div>
                  <div className='flex justify-between w-full items-center'>
                      <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">طلب تحليل</h1>
              <TodayDate/>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        ٣ طلبات
                      </span>
                  </div>
              </div>

        {/* Content */}
        <ListView columns={columnsLab} data={dataLab}/>
          </div>
      </div>
  )
}