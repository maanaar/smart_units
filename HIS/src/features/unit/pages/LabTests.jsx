import { useState } from 'react'
import { FlaskConical, Clock, CheckCircle2, AlertTriangle, Search } from 'lucide-react'
import ListView from '../components/ListView'
import Card from '../../dashboards/components/cards'
import useAgialStore from '../store'

const columnsLab = [
  { key: 'date',        title: 'التاريخ',     type: 'date'  },
  { key: 'patientName', title: 'اسم المريض',  type: 'text'  },
  { key: 'lab',         title: 'المعمل',      type: 'tag1'  },
  { key: 'template',    title: 'النموذج',     type: 'tag2'  },
  { key: 'tests',       title: 'التحاليل',    type: 'tag3'  },
]

export default function LabTestsAR() {
  const labRequests = useAgialStore((s) => s.labRequests)
  const [search, setSearch] = useState('')

  const filtered = labRequests.filter(
    r => r.patientName.includes(search) || search === ''
  )

  const labStats = [
    { title: 'إجمالي الطلبات', stat: String(labRequests.length), description: 'جميع طلبات التحاليل اليوم', icon: <FlaskConical size={20} /> },
    { title: 'قيد الانتظار',   stat: String(labRequests.length), description: 'طلبات لم تُنجز بعد',        icon: <Clock size={20} />       },
    { title: 'مكتملة',         stat: '٠',                        description: 'تحاليل جاهزة للاستلام',     icon: <CheckCircle2 size={20} /> },
    { title: 'عاجلة',          stat: '٠',                        description: 'حالات تستدعي الأولوية',     icon: <AlertTriangle size={20} /> },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-l from-emerald-800 to-teal-600 bg-clip-text text-transparent">
              طلبات التحاليل المخبرية
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <FlaskConical size={14} />
          {labRequests.length} طلبات
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {labStats.map(card => (
            <Card
              key={card.title}
              title={card.title}
              stat={card.stat}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>

        {/* Search */}
        <div className="px-6 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث باسم المريض..."
              className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 pb-6">
          <ListView columns={columnsLab} data={filtered} />
        </div>
      </div>
    </div>
  )
}
