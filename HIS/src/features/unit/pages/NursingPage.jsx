import { useState, useEffect } from 'react'
import useAgialStore from '../store'
import VitalSigns from '../components/VitalSigns'
import NursingNotes from '../components/NursingNotes'
import PatientComplaint from '../components/PatientComplaint'
import { getNursingQueue, updateNursingStatus } from '../../../services/odooClient'

const sectionCls = 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'
const headerCls  = 'px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-teal-600/10'

const STATUS_LABEL = {
  Draft: 'في الانتظار', Confirmed: 'مؤكد', Arrived: 'وصل',
  'In Patient': 'في الفحص', done: 'مكتمل', مكتمل: 'مكتمل',
}

export default function NursingPage() {
  const setQueuePatients  = useAgialStore((s) => s.setQueuePatients)
  const updateQueueStatus = useAgialStore((s) => s.updateQueueStatus)
  const queuePatients     = useAgialStore((s) => s.queuePatients)

  const [loading, setLoading] = useState(false)
  const [selectedQid, setSelectedQid] = useState(null)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    setLoading(true)
    getNursingQueue(today)
      .then((queue) => setQueuePatients(queue))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [today])

  const selectedEntry = queuePatients.find(e => e.qid === selectedQid) ?? null

  const handleComplete = async (entry) => {
    try {
      await updateNursingStatus(entry.qid, 'done')
    } catch (_) {}
    updateQueueStatus(entry.qid, 'مكتمل')
  }

  const handleStart = async (entry) => {
    try {
      await updateNursingStatus(entry.qid, 'In Patient')
    } catch (_) {}
    updateQueueStatus(entry.qid, 'In Patient')
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">
      <div className="mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900 rounded-2xl">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="text-center py-8 relative" style={{
            backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">شاشة التمريض</h1>
          </div>
        </div>

        {/* Patient Queue */}
        <div className={sectionCls}>
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-l from-[#13534c]/80 to-[#1f7e74]/80 flex items-center justify-between gap-2">
            <h2 className="text-white font-bold text-lg">قائمة انتظار المرضى</h2>
            {loading && <span className="text-teal-200 text-sm">جاري التحميل…</span>}
          </div>
          <div className="overflow-x-auto">
            {queuePatients.length === 0 && !loading ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                لا توجد مواعيد لليوم
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['الرقم', 'المريض', 'رقم الملف', 'الطبيب', 'العيادة', 'الحالة', 'الإجراء'].map(h => (
                      <th key={h} className="px-4 py-3 text-right text-sm font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queuePatients.map((entry, i) => {
                    const isSelected  = entry.qid === selectedQid
                    const isCompleted = entry._status === 'مكتمل' || entry._status === 'done'
                    return (
                      <tr
                        key={entry.qid}
                        onClick={() => setSelectedQid(entry.qid)}
                        className={`border-b border-slate-50 cursor-pointer transition ${
                          isSelected ? 'bg-teal-50 border-r-4 border-r-teal-500' : 'hover:bg-emerald-50/50'
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-teal-700">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700">{entry.patient.name}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{entry.patient.mrn || '—'}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.visit?.doctor || '—'}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.visit?.clinic || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                            isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                            {STATUS_LABEL[entry._status] || entry._status || 'في الانتظار'}
                          </span>
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStart(entry)}
                              disabled={isCompleted}
                              className="px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition disabled:opacity-40"
                            >
                              بدء
                            </button>
                            <button
                              onClick={() => handleComplete(entry)}
                              disabled={isCompleted}
                              className="px-3 py-1.5 text-sm font-bold bg-teal-600/80 text-white rounded-lg hover:bg-teal-700/80 transition disabled:opacity-40"
                            >
                              إتمام
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Selected Patient Banner */}
        {selectedEntry ? (
          <div className="rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center flex-shrink-0 text-teal-700 font-bold text-sm">
              {selectedEntry.patient.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800">{selectedEntry.patient.name}</p>
              <p className="text-xs text-slate-500">{selectedEntry.visit?.clinic} · {selectedEntry.visit?.doctor}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-center text-sm text-slate-400">
            انقر على صف مريض أعلاه لفتح زيارته
          </div>
        )}

        {/* Clinical Sections */}
        <div className={`space-y-5 ${!selectedEntry ? 'pointer-events-none opacity-50 select-none' : ''}`}>
          <div className={sectionCls}>
            <div className={headerCls}>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <h3 className="text-lg font-bold text-slate-700">العلامات الحيوية</h3>
            </div>
            <VitalSigns />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h3 className="text-lg font-bold text-slate-700">شكوى المريض</h3>
              </div>
              <PatientComplaint />
            </div>
            <div className={sectionCls}>
              <div className={headerCls}>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="text-lg font-bold text-slate-700">ملاحظات التمريض</h3>
              </div>
              <NursingNotes />
            </div>
          </div>
        </div>

        <div className="flex justify-start gap-3 pb-4">
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition active:scale-95">
            حفظ
          </button>
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-700/80 hover:bg-teal-800/80 text-white transition shadow active:scale-95">
            إرسال للطبيب
          </button>
        </div>

      </div>
    </div>
  )
}
