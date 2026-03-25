import { CalendarDays, Plus } from 'lucide-react'

export default function DashboardHeader({ title, onAdd, addLabel = 'إضافة موعد جديد', dateFrom, dateTo, onDateFromChange, onDateToChange, filters }) {
  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm" dir="rtl">
      {/* Main row */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <h1 className="text-xl font-bold bg-gradient-to-l from-emerald-800 to-teal-600 bg-clip-text text-transparent">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
            <span className="text-xs font-semibold text-gray-500">من</span>
            <div className="relative flex items-center">
              <CalendarDays className="absolute right-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={dateFrom}
                onChange={e => onDateFromChange?.(e.target.value)}
                className="pr-7 pl-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-300 text-gray-600"
              />
            </div>
            <span className="text-xs font-semibold text-gray-500">إلى</span>
            <div className="relative flex items-center">
              <CalendarDays className="absolute right-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={dateTo}
                onChange={e => onDateToChange?.(e.target.value)}
                className="pr-7 pl-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-300 text-gray-600"
              />
            </div>
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
