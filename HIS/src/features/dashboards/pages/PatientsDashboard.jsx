import { useState } from 'react'
import { Users, BedDouble, LogOut, AlertTriangle } from 'lucide-react'
import Card from '../../dashboards/components/cards'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'

const patientStats = [
  { title: 'إجمالي المرضى',    stat: '1,240', description: 'جميع المرضى المسجلين',       icon: <Users size={20} />       },
  { title: 'المقبولون اليوم',  stat: '34',    description: 'حالات القبول الجديدة اليوم', icon: <BedDouble size={20} />   },
  { title: 'الخارجون اليوم',   stat: '18',    description: 'المرضى الذين خرجوا اليوم',   icon: <LogOut size={20} />      },
  { title: 'الحالات الحرجة',   stat: '7',     description: 'المرضى في حالة حرجة',        icon: <AlertTriangle size={20} />},
]

export default function PatientsDashboard() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [date, setDate] = useState('')

  return (
    <div className='flex flex-col'>
      <DashboardHeader
        title="لوحة المرضى"
        addLabel="إضافة موعد جديد"
        dateValue={date}
        onDateChange={setDate}
        onAdd={() => {}}
      />
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {patientStats.map((card) => (
          <Card
            key={card.title}
            title={card.title}
            stat={card.stat}
            description={card.description}
            icon={card.icon}
          />
        ))}
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
            { label: 'جميع الحالات', value: 'all'      },
            { label: 'مقبول',        value: 'admitted' },
            { label: 'خارج',         value: 'discharged' },
            { label: 'حرج',          value: 'critical' },
          ]}
        />
      </div>
    </div>
  )
}
