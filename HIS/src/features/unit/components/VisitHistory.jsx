import { Calendar } from 'lucide-react';

const TYPE_BADGE = {
  IVF:       'bg-teal-100 text-teal-700',
  OPD:       'bg-blue-100 text-blue-700',
  Inpatient: 'bg-indigo-100 text-indigo-700',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function VisitHistory({ visits, loading, error }) {
  if (loading) {
    return (
      <div className="space-y-2 pt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2.5 px-3 font-semibold text-gray-700 w-32">التاريخ</th>
            <th className="text-left py-2.5 px-3 font-semibold text-gray-700">العيادة</th>
            <th className="text-left py-2.5 px-3 font-semibold text-gray-700">الطبيب</th>
            <th className="text-left py-2.5 px-3 font-semibold text-gray-700">التشخيص</th>
            <th className="text-left py-2.5 px-3 font-semibold text-gray-700 w-28">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {visits.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                لا توجد سجلات زيارات
              </td>
            </tr>
          ) : (
            visits.map((v, idx) => (
              <tr
                key={`${v.type}-${v.id}`}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  idx % 2 === 0 ? '' : 'bg-gray-50/50'
                }`}
              >
                <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                  {formatDate(v.date)}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_BADGE[v.type] || TYPE_BADGE.OPD}`}>
                      {v.type}
                    </span>
                    <span className="text-gray-800">{v.clinic || '—'}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-gray-700">{v.doctor || '—'}</td>
                <td className="py-2.5 px-3 text-gray-600">{v.decision || '—'}</td>
                <td className="py-2.5 px-3">
                  {v.state ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {v.state}
                    </span>
                  ) : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
