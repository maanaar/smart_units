import useAgialStore from '../store';

const INPATIENT_URL = "https://sys.agialhospital.net/web#action=634&model=inpatient.admission&view_type=list&cids=1&menu_id=435";

export default function PatientQueue() {
  const queuePatients = useAgialStore((s) => s.queuePatients);

  const rows = queuePatients.length > 0 ? queuePatients : [
    { qid: 0, patient: { name: "Ahmed Ali", mrn: "" }, visit: { doctor: "Dr. Hassan" }, _status: "Waiting" },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-[#13534c]/80 to-[#1f7e74]/80 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Patient Queue</h2>
      </div>
      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-300">
              <th className="py-2 font-semibold w-16 px-2 text-lg">Queue</th>
              <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Patient</th>
              <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Doctor</th>
              <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Status</th>
              <th className="py-2 font-semibold border-l px-2 border-gray-200 text-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, i) => (
              <tr key={entry.qid} className="text-gray-700 border-b border-gray-100 last:border-0">
                <td className="py-2 px-2 text-base">{i + 1}</td>
                <td className="py-2 px-2 border-l border-gray-200 text-base">{entry.patient.name}</td>
                <td className="py-2 px-2 border-l border-gray-200 text-base">{entry.visit?.doctor || "—"}</td>
                <td className="py-2 px-2 border-l border-gray-200 text-base">{entry._status || "Waiting"}</td>
                <td className="py-2 px-2 border-l border-gray-200 text-base">
                  <div className="flex gap-2 flex-wrap">
                    <button className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold px-4 py-2 rounded-xl border border-slate-300 transition-all">
                      Start
                    </button>
                    <button className="bg-teal-600 text-white active:scale-95 hover:bg-teal-700 font-bold px-4 py-2 rounded-xl transition-all">
                      Open
                    </button>
                    <button
                      onClick={() => window.open(INPATIENT_URL, "_blank")}
                      className="bg-violet-600 text-white active:scale-95 hover:bg-violet-700 font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Inpatient
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
