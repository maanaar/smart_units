import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Pill, CheckCircle2, AlertTriangle } from 'lucide-react'
import Card from '../components/cards'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import ListView from '../../unit/components/ListView'
import { getDashboardStats, listLabRequests } from '../../../services/odooClient'

const pharmacyColumns = [
  { key: 'patientName', title: 'المريض'       },
  { key: 'mrn',         title: 'رقم الملف'    },
  { key: 'template',    title: 'التحاليل'     },
  { key: 'lab',         title: 'المعمل'       },
  { key: 'date',        title: 'تاريخ الطلب'  },
  { key: 'state',       title: 'الحالة', type: 'tag1' },
]

export default function PharmacyDashboard() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [stats, setStats]       = useState(null)
  const [labReqs, setLabReqs]   = useState([])
  const [loading, setLoading]   = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
    setLoading(true)
    listLabRequests({ date: today })
      .then(setLabReqs)
      .catch(() => setLabReqs([]))
      .finally(() => setLoading(false))
  }, [today])

  const filteredData = labReqs.filter((r) => {
    const matchSearch = r.patientName?.includes(search) || r.template?.includes(search) || search === ''
    const matchFilter =
      filter === 'all' ||
      (filter === 'done'    && r.state === 'Done')   ||
      (filter === 'pending' && r.state !== 'Done' && r.state !== 'Cancel') ||
      (filter === 'cancel'  && r.state === 'Cancel')
    return matchSearch && matchFilter
  })

  const statCards = [
    { title: 'طلبات اليوم',  stat: stats ? String(stats.today_lab_requests) : '…', description: 'طلبات تحاليل اليوم',        icon: <FileText size={20} />     },
    { title: 'إجمالي الطلبات', stat: stats ? String(stats.lab_pending + stats.lab_done) : '…', description: 'كل الطلبات في النظام', icon: <Pill size={20} /> },
    { title: 'مكتملة',       stat: stats ? String(stats.lab_done)           : '…', description: 'تحاليل جاهزة للاستلام',      icon: <CheckCircle2 size={20} /> },
    { title: 'قيد الانتظار', stat: stats ? String(stats.lab_pending)        : '…', description: 'طلبات قيد التنفيذ',          icon: <AlertTriangle size={20} /> },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">
      <DashboardHeader
        title="الصيدلية والمختبر"
        addLabel="طلب تحليل"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onAdd={() => navigate('/unit/LabTests')}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.title} title={card.title} stat={card.stat} description={card.description} icon={card.icon} />
          ))}
        </div>
        <div className="px-6">
          <SearchBar
            fullWidth
            value={search}
            onChange={setSearch}
            placeholder="ابحث باسم المريض أو التحليل..."
            filterValue={filter}
            onFilterChange={setFilter}
            filters={[
              { label: 'الكل',         value: 'all'     },
              { label: 'مكتمل',        value: 'done'    },
              { label: 'قيد الانتظار', value: 'pending' },
              { label: 'ملغى',         value: 'cancel'  },
            ]}
          />
        </div>
        <div className="px-6 pb-6">
          {loading ? (
            <div className="text-center py-10 text-teal-600 font-semibold">جاري التحميل…</div>
          ) : (
            <ListView columns={pharmacyColumns} rows={filteredData} />
          )}
        </div>
      </div>
    </div>
  )
}
