import useAgialStore from '../store';

const INPATIENT_URL = "https://sys.agialhospital.net/web#action=634&model=inpatient.admission&view_type=list&cids=1&menu_id=435";

export default function PatientQueue() {
  const queuePatients = useAgialStore((s) => s.queuePatients);

  const rows = queuePatients.length > 0 ? queuePatients : [
    { qid: 0, patient: { name: "أحمد علي" }, visit: { doctor: "د. حسان" }, _status: "انتظار" },
  ];

  return (
    <div>
      <div className="overflow-x-auto" dir="rtl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="py-3 px-4 text-right font-semibold w-14">#</th>
              <th className="py-3 px-4 text-right font-semibold border-r border-gray-200">المريض</th>
              <th className="py-3 px-4 text-right font-semibold border-r border-gray-200">الطبيب</th>
              <th className="py-3 px-4 text-right font-semibold border-r border-gray-200">الحالة</th>
              <th className="py-3 px-4 text-right font-semibold border-r border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((entry, i) => (
              <tr key={entry.qid} className="hover:bg-teal-50 transition-colors">
                <td className="py-3 px-4 text-gray-500 font-medium">{i + 1}</td>
                <td className="py-3 px-4 border-r border-gray-100 font-medium text-gray-800">{entry.patient.name}</td>
                <td className="py-3 px-4 border-r border-gray-100 text-gray-600">{entry.visit?.doctor || "—"}</td>
                <td className="py-3 px-4 border-r border-gray-100">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    {entry._status || "انتظار"}
                  </span>
                </td>
                <td className="py-3 px-4 border-r border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    <button className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-semibold px-3 py-1.5 rounded-lg border border-gray-200 transition-all text-xs">
                      بدء
                    </button>
                    <button className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold px-3 py-1.5 rounded-lg transition-all text-xs">
                      فتح
                    </button>
                    <button
                      onClick={() => window.open(INPATIENT_URL, "_blank")}
                      className="bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-semibold px-3 py-1.5 rounded-lg transition-all text-xs"
                    >
                      دخول
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
