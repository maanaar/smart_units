import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BedDouble, LogOut, AlertTriangle } from 'lucide-react'
import Card from '../../dashboards/components/cards'
import MiniChart from '../../dashboards/components/MiniChart'
import LocationFilters from '../../dashboards/components/LocationFilters'
import { PATIENTS_DATA } from '../../dashboards/mockData/filtersMockData'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import ListView from '../../unit/components/ListView'
import { MOCK_PATIENTS_LIST } from '../../unit/mockData'

const STATS_ICONS = [<Users size={20} />, <BedDouble size={20} />, <LogOut size={20} />, <AlertTriangle size={20} />]

const patientColumns = [
  { key: 'id',        title: 'الرقم'         },
  { key: 'name',      title: 'اسم المريض'    },
  { key: 'age',       title: 'العمر'         },
  { key: 'gender',    title: 'الجنس'         },
  { key: 'status',    title: 'الحالة',  type: 'tag1' },
  { key: 'diagnosis', title: 'التشخيص', type: 'tag2' },
  { key: 'ward',      title: 'الجناح'        },
  { key: 'date',      title: 'تاريخ الدخول'  },
]


export default function PatientsDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [date, setDate] = useState('')
  const [loc, setLoc] = useState({ governorate: '', unit: '' })

  const locData = PATIENTS_DATA[loc.governorate] ?? PATIENTS_DATA.default

  const filteredData = MOCK_PATIENTS_LIST.filter((p) => {
    const matchSearch = p.name.includes(search) || search === ''
    const matchFilter =
      filter === 'all' ||
      (filter === 'admitted'   && p.status.includes('مقبول')) ||
      (filter === 'discharged' && p.status.includes('خارج'))  ||
      (filter === 'critical'   && p.status.includes('حرج'))
    return matchSearch && matchFilter
  })

  return (
    <div className='flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40' dir="rtl">
      <DashboardHeader
        title="لوحة المرضى"
        addLabel="إضافة موعد جديد"
        dateValue={date}
        onDateChange={setDate}
        onAdd={() => {}}
        filters={<LocationFilters onChange={setLoc} />}
      />
      <div className="flex-1 overflow-y-auto">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {locData.stats.map((card, i) => (
          <Card key={card.title} title={card.title} stat={card.stat} description={card.description} icon={STATS_ICONS[i]} />
        ))}
      </div>
      {/* Charts */}
      <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniChart title="قبول المرضى (أسبوعي)" type="area" data={locData.trend} dataKey="value" nameKey="name" color="#0d9488" />
        <MiniChart title="توزيع العيادات" type="bar" data={locData.wards} dataKey="value" nameKey="name" color="#6366f1" />
        <MiniChart title="توزيع الحالات" type="pie" data={locData.status} dataKey="value" nameKey="name" />
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
            { label: 'جميع الحالات', value: 'all'        },
            { label: 'مقبول',        value: 'admitted'   },
            { label: 'خارج',         value: 'discharged' },
            { label: 'حرج',          value: 'critical'   },
          ]}
        />
      </div>
      <div className="px-6 pb-6">
        <ListView columns={patientColumns} data={filteredData} onRowClick={(row) => navigate(`/unit/patients/${row.id}`)} />
      </div>
      </div>
    </div>
  )
}
