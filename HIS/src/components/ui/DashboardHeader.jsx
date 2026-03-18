import { CalendarDays, Plus } from 'lucide-react'

export default function DashboardHeader({ title, onAdd, addLabel = 'إضافة موعد جديد', dateValue, onDateChange, filters }) {
  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm" dir="rtl">
      {/* Main row */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <h1 className="text-xl font-bold bg-gradient-to-l from-emerald-800 to-teal-600 bg-clip-text text-transparent">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <CalendarDays className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={dateValue}
              onChange={e => onDateChange?.(e.target.value)}
              className="pr-9 pl-4 py-2 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-300 text-gray-600 shadow-sm"
            />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        </div>
      </div>

      {/* Filters row */}
      {filters && (
        <div className="px-6 pb-3 border-t border-gray-50">
          {filters}
        </div>
      )}
    </div>
  )
}
