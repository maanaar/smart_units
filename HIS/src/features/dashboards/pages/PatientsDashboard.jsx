import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BedDouble, LogOut, AlertTriangle } from 'lucide-react'
import Card from '../../dashboards/components/cards'
import MiniChart from '../../dashboards/components/MiniChart'
import LocationFilters from '../../dashboards/components/LocationFilters'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import ListView from '../../agial/components/ListView'
import { MOCK_PATIENTS_LIST } from '../../agial/mockData'

const admissionsTrend = [
  { name: 'الأحد', value: 28 }, { name: 'الاثنين', value: 34 },
  { name: 'الثلاثاء', value: 22 }, { name: 'الأربعاء', value: 40 },
  { name: 'الخميس', value: 31 }, { name: 'الجمعة', value: 18 },
  { name: 'السبت', value: 34 },
]
const wardData = [
  { name: 'العناية', value: 12 }, { name: 'الباطنة', value: 28 },
  { name: 'الجراحة', value: 19 }, { name: 'الكلى', value: 8 },
  { name: 'الصدرية', value: 15 }, { name: 'العظام', value: 11 },
]
const statusData = [
  { name: 'مقبول', value: 45 }, { name: 'حرج', value: 7 }, { name: 'خارج', value: 18 },
]

const patientStats = [
  { title: 'إجمالي المرضى',    stat: '1,240', description: 'جميع المرضى المسجلين',       icon: <Users size={20} />        },
  { title: 'المقبولون اليوم',  stat: '34',    description: 'حالات القبول الجديدة اليوم', icon: <BedDouble size={20} />    },
  { title: 'الخارجون اليوم',   stat: '18',    description: 'المرضى الذين خرجوا اليوم',   icon: <LogOut size={20} />       },
  { title: 'الحالات الحرجة',   stat: '7',     description: 'المرضى في حالة حرجة',        icon: <AlertTriangle size={20} /> },
]

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
      />
      <div className="flex-1 overflow-y-auto">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {patientStats.map((card) => (
          <Card key={card.title} title={card.title} stat={card.stat} description={card.description} icon={card.icon} />
        ))}
      </div>
      {/* Charts */}
      <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniChart title="قبول المرضى (أسبوعي)" type="area" data={admissionsTrend} dataKey="value" nameKey="name" color="#0d9488" />
        <MiniChart title="توزيع الأجنحة" type="bar" data={wardData} dataKey="value" nameKey="name" color="#6366f1" />
        <MiniChart title="توزيع الحالات" type="pie" data={statusData} dataKey="value" nameKey="name" />
      </div>
      <div className="px-6 pb-3">
        <LocationFilters />
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
        <ListView columns={patientColumns} data={filteredData} onRowClick={(row) => navigate(`/agial/patients/${row.id}`)} />
      </div>
      </div>
    </div>
  )
}
