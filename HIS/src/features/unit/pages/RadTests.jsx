import { useState, useEffect } from 'react'
import { Scan, Clock, CheckCircle2, AlertTriangle, Search } from 'lucide-react'
import ListView from '../components/ListView'
import Card from '../../dashboards/components/cards'
import { listRadRequests } from '../../../services/odooClient'

const columnsRad = [
  { key: 'date',        title: 'التاريخ',    type: 'date'  },
  { key: 'patientName', title: 'اسم المريض', type: 'text'  },
  { key: 'category',   title: 'المصدر',      type: 'tag1'  },
  { key: 'testsRad',   title: 'الأشعة',      type: 'tag2'  },
  { key: 'state',      title: 'الحالة',      type: 'tag3'  },
]

export default function RadTestsAR() {
  const [radRequests, setRadRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    setLoading(true)
    listRadRequests({ date: today })
      .then(setRadRequests)
      .catch(() => setRadRequests([]))
      .finally(() => setLoading(false))
  }, [today])

  const filtered = radRequests.filter(
    r => r.patientName?.includes(search) || search === ''
  )

  const done    = radRequests.filter(r => r.state === 'done').length
  const pending = radRequests.filter(r => r.state !== 'done' && r.state !== 'cancel').length

  const radStats = [
    { title: 'إجمالي الطلبات', stat: String(radRequests.length), description: 'جميع طلبات الأشعة اليوم',  icon: <Scan size={20} />          },
    { title: 'قيد الانتظار',   stat: String(pending),            description: 'طلبات لم تُنجز بعد',        icon: <Clock size={20} />         },
    { title: 'مكتملة',         stat: String(done),               description: 'أشعة جاهزة للاستلام',       icon: <CheckCircle2 size={20} />  },
    { title: 'ملغاة',          stat: String(radRequests.filter(r => r.state === 'cancel').length), description: 'طلبات ملغاة', icon: <AlertTriangle size={20} /> },
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
          {loading ? '…' : `${radRequests.length} طلبات`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {radStats.map(card => (
            <Card key={card.title} title={card.title} stat={card.stat} description={card.description} icon={card.icon} />
          ))}
        </div>

        {/* Search + Table */}
        <div className="px-6 pb-6 space-y-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم المريض…"
              className="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
          {loading ? (
            <div className="text-center py-12 text-teal-600 font-semibold">جاري التحميل…</div>
          ) : (
            <ListView columns={columnsRad} rows={filtered} />
          )}
        </div>
      </div>
    </div>
  )
}
