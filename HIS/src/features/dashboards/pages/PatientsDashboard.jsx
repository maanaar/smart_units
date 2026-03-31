import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BedDouble, LogOut, AlertTriangle } from 'lucide-react'
import Card from '../../dashboards/components/cards'
import MiniChart from '../../dashboards/components/MiniChart'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import ListView from '../../unit/components/ListView'
import { getDashboardStats, listBookings } from '../../../services/odooClient'

const patientColumns = [
  { key: 'num',         title: 'الرقم'         },
  { key: 'patientName', title: 'اسم المريض'    },
  { key: 'age',         title: 'العمر'         },
  { key: 'gender',      title: 'الجنس'         },
  { key: 'status',      title: 'الحالة',  type: 'tag1' },
  { key: 'clinic',      title: 'العيادة'        },
  { key: 'start',       title: 'وقت الموعد'    },
]

export default function PatientsDashboard() {
  const navigate   = useNavigate()
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')
  const [dateFrom, setDateFrom]   = useState('')
  const [dateTo, setDateTo]       = useState('')
  const [stats, setStats]         = useState(null)
  const [bookings, setBookings]   = useState([])
  const [loading, setLoading]     = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
    setLoading(true)
    listBookings({ date: today })
      .then(rows => setBookings(rows.map((b, i) => ({ ...b, num: i + 1, gender: b.gender === 'Male' ? 'ذكر' : b.gender === 'Female' ? 'أنثى' : '—', status: b.status }))))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [today])

  const filteredData = bookings.filter((b) => {
    const matchSearch = b.patientName?.includes(search) || b.mrn?.includes(search) || search === ''
    const matchFilter =
      filter === 'all' ||
      (filter === 'confirmed' && b.status === 'Confirmed') ||
      (filter === 'arrived'   && b.status === 'Arrived')   ||
      (filter === 'done'      && b.status === 'done')
    return matchSearch && matchFilter
  })

  const statCards = [
    {
      title: 'إجمالي المرضى',
      stat: stats ? String(stats.total_patients) : '…',
      description: 'إجمالي المرضى في النظام',
      icon: <Users size={20} />,
    },
    {
      title: 'مواعيد اليوم',
      stat: stats ? String(stats.today_bookings) : '…',
      description: 'مواعيد محجوزة لليوم',
      icon: <BedDouble size={20} />,
    },
    {
      title: 'مواعيد مؤكدة',
      stat: stats ? String(stats.booking_confirmed) : '…',
      description: 'تم تأكيدها اليوم',
      icon: <LogOut size={20} />,
    },
    {
      title: 'مواعيد ملغاة',
      stat: stats ? String(stats.booking_cancelled) : '…',
      description: 'تم إلغاؤها اليوم',
      icon: <AlertTriangle size={20} />,
    },
  ]

  // Simple derived chart data from bookings
  const clinicCounts = bookings.reduce((acc, b) => {
    if (b.clinic) acc[b.clinic] = (acc[b.clinic] || 0) + 1
    return acc
  }, {})
  const clinicChartData = Object.entries(clinicCounts).map(([name, value]) => ({ name, value }))

  const statusCounts = bookings.reduce((acc, b) => {
    const label = b.status || 'غير محدد'
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})
  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  return (
    <div className='flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40' dir="rtl">
      <DashboardHeader
        title="المرضى"
        addLabel="إضافة موعد جديد"
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
        <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniChart title="توزيع العيادات" type="bar" data={clinicChartData} dataKey="value" nameKey="name" color="#6366f1" />
          <MiniChart title="توزيع الحالات" type="pie" data={statusChartData} dataKey="value" nameKey="name" />
        </div>
        <div className="px-6">
          <SearchBar
            fullWidth
            value={search}
            onChange={setSearch}
            placeholder="ابحث عن مريض..."
            filterValue={filter}
            onFilterChange={setFilter}
            filters={[
              { label: 'جميع الحالات',  value: 'all'        },
              { label: 'مؤكد',          value: 'confirmed'  },
              { label: 'وصل',           value: 'arrived'    },
              { label: 'منتهي',         value: 'done'       },
            ]}
          />
        </div>
        <div className="px-6 pb-6">
          {loading ? (
            <div className="text-center py-10 text-teal-600 font-semibold">جاري التحميل…</div>
          ) : (
            <ListView columns={patientColumns} rows={filteredData} />
          )}
        </div>
      </div>
    </div>
  )
}
