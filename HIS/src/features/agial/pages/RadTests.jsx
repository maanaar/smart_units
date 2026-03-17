import React from 'react'
import ListView from '../components/ListView';

// export  function RadTests() {

//   return (
//       <div>
//           <div className="h-screen py-5 px-4 overflow-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
//               {/* Header */}
//               <div class="flex-shrink-0 px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
//                   <div class="w-1 h-7 rounded-full bg-emerald-600"></div>
//                   <div className='flex justify-between w-full items-center'>
//                       <div>
//                           <h1 class="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">Rad Request</h1>
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
//               <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg w-[25%]">Category</th>
//               <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg w-[25%]">Rad Tests</th>
//                           </tr>
                          
//           </thead>
//          <tbody>
          
//               <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                       {['17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP'].map((test, j) => (
//                               <div key={j} className='p-2 px-4 bg-emerald-100 rounded-2xl'>{test}</div>
//                             ))}
//                                   </div>
//                 </td>
//               </tr>
//               <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                 <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                       {['17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP'].map((test, j) => (
//                               <div key={j} className='p-2 px-4 bg-emerald-100 rounded-2xl'>{test}</div>
//                             ))}
//                                   </div>
//                 </td>
//               </tr>
//               <tr className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
//                 <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">16/03/2026</td>
//                 <td className="py-2 px-2 border   border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
//                               <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                                    <div className='flex items-center gap-2 text-sm flex-wrap'>
//                                       <div className='p-2 px-4  bg-blue-100 rounded-2xl'>CBC</div>
//                                       <div className='p-2 px-4  bg-blue-100  rounded-2xl'>Investigations PCOS</div>
//                                   </div>
//                 </td>
//                 <td className="py-2 px-2 border  border-b-0 border-gray-200 text-base align-top">
//                   <div className='flex items-center gap-2 text-sm flex-wrap'>
//                       {['17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP','17 OH P4','17 OHP'].map((test, j) => (
//                               <div key={j} className='p-2 px-4 bg-emerald-100 rounded-2xl'>{test}</div>
//                             ))}
//                                   </div>
//                 </td>
//                           </tr>
//           </tbody>
//         </table>
//       </div>
//           </div>
         
//     </div>
//   )
// }


export default function RadTestsAR() {
const columnsRad = [
  { key: 'daterad', title: 'التاريخ', type:'date' },
  { key: 'patientName', title: 'اسم المريض',  type:'text' },
  { key: 'category', title: 'الفئه', type:'tag1' },
  { key: 'testsRad', title: 'الأشعة', type:'tag2' },
  ];
   const dataRab = [
    {
      daterad:'16/03/2026',
      patientName:'فاطمة أحمد محمود',
      category: ['CT','MRI','XRay'],
     testsRad: ['١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب', '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب'],
    },
     {
      daterad:'17/03/2026',
      patientName:'فاطمة أحمد محمود',
      category: ['CT','MRI','XRay'],
      testsRad: ['١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب', '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب'],
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
                          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">طلب الأشعة</h1>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        ٣ طلبات
                      </span>
                  </div>
              </div>

        {/* Content */}
         <ListView columns={columnsRad} data={dataRab}/>
              {/* <div className="my-5 rounded-2xl overflow-hidden border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white bg-teal-700">
                      <th className="py-2 font-semibold px-2 text-lg w-16">التاريخ</th>
                      <th className="py-2 font-semibold px-2 border-r border-gray-200 text-lg">اسم المريض</th>
                      <th className="py-2 font-semibold border-r px-2 border-gray-200 text-lg w-[25%]">الفئه</th>
                      <th className="py-2 font-semibold border-r px-2 border-gray-200 text-lg w-[30%]">الأشعة</th>
                    </tr>
                  </thead>
                  <tbody>

                
                      <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
                        <td className="py-2 px-2 border border-r-0 border-b-0 border-gray-200 text-base align-top">١٦/٠٣/٢٠٢٦</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">
                          <div className='flex items-center gap-2 text-sm flex-wrap'>
                            <div className='p-2 px-4 bg-blue-100 rounded-2xl'>تعداد الدم الكامل</div>
                            <div className='p-2 px-4 bg-blue-100 rounded-2xl'>فحوصات تكيس المبايض</div>
                          </div>
                        </td>
                           <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">
                          <div className='flex items-center gap-2 text-sm flex-wrap'>
                            {['١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب', '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب',
                              '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب'].map((test, j) => (
                              <div key={j} className='p-2 px-4 bg-emerald-100 rounded-2xl'>{test}</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
                        <td className="py-2 px-2 border border-r-0 border-b-0 border-gray-200 text-base align-top">١٦/٠٣/٢٠٢٦</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">
                          <div className='flex items-center gap-2 text-sm flex-wrap'>
                            <div className='p-2 px-4 bg-blue-100 rounded-2xl'>تعداد الدم الكامل</div>
                            <div className='p-2 px-4 bg-blue-100 rounded-2xl'>فحوصات تكيس المبايض</div>
                          </div>
                        </td>
                          <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">
                          <div className='flex items-center gap-2 text-sm flex-wrap'>
                            {['١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب', '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب',
                              '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب'].map((test, j) => (
                              <div key={j} className='p-2 px-4 bg-emerald-100 rounded-2xl'>{test}</div>
                            ))}
                          </div>
                        </td>
                      </tr>
   <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
                        <td className="py-2 px-2 border border-r-0 border-b-0 border-gray-200 text-base align-top">١٦/٠٣/٢٠٢٦</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">
                          <div className='flex items-center gap-2 text-sm flex-wrap'>
                            <div className='p-2 px-4 bg-blue-100 rounded-2xl'>تعداد الدم الكامل</div>
                            <div className='p-2 px-4 bg-blue-100 rounded-2xl'>فحوصات تكيس المبايض</div>
                          </div>
                        </td>
                        <td className="py-2 px-2 border border-l-0 border-b-0 border-gray-200 text-base align-top">
                          <div className='flex items-center gap-2 text-sm flex-wrap'>
                            {['١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب', '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب',
                              '١٧ هيدروكسي ب٤', '١٧ هيدروكسي ب'].map((test, j) => (
                              <div key={j} className='p-2 px-4 bg-emerald-100 rounded-2xl'>{test}</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div> */}
          </div>
      </div>
  )
}