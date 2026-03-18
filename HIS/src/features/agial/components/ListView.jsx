export default function ListView({ columns, data, onRowClick }) {

  function statusColor(value) {
    if (value.includes('حرج')         || value.includes('ملغى')         || value.includes('نزيف'))    return 'bg-red-100 text-red-700 border-red-200'
    if (value.includes('مقبول')       || value.includes('قيد الانتظار') || value.includes('انتظار'))  return 'bg-amber-100 text-amber-700 border-amber-200'
    if (value.includes('مكتمل')       || value.includes('تم الصرف'))                                   return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (value.includes('خارج')        || value.includes('غير متوفر'))                                  return 'bg-gray-100 text-gray-600 border-gray-200'
    return 'bg-teal-100 text-teal-700 border-teal-200'
  }

  function renderCell(column, row) {
    const val = row[column.key]
    const arr = Array.isArray(val) ? val : val != null ? [val] : []

    if (column.type === 'tag1') {
      return (
        <div className="flex flex-wrap gap-1.5">
          {arr.map((v, j) => (
            <span key={j} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor(v)}`}>
              {v}
            </span>
          ))}
        </div>
      )
    }

    if (column.type === 'tag2') {
      return (
        <div className="flex flex-wrap gap-1.5">
          {arr.map((v, j) => (
            <span key={j} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
              {v}
            </span>
          ))}
        </div>
      )
    }

    if (column.type === 'tag3') {
      return (
        <div className="flex flex-wrap gap-1.5">
          {arr.map((v, j) => (
            <span key={j} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
              {v}
            </span>
          ))}
        </div>
      )
    }

    return <span className="text-gray-700">{val ?? '—'}</span>
  }

  if (!data || data.length === 0) {
    return (
      <div className="my-4 rounded-2xl border border-dashed border-gray-200 bg-white py-16 flex flex-col items-center gap-2 text-gray-400" dir="rtl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-medium">لا توجد نتائج</p>
      </div>
    )
  }

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white" dir="rtl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-l from-teal-700 to-emerald-700 text-white">
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={`py-3 px-4 text-right font-semibold text-sm tracking-wide whitespace-nowrap ${i < columns.length - 1 ? 'border-l border-white/20' : ''}`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-teal-50`}
            >
              {columns.map((col, j) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 align-top text-sm ${j < columns.length - 1 ? 'border-l border-gray-100' : ''}`}
                >
                  {renderCell(col, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
