import { useState } from 'react'
import { MapPin, Building2, X, ChevronDown } from 'lucide-react'
import { EGYPT_GOVERNORATES, getUnits } from '../mockData/filtersMockData'

export default function LocationFilters({ onChange }) {
  const [gov,  setGov]  = useState('')
  const [unit, setUnit] = useState('')

  const units = getUnits(gov)

  const handleGov = (val) => {
    setGov(val)
    setUnit('')
    onChange?.({ governorate: val, unit: '' })
  }

  const handleUnit = (val) => {
    setUnit(val)
    onChange?.({ governorate: gov, unit: val })
  }

  const clearAll = () => {
    setGov('')
    setUnit('')
    onChange?.({ governorate: '', unit: '' })
  }

  const hasFilter = gov || unit

  return (
    <div className="flex items-center gap-2 flex-wrap" dir="rtl">

      {/* Governorate */}
      <div className="relative flex items-center">
        <MapPin className="absolute right-3 w-3.5 h-3.5 text-teal-500 pointer-events-none z-10" />
        <ChevronDown className="absolute left-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <select
          value={gov}
          onChange={e => handleGov(e.target.value)}
          className="appearance-none pr-8 pl-7 py-2 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-300 text-gray-700 shadow-sm min-w-[140px]"
        >
          <option value="">كل المحافظات</option>
          {EGYPT_GOVERNORATES.map(g => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
      </div>

      {/* Unit — always visible */}
      <div className="relative flex items-center">
        <Building2 className="absolute right-3 w-3.5 h-3.5 text-emerald-500 pointer-events-none z-10" />
        <ChevronDown className="absolute left-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <select
          value={unit}
          onChange={e => handleUnit(e.target.value)}
          disabled={!gov}
          className="appearance-none pr-8 pl-7 py-2 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-300 text-gray-700 shadow-sm min-w-[180px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">{gov ? 'كل الوحدات' : 'اختر المحافظة أولاً'}</option>
          {units.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasFilter && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all"
        >
          <X className="w-3.5 h-3.5" />
          مسح
        </button>
      )}

      {/* Active filter badge */}
      {hasFilter && (
        <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
          {unit || EGYPT_GOVERNORATES.find(g => g.value === gov)?.label}
        </span>
      )}
    </div>
  )
}
