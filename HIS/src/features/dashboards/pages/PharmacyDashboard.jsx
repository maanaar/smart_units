import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Pill, TrendingUp, AlertTriangle } from 'lucide-react'
import Card from '../components/cards'
import MiniChart from '../components/MiniChart'
import LocationFilters from '../components/LocationFilters'
import { PHARMACY_DATA } from '../mockData/filtersMockData'
import SearchBar from '../../../components/ui/SearchBar'
import DashboardHeader from '../../../components/ui/DashboardHeader'
import ListView from '../../unit/components/ListView'
import { MOCK_PHARMACY_STATS, MOCK_PHARMACY_LIST } from '../mockData/pharmacyMockData'


const pharmacyIcons = [
  <FileText size={20} />,
  <Pill size={20} />,
  <TrendingUp size={20} />,
  <AlertTriangle size={20} />,
]

const pharmacyColumns = [
  { key: 'patient', title: 'المريض'          },
  { key: 'mrn',     title: 'رقم الملف'       },
  { key: 'drug',    title: 'الدواء'           },
  { key: 'dose',    title: 'الجرعة'          },
  { key: 'rx',      title: 'رقم الوصفة'      },
  { key: 'doctor',  title: 'الطبيب المعالج'   },
  { key: 'date',    title: 'تاريخ الوصفة'    },
  { key: 'status',  title: 'الحالة', type: 'tag1' },
]

export default function PharmacyDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loc, setLoc] = useState({ governorate: '', unit: '' })

  const locData = PHARMACY_DATA[loc.governorate] ?? PHARMACY_DATA.default

  const filteredData = MOCK_PHARMACY_LIST.filter((r) => {
    const matchSearch = r.patient.includes(search) || r.drug.toLowerCase().includes(search.toLowerCase()) || search === ''
    const matchFilter =
      filter === 'all' ||
      (filter === 'dispensed' && r.status.includes('تم الصرف'))     ||
      (filter === 'pending'   && r.status.includes('قيد الانتظار'))  ||
      (filter === 'unavailable' && r.status.includes('غير متوفر'))
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40" dir="rtl">
      <DashboardHeader
        title="الصيدلية والأدوية"
        addLabel="إضافة وصفة طبية"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onAdd={() => navigate('/unit/ReceptionPage')}
        filters={<LocationFilters onChange={setLoc} />}
      />
      <div className="flex-1 overflow-y-auto">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {locData.stats.map((card, i) => (
          <Card key={card.key} title={card.description} stat={card.stat} description="" icon={pharmacyIcons[i]} />
        ))}
      </div>
      {/* Charts */}
      <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniChart title="الوصفات (أسبوعي)" type="area" data={locData.trend} dataKey="value" nameKey="name" color="#3b82f6" />
        <MiniChart title="الأدوية الأكثر صرفاً" type="bar" data={locData.topDrugs} dataKey="value" nameKey="name" color="#8b5cf6" />
        <MiniChart title="حالة الوصفات" type="pie" data={locData.status} dataKey="value" nameKey="name" />
      </div>
      <div className="px-6">
        <SearchBar
          fullWidth
          value={search}
          onChange={setSearch}
          placeholder="ابحث باسم المريض، اسم الدواء، أو رقم الوصفة..."
          filterValue={filter}
          onFilterChange={setFilter}
          filters={[
            { label: 'الكل',         value: 'all'         },
            { label: 'تم الصرف',     value: 'dispensed'   },
            { label: 'قيد الانتظار', value: 'pending'     },
            { label: 'غير متوفر',    value: 'unavailable' },
          ]}
        />
      </div>
      <div className="px-6 pb-6">
        <ListView columns={pharmacyColumns} data={filteredData} />
      </div>
      </div>
    </div>
  )
}
