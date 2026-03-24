import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, CheckCircle2, Clock, Star } from 'lucide-react'
import Card from '../components/cards'
import MiniChart from '../components/MiniChart'
import LocationFilters from '../components/LocationFilters'
import { OPERATIONS_DATA } from '../mockData/filtersMockData'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import ListView from '../../unit/components/ListView'
import { MOCK_OPERATIONS_STATS, MOCK_OPERATIONS_LIST } from '../mockData/operationsMockData'


const operationIcons = [
  <Activity size={20} />,
  <CheckCircle2 size={20} />,
  <Clock size={20} />,
  <Star size={20} />,
]

const operationColumns = [
  { key: 'patient',   title: 'المريض'           },
  { key: 'mrn',       title: 'رقم الملف'        },
  { key: 'procedure', title: 'اسم الإجراء الطبي' },
  { key: 'clinic',    title: 'العيادة'           },
  { key: 'doctor',    title: 'الطبيب المعالج'    },
  { key: 'datetime',  title: 'التاريخ والوقت'    },
  { key: 'status',    title: 'الحالة', type: 'tag1' },
]

export default function OperationsDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [date, setDate] = useState('')
  const [loc, setLoc] = useState({ governorate: '', unit: '' })

  const locData = OPERATIONS_DATA[loc.governorate] ?? OPERATIONS_DATA.default

  const filteredData = MOCK_OPERATIONS_LIST.filter((r) => {
    const matchSearch = r.patient.includes(search) || r.procedure.includes(search) || search === ''
    const matchFilter =
      filter === 'all' ||
      (filter === 'done'    && r.status.includes('مكتمل'))       ||
      (filter === 'pending' && r.status.includes('قيد الانتظار')) ||
      (filter === 'cancelled' && r.status.includes('ملغى'))
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">
      <DashboardHeader
        title="لوحة العمليات الطبية"
        addLabel="طلب إجراء طبي"
        dateValue={date}
        onDateChange={setDate}
        onAdd={() => navigate('/unit/ReceptionPage')}
        filters={<LocationFilters onChange={setLoc} />}
      />
      <div className="flex-1 overflow-y-auto">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {locData.stats.map((card, i) => (
          <Card key={card.key} title={card.description} stat={card.stat} description="" icon={operationIcons[i]} />
        ))}
      </div>
      {/* Charts */}
      <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniChart title="العمليات (أسبوعي)" type="area" data={locData.trend} dataKey="value" nameKey="name" color="#10b981" />
        <MiniChart title="توزيع العيادات" type="bar" data={locData.clinics} dataKey="value" nameKey="name" color="#f59e0b" />
        <MiniChart title="حالة العمليات" type="pie" data={locData.status} dataKey="value" nameKey="name" />
      </div>
      <div className="px-6">
        <SearchBar
          fullWidth
          value={search}
          onChange={setSearch}
          placeholder="ابحث باسم المريض، نوع الإجراء..."
          filterValue={filter}
          onFilterChange={setFilter}
          filters={[
            { label: 'الكل',          value: 'all'       },
            { label: 'مكتمل',         value: 'done'      },
            { label: 'قيد الانتظار',  value: 'pending'   },
            { label: 'ملغى',          value: 'cancelled' },
          ]}
        />
      </div>
      <div className="px-6 pb-6">
        <ListView columns={operationColumns} data={filteredData} />
      </div>
      </div>
    </div>
  )
}
