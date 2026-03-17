import React from 'react'

export default function ListView({ columns, data }) {
  return (
      <div className='my-5 rounded-2xl overflow-hidden border border-gray-200'>
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr className="text-white bg-teal-700">
                      {columns.map((column) => (
                          <th key={column.key} className="py-2 font-semibold px-2 border-r border-gray-200 text-lg">
                              {column.title}
                          </th>
                      ))}
                  </tr>
              </thead>
              <tbody>
                  {data.map((row, i) => (
                      <tr key={i} className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
                          {columns.map((column) => (
                              column.type === 'tag3' ? (
                                       <td key={column.key} className="w-[25%] py-2 px-2 border border-r-0 border-b-0 last:border-l-0 border-gray-200 text-base align-top">
                                      <div className='flex items-center gap-2 text-sm flex-wrap'>
                                          {row[column.key]?.map((value, j) => (
                                              <div key={j} className='p-2 px-4 rounded-2xl  bg-emerald-100'>
                                                  {value}
                                              </div>
                                          ))}
                                          </div>
                                           </td>
                              ) : (
                                       column.type === 'tag2' ? (
                                       <td key={column.key} className="w-[25%] py-2 px-2 border border-r-0 last:border-l-0 border-b-0 border-gray-200 text-base align-top">
                                      <div className='flex items-center gap-2 text-sm flex-wrap'>
                                          {row[column.key]?.map((value, j) => (
                                              <div key={j} className='p-2 px-4 rounded-2xl  bg-blue-100'>
                                                  {value}
                                              </div>
                                          ))}
                                          </div>
                                           </td>
                              ) : (
                                      
                                       column.type === 'tag1' ? (
                                       <td key={column.key} className="w-[15%] py-2 px-2 border border-r-0 last:border-l-0 border-b-0 border-gray-200 text-base align-top">
                                      <div className='flex items-center gap-2 text-sm flex-wrap'>
                                          {row[column.key]?.map((value, j) => (
                                              <div key={j} className='p-2 px-4 rounded-2xl  bg-teal-100'>
                                                  {value}
                                              </div>
                                          ))}
                                          </div>
                                           </td>
                              ) : (
                                      <td className='py-2 px-2 border border-r-0 border-b-0 border-gray-200 text-base align-top'>
                                          {row[column.key]}
                                      </td>
                                   
                                  )
                                   
                                  )
                                   
                                  )
                          ))}
                      </tr>
                  ))}
              </tbody>
          </table>
            {/* <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white bg-teal-700">
                      <th className="py-2 font-semibold px-2 text-lg w-16">التاريخ</th>
                      <th className="py-2 font-semibold px-2 border-r border-gray-200 text-lg">اسم المريض</th>
                      <th className="py-2 font-semibold border-r px-2 border-gray-200 text-lg w-[15%]">المعمل</th>
                      <th className="py-2 font-semibold border-r px-2 border-gray-200 text-lg w-[25%]">النموذج</th>
                      <th className="py-2 font-semibold border-r px-2 border-gray-200 text-lg w-[30%]">التحاليل</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr  className="text-gray-700 border-b border-gray-100 last:border-0 hover:bg-teal-50">
                        <td className="py-2 px-2 border border-r-0 border-b-0 border-gray-200 text-base align-top">١٦/٠٣/٢٠٢٦</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">فاطمة أحمد محمود</td>
                        <td className="py-2 px-2 border border-b-0 border-gray-200 text-base align-top">
                          <div className='flex items-center gap-2 text-sm flex-wrap'>
                            <div className='p-2 px-4 rounded-2xl bg-teal-100'>المختبر</div>
                            <div className='p-2 px-4 rounded-2xl bg-teal-100'>ألفا</div>
                          </div>
                        </td>
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
                </table> */}
    </div>
  )
}
