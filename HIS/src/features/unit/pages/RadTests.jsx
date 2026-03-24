import { useState } from 'react'
import { Scan, Clock, CheckCircle2, AlertTriangle, Search } from 'lucide-react'
import ListView from '../components/ListView'
import Card from '../../dashboards/components/cards'
import useAgialStore from '../store'

const columnsRad = [
  { key: 'daterad',     title: 'التاريخ',     type: 'date'  },
  { key: 'patientName', title: 'اسم المريض',  type: 'text'  },
  { key: 'category',    title: 'الفئة',       type: 'tag1'  },
  { key: 'testsRad',    title: 'الأشعة',      type: 'tag2'  },
]

export default function RadTestsAR() {
  const radRequests = useAgialStore((s) => s.radRequests)
  const [search, setSearch] = useState('')

  const filtered = radRequests.filter(
    r => r.patientName.includes(search) || search === ''
  )

  const radStats = [
    { title: 'إجمالي الطلبات', stat: String(radRequests.length), description: 'جميع طلبات الأشعة اليوم',  icon: <Scan size={20} />          },
    { title: 'قيد الانتظار',   stat: String(radRequests.length), description: 'طلبات لم تُنجز بعد',        icon: <Clock size={20} />         },
    { title: 'مكتملة',         stat: '٠',                        description: 'أشعة جاهزة للاستلام',       icon: <CheckCircle2 size={20} />  },
    { title: 'عاجلة',          stat: '٠',                        description: 'حالات تستدعي الأولوية',     icon: <AlertTriangle size={20} /> },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40" dir="rtl">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-teal-600" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-l from-blue-800 to-teal-600 bg-clip-text text-transparent">
              طلبات الأشعة التشخيصية
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <Scan size={14} />
          {radRequests.length} طلبات
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {radStats.map(card => (
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
              className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 pb-6">
          <ListView columns={columnsRad} data={filtered} />
        </div>
      </div>
    </div>
  )
}
