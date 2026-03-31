import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Card from '../components/cards'
import MiniChart from '../components/MiniChart'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import ListView from '../../unit/components/ListView'
import { getDashboardStats, listBookings } from '../../../services/odooClient'

const operationColumns = [
  { key: 'patientName', title: 'المريض'        },
  { key: 'mrn',         title: 'رقم الملف'     },
  { key: 'clinic',      title: 'العيادة'        },
  { key: 'doctor',      title: 'الطبيب المعالج' },
  { key: 'start',       title: 'التاريخ والوقت' },
  { key: 'status',      title: 'الحالة', type: 'tag1' },
]

export default function OperationsDashboard() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [stats, setStats]       = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
    setLoading(true)
    listBookings({ date: today })
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [today])

  const filteredData = bookings.filter((b) => {
    const matchSearch = b.patientName?.includes(search) || b.clinic?.includes(search) || b.doctor?.includes(search) || search === ''
    const matchFilter =
      filter === 'all' ||
      (filter === 'done'      && b.status === 'done')      ||
      (filter === 'pending'   && b.status === 'Draft')     ||
      (filter === 'confirmed' && b.status === 'Confirmed') ||
      (filter === 'cancelled' && (b.status === 'Cancelled' || b.status === 'Missed'))
    return matchSearch && matchFilter
  })

  const clinicCounts = bookings.reduce((acc, b) => {
    if (b.clinic) acc[b.clinic] = (acc[b.clinic] || 0) + 1
    return acc
  }, {})
  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status || 'غير محدد'] = (acc[b.status || 'غير محدد'] || 0) + 1
    return acc
  }, {})

  const statCards = [
    { title: 'مواعيد اليوم',  stat: stats ? String(stats.today_bookings)     : '…', description: 'إجمالي مواعيد اليوم',    icon: <Activity size={20} />    },
    { title: 'مؤكدة',         stat: stats ? String(stats.booking_confirmed)  : '…', description: 'مواعيد مؤكدة اليوم',     icon: <CheckCircle2 size={20} /> },
    { title: 'قيد الانتظار',  stat: stats ? String(stats.today_bookings - stats.booking_confirmed - stats.booking_cancelled) : '…', description: 'في الانتظار', icon: <Clock size={20} /> },
    { title: 'ملغاة',         stat: stats ? String(stats.booking_cancelled)  : '…', description: 'مواعيد ملغاة اليوم',     icon: <XCircle size={20} />     },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">
      <DashboardHeader
        title="العمليات الطبية"
        addLabel="طلب إجراء طبي"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onAdd={() => navigate('/unit/ReceptionPage')}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.title} title={card.title} stat={card.stat} description={card.description} icon={card.icon} />
          ))}
        </div>
        <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MiniChart title="توزيع العيادات" type="bar" data={Object.entries(clinicCounts).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" color="#f59e0b" />
          <MiniChart title="حالة المواعيد" type="pie" data={Object.entries(statusCounts).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" />
        </div>
        <div className="px-6">
          <SearchBar
            fullWidth
            value={search}
            onChange={setSearch}
            placeholder="ابحث باسم المريض، العيادة، الطبيب..."
            filterValue={filter}
            onFilterChange={setFilter}
            filters={[
              { label: 'الكل',         value: 'all'       },
              { label: 'مؤكد',         value: 'confirmed' },
              { label: 'قيد الانتظار', value: 'pending'   },
              { label: 'ملغى',         value: 'cancelled' },
            ]}
          />
        </div>
        <div className="px-6 pb-6">
          {loading ? (
            <div className="text-center py-10 text-teal-600 font-semibold">جاري التحميل…</div>
          ) : (
            <ListView columns={operationColumns} rows={filteredData} />
          )}
        </div>
      </div>
    </div>
  )
}
